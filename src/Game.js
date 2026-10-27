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

        // bind(this) pour garder Game dans this sinon this = bouton
        const nextLevelBtn = document.querySelector('#next-level-btn');
        if (nextLevelBtn) {
            nextLevelBtn.addEventListener('click', this.closeModal.bind(this));
        }

        const resetBtn = document.querySelector('#reset-btn-modal');
        if (resetBtn) {
            resetBtn.addEventListener('click', this.restartLevel.bind(this));
        }
    }
  
    /**
     * règle du langage constructeur doit toujours retourner l'objet immédiatement et synchrone
     */
    async init(currentLevel) {
        this.currentLevel = currentLevel; // pour mémoriser le niveau en cours
        [this.background, this.entities] = await loadLevelAsync(currentLevel); // return background & entities[]
        this.bodies = this.entities.map(entity => entity.body);
        this.world.addBodies(this.bodies); //ajoute les bodies dans le monde physique
        this.displayBackgroundImage(); 
        this.hasWon = false;
        this.world.refreshZoneInfos();
        console.log('entities : ', this.entities);

        // 3 ou 4 birds[]
        this.birds = this.entities.filter(
            entityFound => entityFound instanceof Bird
        );
        this.currentBird = this.birds[this.currentIndexBird];
        this.setUpSlingshot(); 
        this.world.run();

        // collision detection between pig/bird and ground
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
            const activePigs = this.world.getPigs().filter(pig => pig.isActive);
    
            if (activePigs.length > 0 && !this.hasWon) {
                this.showMessage('lose');
            }
        }
    }

    gameOver() {
        const pigs = this.world.getPigs(); 
        const activePigs = pigs.filter(pig => pig.isActive);

        // Tous les cochons ont été touchés
        if (activePigs.length === 0 && !this.hasWon) {
            this.hasWon = true;
    
            this.showMessage('win');
        }
    }

    showMessage(typeMessage) {
        const modal = document.querySelector('#victory-modal');
        const nextLevelBtn = document.querySelector('#next-level-btn');
        const resetBtn = document.querySelector('#reset-btn-modal');

        if (!modal || !nextLevelBtn || !resetBtn) {
            console.error('Il manque des éléments dans leDOM');
            return;
        }

        const win = (typeMessage === 'win');

        modal.querySelector('h2').textContent = win ? '🎉 Gagné' : '💀 Game Over';
        nextLevelBtn.textContent = 'Prochain niveau';
        resetBtn.textContent = 'Rejouer';

        nextLevelBtn.style.display = win ? 'inline-block' : 'none';
        resetBtn.style.display = win ? 'none' : 'inline-block';
        modal.style.display = 'flex';
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

    restartLevel() {
        const victoryModal = document.querySelector('#victory-modal');

        victoryModal.style.display = 'none';
        
        this.world.clear(); 

        this.currentIndexBird = 0;
        this.world.birdNumber = 1;
        this.currentBird = null; 

        this.init(this.currentLevel); 
        this.world.refreshZoneInfos();
    }

    closeModal() {
        const victoryModal = document.querySelector('#victory-modal');

        victoryModal.style.display = 'none';
        this.loadNextLevel();
    }

    displayBackgroundImage() {
        const canvas = this.container.querySelector('canvas');

        if (canvas) {
            canvas.style.backgroundImage = `url(${this.background})`;
            canvas.style.backgroundSize = 'cover';
            canvas.style.backgroundPosition = 'center';
        }
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

            // active le drag
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