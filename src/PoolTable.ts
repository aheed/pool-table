import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { PhysBody } from "./PhysBody";
import { DECELERATION_M_PER_SEC2, ballRadius, tableDepth, tableThickness, tableWidth } from "./PoolGeometryConstants";

export class PoolTable extends PhysBody {

    constructor() {
        super();
        const geometry = new BoxGeometry(tableWidth, tableThickness, tableDepth, 4, 4);
        const material = new MeshBasicMaterial({ color: 0x009900, wireframe: true });
        const tableTop = new Mesh(geometry, material);
        this.addGrPrim(tableTop);
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