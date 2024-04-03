import { BoxGeometry, BufferAttribute, BufferGeometry, Matrix4, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { PhysBody } from "./PhysBody";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es'
import { DECELERATION_M_PER_SEC2, MIN_BALL_SPEED_M_PER_SEC, ballRadius, tableDepth, tableThickness, tableWidth } from "./PoolGeometryConstants";

function ShapeToStaticBody(shape: CANNON.Shape): CANNON.Body {
    const trimeshBody: CANNON.Body = new CANNON.Body({ mass: 0 }); // mass 0 indicates static object
    trimeshBody.addShape(shape);
    return trimeshBody;
  }

function CreateTrimesh(geometry: BufferGeometry, scale: number = 1.0) {
    const vertices = (geometry.attributes.position as BufferAttribute).array.map((pos) => pos * scale);
    const indices = Object.keys(vertices).map(Number)
    return new CANNON.Trimesh(vertices as unknown as number[], indices)
}

export class PoolTable extends PhysBody {

    constructor(world: CANNON.World) {
        super();
        /*const geometry = new BoxGeometry(tableWidth, tableThickness, tableDepth, 4, 4);
        const material = new MeshBasicMaterial({ color: 0x009900, wireframe: true });
        const tableTop = new Mesh(geometry, material);
        this.add(tableTop);*/

        const loader = new GLTFLoader();
        const thisTable = this;

        loader.load( 'simple-pool-table/source/noballs.glb', function ( gltf ) {

            const sfac = 0.902652208826061;
            let scaleMat = new Matrix4().makeScale(sfac, sfac, sfac);
            gltf.scene.applyMatrix4(scaleMat);
            gltf.scene.translateX(1.4158680300807);
            gltf.scene.translateY(0.1);
            gltf.scene.translateZ(5.65198550990462);
            gltf.scene.rotateY(Math.PI / 2);
            thisTable.add( gltf.scene );

            const cushMesh = gltf.scene.children.find(mesh => mesh.name == "SketchUp053");
            const cushion = cushMesh?.children[1];
            const meshScale = cushMesh?.scale.x ?? 1.0; //assume same scale in all 3 dimensions
            const geom = (cushion as Mesh).geometry as BufferGeometry;
            const trimesh = CreateTrimesh(geom, sfac * meshScale);
            const cushionBody = ShapeToStaticBody(trimesh);
            cushionBody.position.x = gltf.scene.position.x
            cushionBody.position.y = gltf.scene.position.y
            cushionBody.position.z = gltf.scene.position.z
            cushionBody.quaternion = new CANNON.Quaternion(gltf.scene.quaternion.x, gltf.scene.quaternion.y, gltf.scene.quaternion.z, gltf.scene.quaternion.w);
            world.addBody(cushionBody)
        
        }, undefined, function ( error ) {

            console.error( error );

        } );
    }

    addBall = (ball: PhysBody) => {
        //Todo: add params for x,z coordinates

        // place ball bottom at table surface height
        ball.position.y = ballRadius + tableThickness / 2;
        //ball.position.x = - tableWidth / 2; //temp
        this.addBody(ball);
    }
    
    updateTable = (dt: number) => {

        //// Update speed and rotation for all balls on the table
        this.physVelocity.multiplyScalar(DECELERATION_M_PER_SEC2 * dt);
        
        // update positions and orientations
        //this.subBodies.forEach(sb => sb.update(dt));

        
        const maxOffsetX = tableWidth / 2 - ballRadius;
        const maxOffsetZ = tableDepth / 2 - ballRadius;
        this.subBodies.forEach(sb => {

            //// Update speed and rotation for all balls on the table
            //let reverseVelo = new Vector3(-sb.physVelocity.x, 0, -sb.physVelocity.z); 
            let horizVelo = new Vector3(sb.physVelocity.x, 0, sb.physVelocity.z);
            let veloChange = horizVelo
                .clone()
                .negate()
                .normalize()
                .multiplyScalar(DECELERATION_M_PER_SEC2 * dt);
            if (veloChange.length() > horizVelo.length()) {
                veloChange = horizVelo.clone().negate();
            }
            else if (horizVelo.length() > 0) {
            }
            sb.physVelocity.add(veloChange);

            if (horizVelo.length() < MIN_BALL_SPEED_M_PER_SEC) {
                sb.physVelocity.set(0, 0, 0);
            }

            // update positions and orientations
            sb.update(dt)

            // Cushion collision detection
            if (sb.position.x > maxOffsetX || sb.position.x < -maxOffsetX ) {
                // Simplified cushion bounce effect
                sb.physVelocity.x = -sb.physVelocity.x;
            }

            // Cushion collision detection
            if (sb.position.z > maxOffsetZ || sb.position.z < -maxOffsetZ ) {
                // Simplified cushion bounce effect
                sb.physVelocity.z = -sb.physVelocity.z;
            }
        });

        // TBD

        //this.update(dt);
    }
}