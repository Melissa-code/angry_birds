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
        this.isDragging = false; 
        this.startingBirdPosition = null;
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
        this.setUpSlingshot(bird); 

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

    // --- slingshot --- 

    launchBird(bird) {
        // transformer l'étirement en vitesse de tir
        const deltaX = bird.body.position.x - this.startingBirdPosition.x; 
        const deltaY = bird.body.position.y - this.startingBirdPosition.y;
        Matter.Body.setVelocity(bird.body, { x: 20, y: 20 });
    }

    releaseBird(bird) {
        this.isDragging = false;
        this.launchBird(bird);
    }
    
    pullBird(bird, mouseX, mouseY) {
        // Matter.Body.setPosition(body, position {x:..., y:...}, [updateVelocity=false])
        Matter.Body.setPosition(bird.body, { x: mouseX, y: mouseY });
    }

    //attrappe l oiseau, tire le en arriere, lâche le , il s'envole dans la direction opposée 
    setUpSlingshot(bird) {
        this.startingBirdPosition = { 
            x: bird.body.position.x, 
            y: bird.body.position.y 
        };

        this.container.addEventListener('mousedown', (event) => {
            const rect = this.container.getBoundingClientRect();

            const distance = this.#calculateDistance(
                event.clientX, 
                event.clientY, 
                bird.body.position.x, 
                bird.body.position.y
            );

            (distance < bird.body.circleRadius) ? this.isDragging = true 
            : console.log('click en dehors de l\'oiseau');
        });

        this.container.addEventListener('mousemove', (event) => {
            const rect = this.container.getBoundingClientRect();

            if (this.isDragging) {
                this.pullBird(bird, event.clientX, event.clientY);
            };
        });

        this.container.addEventListener('mouseup', (event) => {
            if (this.isDragging) {
                this.releaseBird(bird);
            }
        });
    }

    /**
     * théorème de Pythagore:distance = √( (x₂-x₁)² + (y₂-y₁)² ) => hypoténuse
     */
    #calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

}