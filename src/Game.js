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
        this.birds = [];
        this.currentIndexBird = 0;
        this.currentBird = null; 
        this.world = new PhysicalWorld(width, height, container);
        this.isDragging = false; 
        this.startingBirdPosition = null;
        this.currentLevel = 0; 
    }
  
    /**
     * règle du langage constructeur doit toujours retourner l'objet immédiatement et synchrone
     */
    async init(currentLevel) {
        this.currentLevel = currentLevel; // pour mémoriser le niveau en cours
        this.entities = await loadLevelAsync(currentLevel); // return entities[]
        this.bodies = this.entities.map(entity => entity.body);
        this.world.addBodies(this.bodies); //ajoute les bodies dans le monde physique

        // 3 birds[]
        this.birds = this.entities.filter(
            entityFound => entityFound instanceof Bird
        );
        this.currentBird = this.birds[this.currentIndexBird];

        this.setUpSlingshot(); 

        this.world.run();

        // collision detection between pig and ground
        Matter.Events.on(this.world.engine,'collisionStart', (event) => {
            const pairs = event.pairs;

            pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;
                const pig = this.detectCollision(bodyA, bodyB, 'pig');

                if (pig) {
                    pig.isActive = false; // le cochon est touché
                } 
                const bird = this.detectCollision(bodyA, bodyB, 'bird');
                if (bird) {
                    console.log("bird" , bird)
                }
                if (bird && bird.isActive) {
                    bird.isActive = false; // l'oiseau est touché
                    console.log('L\'oiseau est touché !');
                    this.addNextBird();
                }
            });

            this.gameOver();
        });

    }

    detectCollision(bodyA, bodyB, animal){
        if ((bodyA.label === 'ground' && bodyB.label === animal) 
            || (bodyA.label === animal && bodyB.label === 'ground')) {
            console.log('Collision entre ' + animal + ' et le terrain !');

            if (bodyA.label === animal) {
                return bodyA; // le cochon est touché
            } else {
                return bodyB; 
            }
        }
        return null;
    }

    addNextBird() {
        this.currentIndexBird ++;

        if (this.currentIndexBird < this.birds.length) {
            this.currentBird = this.birds[this.currentIndexBird];
            this.world.addNextBird(this.currentBird.body); // monde phys
        } else {
            console.log('Il n\'y a plus d\'oiseaux');
        }
    }

    gameOver() {
        const pigs = this.world.getPigs(); 
        const activePigs = pigs.filter(pig => pig.isActive);

        if (this.currentIndexBird >= this.birds.length - 1 && activePigs.length > 0) {
            console.log('GAME OVER !')
        } else if (activePigs.length === 0) {
            console.log('Tous les cochons ont été touchés ! GAGNE !');
            // afficher un message de victoire ou passer au niveau suivant
            this.showVictoryMessage(); 
        }
    }

    showVictoryMessage() {
        const victoryModal = document.querySelector('#victory-modal');
        
        if (victoryModal) {
            victoryModal.style.display = 'flex';
        }

        const nextLevelBtn = document.querySelector('#next-level-btn');

        if (nextLevelBtn) {
            nextLevelBtn.addEventListener('click', () => {
                victoryModal.style.display = 'none';
                this.loadNextLevel(); 
            });
        }
    }

    loadNextLevel() {
        const nextLevel = this.currentLevel +1; 
    
        this.world.clear(); // efface le monde physique
        this.currentIndexBird = 0; 
        this.currentBird = null; 

        this.init(nextLevel); 
    }

    // --- slingshot --- 

    launchBird() {
        Matter.Body.setStatic(this.currentBird.body, false); 
        const deltaX = this.startingBirdPosition.x - this.currentBird.body.position.x;
        const deltaY = this.startingBirdPosition.y - this.currentBird.body.position.y;
        
        const launchVelocity = {
            x: deltaX * 0.2, // ajuster la vitesse de lancement selon vos besoins
            y: deltaY * 0.2
        };

        Matter.Body.setVelocity(this.currentBird.body, launchVelocity); 
    }

    releaseBird() {
        this.isDragging = false;
        this.launchBird();
    }
    
    pullBird(mouseX, mouseY) {
        // Matter.Body.setPosition(body, position {x:..., y:...}, [updateVelocity=false])
        Matter.Body.setPosition(this.currentBird.body, { x: mouseX, y: mouseY });
    }

    //attrappe l oiseau, tire le en arriere, lâche le , il s'envole dans la direction opposée 
    setUpSlingshot() {
        this.startingBirdPosition = { 
            x: this.currentBird.body.position.x, 
            y: this.currentBird.body.position.y 
        };

        this.container.addEventListener('mousedown', (event) => {
            const distance = this.#calculateDistance(
                event.clientX, 
                event.clientY, 
                this.currentBird.body.position.x, 
                this.currentBird.body.position.y
            );

            (distance < this.currentBird.body.circleRadius) ? this.isDragging = true 
            : console.log('clic en dehors de l\'oiseau');
        });

        this.container.addEventListener('mousemove', (event) => {
            if (this.isDragging) {
                this.pullBird(event.clientX, event.clientY);
            };
        });

        this.container.addEventListener('mouseup', (event) => {
            if (this.isDragging) {
                this.releaseBird();
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