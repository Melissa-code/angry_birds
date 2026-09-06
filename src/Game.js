import PhysicalWorld from './physical_world/PhysicalWorld.js';
import { loadLevel } from './levels/level_loader.js';
import level1 from './levels/data/level1.js';
import { Bird } from './entities/Bird.js';

const Bodies = Matter.Bodies;

export class Game {

    constructor(width, height, container) {
        this.width = width;
        this.height = height;
        this.container = container;

        this.container.addEventListener('click', () => {
            this.lancerOiseau();
        });
        this.world = new PhysicalWorld(width, height, container);
        this.currentLevel = 1; 
        this.entities = loadLevel(this.currentLevel); // return entities[]
        this.bodies = this.entities.map(entity => entity.body);
        this.world.addBodies(this.bodies);
       
        this.world.run();
        Matter.Events.on(this.world.engine,'collisionStart', (event) => {
            const pairs = event.pairs;
            pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;
                if (bodyA.label === 'ground' && bodyB.label === 'pig' || bodyA.label === 'pig' && bodyB.label === 'ground') {
                    console.log('Collision entre le cochon et le terrain !');
                }
            });
        });
    }

    lancerOiseau() {
        const bird = this.bodies.filter(body => body.label === 'bird')[0];
        Matter.Body.setVelocity(bird, { x: 20, y: -20 });
    }
}