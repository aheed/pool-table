import { createScenarioTable } from './ScenarioFactory';
import './style.css'

import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { ballRadius } from './PoolGeometryConstants';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const color5 = new THREE.Color( 'lightgray' );
scene.background = color5;
camera.position.z = 7 * 2;
camera.position.y = 2.7 * 2;
//camera.rotateX(-0.4);
//camera.rotateY(Math.PI);


// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

// Setup our physics world
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})


const light = new THREE.AmbientLight( 0x404040, 30 ); // white light
scene.add( light );

let table =  createScenarioTable(world);
scene.add(table);

/////////////////////////
/////////////////////////
/////////////////////////

// Create a sphere body
//const radius = 0.2 // m
const sphereBody = new CANNON.Body({
  mass: 5, // kg
  shape: new CANNON.Sphere(ballRadius),
  velocity: new CANNON.Vec3(0.1, 0, -4.1),
  linearDamping: 0.01,
})
sphereBody.position.set(0, 4, 4.0) // m
world.addBody(sphereBody)

// Create a static plane for the ground
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
  shape: new CANNON.Plane(),
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
world.addBody(groundBody)

const geometry = new THREE.SphereGeometry(ballRadius)
const material = new THREE.MeshNormalMaterial()
const sphereMesh = new THREE.Mesh(geometry, material)
scene.add(sphereMesh)
////////////////////////////////////
/////////////////////////////
//////////////////////



function animate() {
  //console.log("animate");
	requestAnimationFrame( animate );
    //poolBallMesh.rotation.x += 0.01;
    //poolBallMesh.rotation.y += 0.01;
  table.updateTable(0.04);
  if (!table.anyMovement()) {
    scene.remove(table);
    // todo: dispose all table resources: geometry, material,...
    table = createScenarioTable(world);
    scene.add(table);
  }

  world.fixedStep()

  // the sphere y position shows the sphere falling
  //console.log(`Sphere y position: ${sphereBody.position.y}`)

  sphereMesh.position.copy(sphereBody.position)
  sphereMesh.quaternion.copy(sphereBody.quaternion)
  
	renderer.render( scene, camera );
}
animate();

