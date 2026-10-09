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
        this.world.score = 0; 

        const nextLevelBtn = document.querySelector('#next-level-btn');
        if (nextLevelBtn) {
            nextLevelBtn.addEventListener('click', this.closeModal.bind(this));
        }
    }
  
    /**
     * règle du langage constructeur doit toujours retourner l'objet immédiatement et synchrone
     */
    async init(currentLevel) {
        this.currentLevel = currentLevel; // pour mémoriser le niveau en cours
        this.entities = await loadLevelAsync(currentLevel); // return entities[]
        this.bodies = this.entities.map(entity => entity.body);
        this.world.addBodies(this.bodies); //ajoute les bodies dans le monde physique
        this.hasWon = false;
        this.world.refreshZoneInfos();

        // 3 ou 4 birds[]
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
                if (pig && pig.isActive) {
                    pig.isActive = false; // le cochon est touché
                    this.world.score += 100;
                    this.world.refreshZoneInfos(); 
                } 

                const bird = this.detectCollision(bodyA, bodyB, 'bird');
                if (bird && bird.isActive) {
                    bird.isActive = false; // l'oiseau est touché
                    this.addNextBird();
                }
            });

            this.gameOver();
        });
    }

    detectCollision(bodyA, bodyB, animal){
        if ((bodyA.label === 'ground' && bodyB.label === animal) 
            || (bodyA.label === animal && bodyB.label === 'ground')) {

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
            this.world.birdNumber = this.currentIndexBird + 1;
            this.world.addNextBird(this.currentBird.body); // monde phys
            this.world.refreshZoneInfos();
        } else {
            console.log('Il n\'y a plus d\'oiseaux');
            this.showGameOverMessage();
        }
    }

    gameOver() {
        const pigs = this.world.getPigs(); 
        const activePigs = pigs.filter(pig => pig.isActive);

        // if (this.currentIndexBird >= this.birds.length - 1 && activePigs.length > 0) {
        //     console.log('GAME OVER !')

        // Tous les cochons ont été touchés
        if (activePigs.length === 0 && !this.hasWon) {
            this.hasWon = true;
    
            // afficher un message de victoire et passer au niveau suivant
            this.showVictoryMessage(); 
        }
    }

    showVictoryMessage() {
        const modal = document.querySelector('#victory-modal');
        const nextLevelBtn = document.querySelector('#next-level-btn');

        if (modal && nextLevelBtn) {
            modal.querySelector('h2').textContent = '🎉 Gagné';
            modal.style.display = 'flex';
            nextLevelBtn.style.display = 'inline-block';
            nextLevelBtn.textContent = 'Prochain niveau';
        }
    }

    showGameOverMessage() {
        const modal = document.querySelector('#victory-modal');
        const resetBtn = document.querySelector('#reset-btn-modal');

        if (modal && resetBtn) {
            modal.querySelector('h2').textContent = '💀 Game Over';
            modal.style.display = 'flex';
            resetBtn.style.display = 'inline-block';
            resetBtn.textContent = 'Rejouer';
        }
    }

    loadNextLevel() {
        const nextLevel = this.currentLevel + 1; 

        this.world.nextLevel = nextLevel;
        this.world.clear(); // efface le monde physique
      
        this.currentIndexBird = 0; 
        this.world.birdNumber = 1;
        this.currentBird = null; 
        this.init(nextLevel); 
        this.world.refreshZoneInfos();
    }

    closeModal() {
        const victoryModal = document.querySelector('#victory-modal');
        victoryModal.style.display = 'none';
        this.loadNextLevel();
    }

    // --- slingshot --- 

    launchBird() {
        Matter.Body.setStatic(this.currentBird.body, false); 
        const deltaX = this.startingBirdPosition.x - this.currentBird.body.position.x;
        const deltaY = this.startingBirdPosition.y - this.currentBird.body.position.y;
        
        const launchVelocity = {
            x: deltaX * 0.25, // ajuste la vitesse de lancement selon les besoins
            y: deltaY * 0.25
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
            const position = this.#getMousePosition(event); 
            const distance = this.#calculateDistance(
                position.x, position.y,
                this.currentBird.body.position.x,
                this.currentBird.body.position.y
            );

            (distance < this.currentBird.body.circleRadius) ? this.isDragging = true 
            : console.log('clic en dehors de l\'oiseau');
        });

        this.container.addEventListener('mousemove', (event) => {
            if (this.isDragging) {
                const position = this.#getMousePosition(event);
                this.pullBird(position.x, position.y);
            };
        });

        this.container.addEventListener('mouseup', (event) => {
            if (this.isDragging) {
                this.releaseBird();
            }
        });
    }

    /**
     * récupère la position de la souris par rapport au canvas
     * non plus coin supérieur gauche de la fenêtre 
     * mais coin supérieur gauche du canvas
     */
    #getMousePosition(event) {
        const canvas = this.container.querySelector('canvas');
        const rect = canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    /**
     * théorème de Pythagore:distance = √( (x₂-x₁)² + (y₂-y₁)² ) => hypoténuse
     */
    #calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
}