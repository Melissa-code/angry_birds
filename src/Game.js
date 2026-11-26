import PhysicalWorld from './physical_world/PhysicalWorld.js';
import { loadLevelAsync } from './levels/level_loader.js';
import { Bird } from './entities/Bird.js';
import { BlackBird } from './entities/BlackBird.js';
import { WhiteBird } from './entities/WhiteBird.js';
import { BlueBird } from './entities/BlueBird.js';
import { Slingshot } from './Slingshot.js';

const Bodies = Matter.Bodies; // pour av methodes de creation des bodies (rectangle, circle, polygon...)

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
        this.currentEgg = null; 
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
     * règle du langage constructeur doit toujours retourner l'objet immédiatement 
     * et de manière synchrone
     */
    async init(currentLevel) {
        this.currentLevel = currentLevel; // pour mémoriser le niveau en cours
        [this.background, this.entities] = await loadLevelAsync(currentLevel); // return background & entities[]
        this.bodies = this.entities.map(entity => entity.body);
        this.world.addBodies(this.bodies); //ajoute les bodies dans le monde physique
        this.displayBackgroundImage(); 
        this.hasWon = false;
        this.world.refreshZoneInfos();

        // 3 ou 4 birds[]
        this.birds = this.entities.filter(
            entityFound => entityFound instanceof Bird
        );
        this.currentBird = this.birds[this.currentIndexBird];

        this.slingshot = new Slingshot(this.container, this.currentBird);

        this.world.run();

        // Écouteurs de jeu
        this.#initCollisions();
        this.#initKeyboardEvents();
    }

    detectCollision(bodyA, bodyB, animal) {
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

            this.slingshot.updateBird(this.currentBird); //rejoue

        } else {
            // console.log('Il n\'y a plus d\'oiseaux');
            const activePigs = this.world.getPigs().filter(pig => pig.isActive);
    
            if (activePigs.length > 0 && !this.hasWon) {
                this.showMessage('lose');
            }
        }
    }

    /**
     * black bird -> into 4 fragments
     */
    explode(currentBird) {
        const birdFragmentsImages = this.#getBlackBirdFragmentsImages();
        const positions = this.#getBirdPositions(currentBird);
        const speeds = this.#changeSpeeds(5); 

        this.#splitBirdIntoFragments(
            currentBird, 
            4, 
            birdFragmentsImages, 
            positions, 
            speeds, 
            'rectangle'
        );
    }

    layExplosiveEgg() {
        const eggImage = this.#getEggImage() ;
        const x = this.currentBird.body.position.x;
        const y = this.currentBird.body.position.y;
        
        this.currentEgg = this.#createEgg(x, y, 20, eggImage);

        // add to phys world directly
        Matter.Composite.add(this.world.engine.world, this.currentEgg);
    }

    /**
     * blue bird -> into 3 small birds 
     */
    splitIntoThreeBirds(currentBird) {
        const smallBirdImage = './src/assets/images/birdBlue.svg';
        const smallBirdImages = [smallBirdImage, smallBirdImage, smallBirdImage];

        const positions = this.#getBirdPositions(currentBird);
        const speeds = this.#changeSpeeds(7);

        this.#splitBirdIntoFragments(
            currentBird, 
            3, 
            smallBirdImages, 
            positions, 
            speeds, 
            'circle'
        );
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

    // ----------- private methods ------------

    #initCollisions() {
        // collision detection between pig/bird and ground
        Matter.Events.on(this.world.engine,'collisionStart', (event) => {
            const pairs = event.pairs;
        
            pairs.forEach(pair => {
                const { bodyA, bodyB } = pair; 

                // BlueBird collision detection
                let blueBirdBody = null; 
                if (this.currentBird instanceof BlueBird) {
                    blueBirdBody = this.currentBird.body;
                    if (bodyA === blueBirdBody || bodyB === blueBirdBody) {
                        blueBirdBody.isActive = false; // l'oiseau est touché
                        this.splitIntoThreeBirds(this.currentBird);
                        this.addNextBird();
                        return; 
                    }
                } 

                // egg collision detection with ground 
                const egg = this.detectCollision(bodyA, bodyB, 'egg');
                // other collision detection (pig/block)
                if (this.currentEgg !== null && this.currentEgg.isActive) {
                    if (bodyA === this.currentEgg || bodyB === this.currentEgg) {
                        if (bodyA.label === 'bird' || bodyB.label === 'bird') return; 

                        const enemyPosition = this.#getPositionEnemy(bodyA, bodyB); 
                        
                        this.#getExplosionImage(
                            enemyPosition.x,
                            enemyPosition.y
                        ); 
                        this.currentEgg.isActive = false;
                        Matter.Composite.remove(
                            this.world.engine.world, 
                            this.currentEgg
                        );  
                        this.currentEgg = null;
                        return; 
                    }
                 }
                
                // ground/pig -> score +100
                const pig = this.detectCollision(bodyA, bodyB, 'pig'); 
                if (pig && pig.isActive) {
                    pig.isActive = false; // le cochon est touché
                    this.world.score += 100;
                    this.world.refreshZoneInfos(); 
                } 

                // ground/bird -> next bird
                const bird = this.detectCollision(bodyA, bodyB, 'bird'); 
                if (bird && bird.isActive) {
                    bird.isActive = false; // l'oiseau est touché

                    this.addNextBird();
                }
            });

            this.gameOver();
        });
    }

    #getPositionEnemy(bodyA, bodyB) {
        if (bodyA.label === 'pig' || bodyA.label === 'block') {
            return this.enemyPosition = { x: bodyA.position.x, y: bodyA.position.y };
        } else if (bodyB.label === 'pig' || bodyB.label === 'block') {
            return this.enemyPosition = { x: bodyB.position.x, y: bodyB.position.y };
        }
        return { x: this.currentEgg.position.x, y: this.currentEgg.position.y };
    }

    /**
     * BlackBird / WhiteBird (event: keydown)
     */
    #initKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            if (event.code !== 'Space') return;

            const bird = this.currentBird;
            if (!bird || !bird.body.isLaunched || bird.powerUsed) return;

            // BlackBird: explode
            if (bird instanceof BlackBird) {
                bird.powerUsed = true;
                bird.body.isActive = false;
                this.explode(bird);
                this.addNextBird();

            // WhiteBird: lay egg
            } else if (bird instanceof WhiteBird) {
                bird.powerUsed = true;
                this.layExplosiveEgg();

                Matter.Body.setVelocity(
                    this.currentBird.body, 
                    { x: this.currentBird.body.velocity.x * 0.3, y: -15 }
                );
            }
        });
    }

    #splitBirdIntoFragments(currentBird, count, images, positions, speeds, shape) {
        // remove current bird from the world
        Matter.World.remove(this.world.engine.world, currentBird.body);

        let sizeFragment = currentBird.body.circleRadius /2;

        for (let i = 0; i < count; i++) {
            let body;
            if (shape === 'rectangle') {
                body = this.#createFragmentBird(positions[i].x, positions[i].y, sizeFragment, images[i]);
            } else {
                body = this.#createSmallBird(positions[i].x, positions[i].y, sizeFragment, images[i]);
            }

            Matter.Body.setVelocity(body, speeds[i]);
            Matter.World.add(this.world.engine.world, body);
        }
    }

    #getEggImage() {
        return './src/assets/images/egg.svg';
    }

    /**
     * récupère et renvoie les images des fragments de l'oiseau noir
     */
    #getBlackBirdFragmentsImages() {
        return [
            './src/assets/images/birdBlack_haut_gauche.png',
            './src/assets/images/birdBlack_haut_droite.png',
            './src/assets/images/birdBlack_bas_gauche.png',
            './src/assets/images/birdBlack_bas_droite.png',
        ];
    }

    #getBirdPositions(currentBird) {
        let x = currentBird.body.position.x; 
        let y = currentBird.body.position.y;
        let size = currentBird.body.circleRadius /2; // rayon => size/2 of diametre 

        return [
            { x: x - size, y: y - size },
            { x: x + size, y: y - size },
            { x: x - size, y: y + size },
            { x: x + size, y: y + size }
        ]
    }

    /**
     * renvoie un tableau de vitesses pour les fragments de l'oiseau noir/bleu
     */
    #changeSpeeds(number) {
        return [
            { x: -number, y: -number }, 
            { x:  number, y: -number }, 
            { x: -number, y:  number },  
            { x:  number, y:  number },  
        ];
    }

    #createEgg(x, y, size, eggImage) {
        return Bodies.circle(x, y, size / 2, {
            restitution: 0.3,
            density: 0.1,
            frictionAir: 0.05,
            render: {
                sprite: {
                    texture: eggImage,
                    xScale: 0.15,
                    yScale: 0.15
                }
            },
            label : 'egg', // label pour identifier le corps
            isActive : true,
            isLaunched : false,
        });
    }

    #getExplosionImage(x, y) {
        const canvas = this.container.querySelector('canvas');
        const explodeImage = new Image();
        
        explodeImage.src = './src/assets/images/explode.svg';
        explodeImage.style.position = 'absolute';
        // position de l'ennemi dans le canvas (distance entre le bord gauche du container et le bord gauche du canvas)
        explodeImage.style.left = `${canvas.offsetLeft + x - 25}px`;// 25 = 1/2 de 50 (taille de l'image-> au centre )
        explodeImage.style.top = `${canvas.offsetTop + y - 25}px`;
        explodeImage.style.width = '50px';
        explodeImage.style.height = '50px';

        this.container.appendChild(explodeImage);

        setTimeout(() => explodeImage.remove(), 500); 
    }

    /**
     * create small blue bird (circle) with a given position size/2 and image
     */
    #createSmallBird(x, y, size, smallBirdImage) {
        return Bodies.circle(x, y, size / 2, {
            restitution: 0.1,
            density: 0.1,
            render: {
                sprite: {
                    texture: smallBirdImage,
                    xScale: 0.15,
                    yScale: 0.15
                }
            }
        });
    }

    /**
     * create a fragment of black bird (rectangle) with a given position size and image
     */
    #createFragmentBird(x, y, size, fragmentImage) {
        return Bodies.rectangle(
            x,
            y,
            size,
            size,
            {
                restitution: 0.1,
                density: 0.1,
                render: {
                    sprite: {
                        texture: fragmentImage,
                        xScale: 0.3,
                        yScale: 0.3
                    }
                }
            }
        );
    }
}