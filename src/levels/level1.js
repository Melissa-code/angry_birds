import { createBird } from '../factories/birdFactory.js';
import { createPig } from '../factories/pigFactory.js';
import { createBlock } from '../factories/blockFactory.js';

export function loadLevel1(physicalWorld) {
    const ground = createBlock(400, 590, 800, 20, { isStatic: true });
    const pig = createPig(600, 500);
    const bird = createBird(100, 400);

    physicalWorld.addBodies([ground, pig, bird]);
}