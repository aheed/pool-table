import { PhysBody } from './PhysBody';
import './style.css'
//import typescriptLogo from './typescript.svg'
//import viteLogo from '/vite.svg'
//import { setupCounter } from './counter.ts'
import * as THREE from 'three';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Define the sphere geometry
const radius = 1; // Radius of the pool ball
const segments = 32; // Number of horizontal and vertical segments
const poolBallGeometry = new THREE.SphereGeometry(radius, segments, segments);
const poolBallMaterial = new THREE.MeshBasicMaterial({ color: 0x990000, wireframe: true });
// Create the pool ball mesh
const poolBallMesh = new THREE.Mesh(poolBallGeometry, poolBallMaterial);
//poolBallMesh.translateX(-4.5);

const color5 = new THREE.Color( 'lightgray' );
scene.background = color5;

scene.add(poolBallMesh);
camera.position.z = 5;

/////
const pbg3 = new THREE.SphereGeometry(0.2, 32, 16);
const pbm3 = new THREE.MeshBasicMaterial({ color: 0x22D377, wireframe: true });
const pbmesh3 = new THREE.Mesh(pbg3, pbm3);
const midobj = new THREE.Object3D();
midobj.translateX(1.2);
midobj.translateY(3.2);
midobj.add(pbmesh3);
poolBallMesh.add(midobj);
/////

////////
const aBody = new PhysBody();
const pbg2 = new THREE.SphereGeometry(0.5, 32, 16);
const pbm2 = new THREE.MeshBasicMaterial({ color: 0x223377, wireframe: true });
// Create the pool ball mesh
const pbmesh2 = new THREE.Mesh(pbg2, pbm2);
aBody.grPrims.push(pbmesh2)


////////

///
function animate() {
	requestAnimationFrame( animate );
    poolBallMesh.rotation.x += 0.01;
    poolBallMesh.rotation.y += 0.01;
	renderer.render( scene, camera );
}
animate();

/*
to do:
verify Object3D hierarchy is rendered recursively automatically
Derive PhysBody from Object3D
  velocity, rotation: Matrix4
  update function (recursive) for updating position and rotation by dt.
  Child bodies in separate collection
  Child bodies AND graphical primitives shall be in the children collection
PoolBall, derived from PhysBody
  Construct by number
  Does not need any other properties than PhysBody (?)
PoolTable, derived from PhysBody
  Update velocities and rotations of pool balls. Find out if there is any ball movement.
Drop mathjs dependency

*/