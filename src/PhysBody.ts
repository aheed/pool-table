import { Mesh, Object3D, Vector3 } from 'three';

export class PhysBody extends Object3D{
    public physVelocity = new Vector3();
    public physRotationAxisNormalized = new Vector3();
    public physRotationRadPerSec: number = 0;
    public subBodies: PhysBody[] = [];

    /*constructor() {
        super()
        this.subBodies = [];
    }*/

    addBody = (newSubBody: PhysBody) => {
        this.subBodies.push(newSubBody);
        this.add(newSubBody);
    }

    addGrPrim = (newPrim: Mesh) => this.add(newPrim);

    update = (dt: number) => {
        this.subBodies.forEach(sb => sb.update(dt));

        // position
        const ds = this.physVelocity.clone().multiplyScalar(dt);
        this.position.add(ds)

        // orientation
        const angle = this.physRotationRadPerSec * dt;
        this.rotateOnAxis(this.physRotationAxisNormalized, angle);
    }

    anyMovement = (): Boolean => {
        if(this.physVelocity.length() || this.physRotationRadPerSec) {
            return true;
        }

        return this.subBodies.some(sb => sb.anyMovement());
    }

}
