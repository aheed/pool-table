import { createScenarioTable } from './ScenarioFactory';
import './style.css'

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const color5 = new THREE.Color( 'lightgray' );
scene.background = color5;
camera.position.z = 7;
camera.position.y = 2.7;
camera.rotateX(-0.8);

// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );


const loader = new GLTFLoader();

loader.load( 'simple-pool-table/source/noballs.glb', function ( gltf ) {

  const sfac = 0.902652208826061;
  let scaleMat = new THREE.Matrix4().makeScale(sfac, sfac, sfac);
  gltf.scene.applyMatrix4(scaleMat);
  gltf.scene.translateX(1.4158680300807);
  gltf.scene.translateY(0.1);
  gltf.scene.translateZ(5.65198550990462);
  gltf.scene.rotateY(Math.PI / 2);
	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

const light = new THREE.AmbientLight( 0x404040, 30 ); // white light
scene.add( light );

let table =  createScenarioTable();
scene.add(table);


function animate() {
  //console.log("animate");
	requestAnimationFrame( animate );
    //poolBallMesh.rotation.x += 0.01;
    //poolBallMesh.rotation.y += 0.01;
  table.updateTable(0.04);
  if (!table.anyMovement()) {
    scene.remove(table);
    // todo: dispose all table resources: geometry, material,...
    table = createScenarioTable();
    scene.add(table);
  }
  
	renderer.render( scene, camera );
}
animate();

/*
to do:
verify Object3D hierarchy is rendered recursively automatically*
Derive PhysBody from Object3D*
  (velocity, rotation: Matrix4)
  velocity: THREE.Vector3
  rotation: THREE.Vector3 + number
  update function (recursive) for updating position and rotation by dt.
  Child bodies in separate collection
  Child bodies AND graphical primitives shall be in the children collection
PoolBall ( derived from PhysBody)*
  Construct by number*
  Does not need any other properties than PhysBody (?). Right, so no need for a class.
    So it should be a static factory function instead of subclass ? yes*
PoolTable, derived from PhysBody*
  Update velocities and rotations of pool balls. Find out if there is any ball movement.*
Drop mathjs dependency*
Immutable classes?

Add light source(s)*
Tune imported 3D model size and position.*
Option to shade nicely, keep option for wireframe mode for debugging
Try out physics engine
  https://threejs.org/docs/#manual/en/introduction/Libraries-and-Plugins
Change favicon

*/

/*
Given:
local velocities and angular velocities
dt
local position
local orientation

Calculate:
  new local position
  new local orientation

*/

