import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";
import { PhysBody } from "./PhysBody";
import { ballRadius } from "./PoolGeometryConstants";

export const createPoolBall = (ballNumber: number): PhysBody => {
    if (ballNumber < 0 || ballNumber > 15) {
        console.error(`Pool ball number ${ballNumber} is out of range`);
        ballNumber = 1;
    }

    const color = 0x223300 + 10 * ballNumber; // temp
    const radius = ballRadius;
    const segments = 16; // Number of horizontal and vertical segments
    const poolBallGeometry = new SphereGeometry(radius, segments, segments);
    const poolBallMaterial = new MeshBasicMaterial({ color: color, wireframe: true });
    const mesh = new Mesh(poolBallGeometry, poolBallMaterial);
    const ret = new PhysBody();
    ret.add(mesh);
    return ret;
}