import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";
import { PhysBody } from "./PhysBody";

export const createPoolBall = (ballNumber: number): PhysBody => {
    if (ballNumber < 0 || ballNumber > 15) {
        console.error(`Pool ball number ${ballNumber} is out of range`);
        ballNumber = 1;
    }

    const color = 0x223300 + 10 * ballNumber; // temp
    const radius = 1; // Radius of the pool ball
    const segments = 32; // Number of horizontal and vertical segments
    const poolBallGeometry = new SphereGeometry(radius, segments, segments);
    const poolBallMaterial = new MeshBasicMaterial({ color: color, wireframe: true });
    const mesh = new Mesh(poolBallGeometry, poolBallMaterial);
    const ret = new PhysBody();
    ret.addGrPrim(mesh);
    return ret;
}