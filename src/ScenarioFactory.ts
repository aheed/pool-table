import { createPoolBall } from "./PoolBallFactory";
import * as CANNON from 'cannon-es'
import { PoolTable } from "./PoolTable";

export const createScenarioTable = (world: CANNON.World): PoolTable => {
    const table = new PoolTable(world);
    const ball1 = createPoolBall(3);
    ball1.physVelocity.x = 1.0;
    ball1.physVelocity.z = 2.4;
    table.addBall(ball1);
    const ball2 = createPoolBall(4);
    ball2.physVelocity.x = 0.2;
    ball2.physVelocity.z = 3.15;
    table.addBall(ball2);
    return table;
  }