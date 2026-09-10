const Engine = Matter.Engine;
const World = Matter.World;
const Body = Matter.Body;
const Runner = Matter.Runner;
const Render = Matter.Render;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;

export default class PhysicalWorld {

    constructor(width, height, container) {
        this.width = width;
        this.height = height;
        this.container = container;// pour add nv element dans le DOM

        this.engine = Engine.create();

        this.render = Render.create({
            element: container,
            engine: this.engine,
            options: {
                width: this.width,
                height: this.height,
                wireframes: false, //par défaut Matter.js n'affiche aucune couleur
                background: 'rgba(19, 209, 255, 0.2)', // ciel
                showAngleIndicator: true,
                showCollisions: true,
                showVelocity: true
            }
        });
    }

    // add objects to the world
    addBodies(bodies) {
        World.add(this.engine.world, bodies);
    }

    // effacer tous les objets du monde
    clear() {
        World.clear(this.engine.world, false);
    }

    getPigs() {
        const pigs = []; 
        const bodies = Composite.allBodies(this.engine.world); // récupère tous les corps du monde physique
        for (const body of bodies) {
            if (body.label === 'pig') {
                pigs.push(body);
            }
        }

        return pigs;
    }

    // run simulation (gravity, collisions, movement.....)
    run() {
        Render.run(this.render);

        const runner = Runner.create();
        Runner.run(runner, this.engine);
    }
}
