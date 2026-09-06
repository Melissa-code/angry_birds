import PhysicalWorld from './physical_world/PhysicalWorld.js';
import { loadLevelAsync } from './levels/level_loader.js';
import { Bird } from './entities/Bird.js';

const Bodies = Matter.Bodies;

export class Game {

    constructor(width, height, container) {
        this.width = width;
        this.height = height;
        this.container = container;
        this.entities = [];
        this.bodies = [];
        this.world = new PhysicalWorld(width, height, container);

        // this.container.addEventListener('click', () => {
        //     this.launchBird();
        // });
    }
  
    /**
     * règle du langage: constructeur doit toujours retourner l'objet immédiatement et synchrone
     */
    async init(currentLevel) {
        this.entities =  await loadLevelAsync(currentLevel); // return entities[]
        this.bodies = this.entities.map(entity => entity.body);
        this.world.addBodies(this.bodies);

        // catch bird with mouse
        const bird = this.entities.find(
            entityFound => entityFound instanceof Bird
        );
        this.catchBird(bird); 

        this.world.run();

        // collision detection between pig and ground
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

    launchBird() {
        const bird = this.bodies.filter(body => body.label === 'bird')[0];
        Matter.Body.setVelocity(bird, { x: 20, y: -20 });
    }

    // tirerr l'oiseau avec la souris mousemove
    // Matter.Body.setPosition(body, position {x:..., y:...}, [updateVelocity=false])
    pullBird(bird, mouseX, mouseY) {
        Matter.Body.setPosition(bird.body, { x: mouseX, y: mouseY });
    }

    //attrappe l oiseau, tire le en arriere, lâche le , il s'envole dans la direction opposée 
    catchBird(bird) {
        let isDragging = false;
        console.log('voici bird.body:', bird.body);

        this.container.addEventListener('mousedown', (event) => {
            console.log('x et y dans mousedown : ', event.clientX, event.clientY);
            // théorème de Pythagore :distance = √( (x₂-x₁)² + (y₂-y₁)² ) => hypoténuse
            const distance = Math.sqrt(
                ((event.clientX - bird.body.position.x) ** 2) + ((event.clientY - bird.body.position.y) **2)
            );
            console.log('distance : ', distance);

            if (distance < bird.body.circleRadius) {
                console.log('oiseau attrappé')
                // tirer l'oiseau
                // this.pullBird(bird, event.clientX, event.clientY);
                isDragging = true;
            } else {
                console.log('click en dehors de l oiseau');
            }
        });

        this.container.addEventListener('mousemove', (event) => {
            if (isDragging) {
                this.pullBird(bird, event.clientX, event.clientY);
            };
        });
    }


}