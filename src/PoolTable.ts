import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { PhysBody } from "./PhysBody";

export class PoolTable extends PhysBody {

    constructor() {
        super();
        const geometry = new BoxGeometry(3.0, 0.2, 6.0, 4, 4);
        const material = new MeshBasicMaterial({ color: 0x009900, wireframe: true });
        const tableTop = new Mesh(geometry, material);
        this.addGrPrim(tableTop);
    }
    
    updateTable = (dt: number) => {
        this.subBodies.forEach(sb => sb.update(dt));

        // Update speed and rotation for all balls on the table
        // TBD

        this.update(dt);
    }
}