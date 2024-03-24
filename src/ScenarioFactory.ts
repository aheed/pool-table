import { createPoolBall } from "./PoolBallFactory";
import { PoolTable } from "./PoolTable";

export const createScenarioTable = (): PoolTable => {
    const table = new PoolTable()
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