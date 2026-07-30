import PhysicalWorld from './physical_world/World.js';

const Bodies = Matter.Bodies;

export class Game {

    constructor(width, height, container) {
        this.width = width;
        this.height = height;
        this.container = container;
        this.world = new PhysicalWorld(width, height, container);
        let obj = Bodies.rectangle(100, 100, 30, 30);
        this.world.addBodies([obj]);
        this.world.run();
    }
}