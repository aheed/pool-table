import * as math from 'mathjs';
import { Mesh } from 'three';

export class PhysBody {
    transMat = math.identity(4, 4);
    public subBodies: Body[];
    public grPrims: Mesh[];
    lights: any[];

    constructor() {
        this.subBodies = [];
        this.grPrims = [];
        this.lights = [];
    }

    addBody = (newSubBody: Body) => {
        this.subBodies.push(newSubBody);
    }

    addLight = (newLight: any) => {
        this.lights.push(newLight);
    }
}
