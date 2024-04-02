import { createScenarioTable } from './ScenarioFactory';
import './style.css'

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es'
import { ballRadius } from './PoolGeometryConstants';

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

// Setup our physics world
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})

/////////////////////////
//////////////////////////////////////////////////////////////////////
// Get static structures from loaded model

function ShapeToStaticBody(shape: CANNON.Shape): CANNON.Body {
  const trimeshBody: CANNON.Body = new CANNON.Body({ mass: 0 }); // mass 0 indicates static object
  trimeshBody.addShape(shape);
  return trimeshBody;
}

/*
https://sbcode.net/threejs/physics-cannonjs/
// example CreateTrimesh usage
const torusKnotShape = CreateTrimesh(torusKnotMesh.geometry)
const torusKnotBody = new CANNON.Body({ mass: 1 })
torusKnotBody.addShape(torusKnotShape)
torusKnotBody.position.x = torusKnotMesh.position.x
torusKnotBody.position.y = torusKnotMesh.position.y
torusKnotBody.position.z = torusKnotMesh.position.z
world.addBody(torusKnotBody)
*/
function CreateTrimesh(geometry: THREE.BufferGeometry, scale: number = 1.0) {
    const vertices = (geometry.attributes.position as THREE.BufferAttribute).array.map((pos) => pos * scale);
    const indices = Object.keys(vertices).map(Number)
    return new CANNON.Trimesh(vertices as unknown as number[], indices)
}


/////////////////////////
//////////////////////////////////////////////////////////////////////



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

  const cushMesh = gltf.scene.children.find(mesh => mesh.name == "SketchUp053");
  const cushion = cushMesh?.children[1];
  const meshScale = cushMesh?.scale.x ?? 1.0; //assume same scale in all 3 dimensions
  //if (cushion instanceof THREE.Mesh<THREE.BufferGeometry, THREE.Material, THREE.Object3DEventMap>  ) {    
  const geom = (cushion as THREE.Mesh).geometry as THREE.BufferGeometry;
  const trimesh = CreateTrimesh(geom, sfac * meshScale);
  const cushionBody = ShapeToStaticBody(trimesh);
  cushionBody.position.x = gltf.scene.position.x
  cushionBody.position.y = gltf.scene.position.y
  cushionBody.position.z = gltf.scene.position.z
  cushionBody.quaternion = new CANNON.Quaternion(gltf.scene.quaternion.x, gltf.scene.quaternion.y, gltf.scene.quaternion.z, gltf.scene.quaternion.w);
  // scale??????
  world.addBody(cushionBody)
  
}, undefined, function ( error ) {

	console.error( error );

} );

const light = new THREE.AmbientLight( 0x404040, 30 ); // white light
scene.add( light );

let table =  createScenarioTable();
scene.add(table);

/////////////////////////
/////////////////////////
/////////////////////////

// Create a sphere body
//const radius = 0.2 // m
const sphereBody = new CANNON.Body({
  mass: 5, // kg
  shape: new CANNON.Sphere(ballRadius),
  velocity: new CANNON.Vec3(0.1, 0, -3.5),
  linearDamping: 0.01,
})
sphereBody.position.set(0, 4, 8.0) // m
world.addBody(sphereBody)

// Create a static plane for the ground
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
  shape: new CANNON.Plane(),
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
world.addBody(groundBody)

//const rad = 0.4 // m
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
    table = createScenarioTable();
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
Change favicon*

Get selected meshes from loaded model and turn into Cannon static bodies.
  For debug: also add copies of those meshes to the scene (change its color), move it up a bit. To make sure we got the right mesh.
Change table top from plane to trimesh.
Add plane at floor level. For balls jumping over the edge and perhaps bottomless pockets.
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

