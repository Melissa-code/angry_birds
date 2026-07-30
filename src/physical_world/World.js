// Engine et World globaux de Matter.js
const Engine = Matter.Engine;
const World = Matter.World;
const Body = Matter.Body;
const Runner = Matter.Runner;
const Render = Matter.Render;
const Bodies = Matter.Bodies;

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
                showAngleIndicator: true,
                showCollisions: true,
                showVelocity: true
            }
        });

        var ground = Bodies.rectangle(this.width/2, this.height-5, this.width, 10, { isStatic: true, render: { fillStyle: '#060a19' } });
        this.addBodies([ground]);
    }

    // add objects to the world
    addBodies(bodies) {
        World.add(this.engine.world, bodies);
    }

    // run simulation (gravity, collisions, movement.....)
    run() {
        Render.run(this.render);

        const runner = Runner.create();
        Runner.run(runner, this.engine);
    }
}
