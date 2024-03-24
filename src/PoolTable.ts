import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { PhysBody } from "./PhysBody";
import { ballRadius, tableDepth, tableThickness, tableWidth } from "./PoolGeometryConstants";

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
        this.subBodies.forEach(sb => sb.update(dt));

        //// Update speed and rotation for all balls on the table

        // Cushion collision detection
        const maxOffsetX = tableWidth / 2 - ballRadius;
        const maxOffsetZ = tableDepth / 2 - ballRadius;
        this.subBodies.forEach(sb => {
            if (sb.position.x > maxOffsetX || sb.position.x < -maxOffsetX ) {
                sb.physVelocity.x = -sb.physVelocity.x;
            }

            if (sb.position.z > maxOffsetZ || sb.position.z < -maxOffsetZ ) {
                sb.physVelocity.z = -sb.physVelocity.z;
            }
        });
        
        // Simplified cushion bounce effect

        // TBD

        this.update(dt);
    }
}