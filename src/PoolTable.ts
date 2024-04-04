import { BoxGeometry, BufferAttribute, BufferGeometry, Group, Matrix4, Mesh, MeshBasicMaterial, Object3D, Vector3 } from "three";
import { PhysBody } from "./PhysBody";
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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
        const geometry = new BoxGeometry(tableWidth, tableThickness * 2, tableDepth, 4, 4);
        const material = new MeshBasicMaterial({ color: 0x005500, wireframe: true });
        const tableTop = new Mesh(geometry, material);
        this.add(tableTop);

        const loader = new GLTFLoader();
        const thisTable = this;

        const addMeshAsBody = (gltf:GLTF, object3D: Object3D, tX: number, tY: number, tZ: number, rotY: number, scale: number) => {
            
            const geom = (object3D as Mesh).geometry as BufferGeometry;
            //geom.applyMatrix4(transform);

            geom.scale(scale, scale, scale);
            geom.rotateY(rotY);
            geom.translate(tX, tY, tZ);

            const trimesh = CreateTrimesh(geom);
            const cushionBody = ShapeToStaticBody(trimesh);
            /*cushionBody.position.x = gltf.scene.position.x
            cushionBody.position.y = gltf.scene.position.y
            cushionBody.position.z = gltf.scene.position.z
            cushionBody.quaternion = new CANNON.Quaternion(gltf.scene.quaternion.x, gltf.scene.quaternion.y, gltf.scene.quaternion.z, gltf.scene.quaternion.w);
            */
            world.addBody(cushionBody)
        }

        const addMeshAsBodyByName = (gltf:GLTF, name: string, tX: number, tY: number, tZ: number, rotY: number, scale: number) => {
            const mesh = gltf.scene.children.find(mesh => mesh.name == name);
            if (!mesh) {
                console.error(`could not load object "${name}"`)
                return;
            }
            //mesh.applyMatrix4(transform);            
            const meshScale = (mesh.scale.x ?? 1.0) * scale; //assume same scale in all 3 dimensions
            mesh.scale.set(1.0, 1.0, 1.0);
            thisTable.add( mesh);
            if ( mesh instanceof Group) {
                mesh.children.forEach(obj => addMeshAsBody(gltf, obj, tX, tY, tZ, rotY, meshScale));
                return;
            }

            addMeshAsBody(gltf, mesh, tX, tY, tZ, rotY, meshScale);
        }

        loader.load( 'simple-pool-table/source/noballs.glb', function ( gltf ) {

            const sfac = 0.902652208826061;
            let scaleMat = new Matrix4().makeScale(sfac, sfac, sfac);
            let transMat = new Matrix4().makeTranslation(new Vector3(1.4158680300807, 0.1, 5.65198550990462));
            let rotMat = new Matrix4().makeRotationY(Math.PI / 2);
            /*gltf.scene.applyMatrix4(scaleMat);
            gltf.scene.translateX(1.4158680300807);
            gltf.scene.translateY(0.1);
            gltf.scene.translateZ(5.65198550990462);
            gltf.scene.rotateY(Math.PI / 2);
            
            */
            let modelMat = rotMat.premultiply(transMat).multiply(scaleMat);
            //gltf.scene.applyMatrix4(modelMat);
            //thisTable.add( gltf.scene );
            //addMeshAsBodyByName(gltf, "SketchUp053", modelMat);
            addMeshAsBodyByName(gltf, "SketchUp053", 1.4158680300807, 0.1, 5.65198550990462, Math.PI / 2, sfac);
            addMeshAsBodyByName(gltf, "SketchUp026", 1.4158680300807, 0.1, 5.65198550990462, Math.PI / 2, sfac);
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