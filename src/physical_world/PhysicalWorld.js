const Engine = Matter.Engine;
const World = Matter.World;
const Body = Matter.Body;
const Runner = Matter.Runner;
const Render = Matter.Render;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;

export default class PhysicalWorld {

    BACKGROUND = './src/assets/images/backgrounds/fonds';

    constructor(width, height, container) {
        this.width = width;
        this.height = height;
        this.container = container;// pour add nv element dans le DOM
        this.birds = []; // 3 oiseaux à lancer
        this.birdNumber = 1;
        this.score = 0;
        this.nextLevel = 1; 
        this.lastImage = 0; // pour ralentir le rendu à 30 img/sec
        this.interval = 1000 / 30;  // 30 img/s ->33,33 ms

        this.engine = Engine.create();

        this.render = Render.create({
            element: container,
            engine: this.engine,
            options: {
                width: this.width,
                height: this.height,
                wireframes: false, //par défaut Matter.js n'affiche aucune couleur
                background: `${this.BACKGROUND}${this.nextLevel}.png`, 
                showAngleIndicator: false,
                showCollisions: false,
                showVelocity: false
            }
        });
       
        // Score design sur canvas afficé après le rendu de Matter.js
        Matter.Events.on(this.render, 'afterRender', () => {
            this.refreshZoneInfos();
        });
    }

    // score , nb oiseau dispo, level
    refreshZoneInfos() {
        const ctx = this.render.context;
        ctx.fillStyle = 'black';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(
            'Oiseau ' + this.birdNumber + ' - Score : ' + this.score, 50, 60
        );
        ctx.fillText('Niveau ' + this.nextLevel, 50, 90);
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
        let counter = 1; 

        for (const body of bodies) {
            if (body.label === 'pig') {
                pigs.push(body);
                counter++;
            }
        }
        return pigs;
    }

    // 30 img/sec au lieu de 60 (Render.run(this.render))
    slowFrame(now) {
        // appartient à window.requestAnimationFrame() JS natif
        // navigateur appelle slowFrame() à chaque refresh  
        requestAnimationFrame( (time)=> this.slowFrame(time)); 
    
        // nothing 
        if ((now - this.lastImage) < this.interval) return; 
        
        this.lastImage = now;

        // engine is a controller that manages updating the simulation of the world
        Matter.Engine.update(this.engine, this.interval); // met à jour engine (positions en mémoire)
        Matter.Render.world(this.render);  //redessine
    }


    // run simulation (gravity, collisions, movement.....)
    run() {
        Render.run(this.render);
        const runner = Runner.create();
        Runner.run(runner, this.engine);

        // custom run() to slow down the rendering to 30 img/sec
        // requestAnimationFrame( (time)=> this.slowFrame(time)); 
    }
}
