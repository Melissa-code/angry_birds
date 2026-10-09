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
        this.birds = []; // 3 oiseaux à lancer
        this.birdNumber = 1;
        this.score = 0;
        this.nextLevel = 1; 

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
       
        // Score design sur canvas 
        Matter.Events.on(this.render, 'afterRender', () => {
            this.refreshZoneInfos();
        });
    }

    refreshZoneInfos() {
        console.log('Refresh zone infos index oiseau affichage ', this.birdNumber);
        const ctx = this.render.context;
        console.log('context : ', ctx);
        ctx.fillStyle = 'black';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(
            'Oiseau ' + this.birdNumber + ' - Score : ' + this.score, 40, 40
        );
        ctx.fillText('Niveau ' + this.nextLevel, 40, 70);
    }

    filterBirdsEntities(bodies) {
        const birds = bodies.filter(body => body.label === 'bird');
        const othersEntities = bodies.filter(body => body.label !== 'bird');  
        return { birds, othersEntities }; //birds[] et othersEntities[]
    }

    // add objects to the world
    addBodies(bodies) {
        const { birds, othersEntities } = this.filterBirdsEntities(bodies);
        this.birds = birds;
        World.add(this.engine.world, this.birds[0]); 
        World.add(this.engine.world, othersEntities);
    }

    addNextBird(birdBody) {
        World.add(this.engine.world, birdBody);
    }

    removeBird(birdBody) {
        World.remove(this.engine.world, birdBody);
    }

    // effacer tous les objets du monde
    clear() {
        Matter.Events.off(this.engine); // all events 
        World.clear(this.engine.world, false);
        Render.world(this.render);
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
