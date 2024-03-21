import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import * as THREE from 'three';

/*document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`
*/

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

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

const color5 = new THREE.Color( 'lightgray' );
scene.background = color5;

scene.add(poolBallMesh);
camera.position.z = 5;

///
function animate() {
	requestAnimationFrame( animate );
    poolBallMesh.rotation.x += 0.01;
    poolBallMesh.rotation.y += 0.01;
	renderer.render( scene, camera );
}
animate();

