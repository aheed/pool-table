import { createScenarioTable } from './ScenarioFactory';
import './style.css'

import * as THREE from 'three';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const color5 = new THREE.Color( 'lightgray' );
scene.background = color5;
camera.position.z = 5;
camera.position.y = 0.7;


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
Derive PhysBody from Object3D
  (velocity, rotation: Matrix4)
  velocity: THREE.Vector3
  rotation: THREE.Vector3 + number
  update function (recursive) for updating position and rotation by dt.
  Child bodies in separate collection
  Child bodies AND graphical primitives shall be in the children collection
PoolBall, derived from PhysBody
  Construct by number
  Does not need any other properties than PhysBody (?)
    So it should be a static factory function instead of subclass ?
PoolTable, derived from PhysBody
  Update velocities and rotations of pool balls. Find out if there is any ball movement.
Drop mathjs dependency*
Immutable classes?

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

