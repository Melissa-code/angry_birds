import PhysicalWorld from './physical_world/PhysicalWorld.js';
import { loadLevel } from './levels/level_loader.js';
import level1 from './levels/level1.js';

const Bodies = Matter.Bodies;

export class Game {

    constructor(width, height, container) {
        this.width = width;
        this.height = height;
        this.container = container;
        this.world = new PhysicalWorld(width, height, container);
        this.entities = loadLevel(level1); // return entities[]
        const bodies = this.entities.map(entity => entity.body);
        this.world.addBodies(bodies);
        // let obj = Bodies.rectangle(100, 100, 30, 30);
        // this.world.addBodies([obj]);
        this.world.run();
    }
}