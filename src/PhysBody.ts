import { Euler, Mesh, Object3D, Vector3 } from 'three';

export class PhysBody extends Object3D{
    public physVelocity = new Vector3()
    public physRotation = new Euler()
    public subBodies: PhysBody[];

    constructor() {
        super()
        this.subBodies = [];
    }

    addBody = (newSubBody: PhysBody) => {
        this.subBodies.push(newSubBody);
        this.add(newSubBody);
    }

    addGrPrim = (newPrim: Mesh) => this.add(newPrim);
}
