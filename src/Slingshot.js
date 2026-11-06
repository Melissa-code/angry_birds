import { YellowBird } from './entities/YellowBird.js';
import { BlackBird } from './entities/BlackBird.js';


export class Slingshot {
    
    constructor(container, currentBird) {
        this.container = container;
        this.currentBird = currentBird;
        this.startingBirdPosition = currentBird.body.position; 
        this.isDragging = false;

        this.#initListeners();
    }

    updateBird(newBird) {
        this.currentBird = newBird;
        this.startingBirdPosition = { 
            x: newBird.body.position.x, 
            y: newBird.body.position.y 
        };
        // S'assure qu'il est bien statique sur le lanceur
        // Matter.Body.setStatic(newBird.body, true);
    }

    /**
     * Matter.Body.setPosition(body, position {x:..., y:...}, [updateVelocity=false])
     */
    pullBird(mouseX, mouseY) {
        Matter.Body.setPosition(this.currentBird.body, { x: mouseX, y: mouseY });
    }

    releaseBird() {
        this.isDragging = false;
        this.launchBird();
    }
    
    launchBird() {
        Matter.Body.setStatic(this.currentBird.body, false); 
        const deltaX = this.startingBirdPosition.x - this.currentBird.body.position.x;
        const deltaY = this.startingBirdPosition.y - this.currentBird.body.position.y;
        let speedMultiplier = 0.25; // Ajustez ce facteur pour contrôler la vitesse de lancement

        if (this.currentBird instanceof YellowBird) {
            speedMultiplier = 0.5;
        }

        if (this.currentBird instanceof BlackBird) {
            speedMultiplier = 0.2;
        }
        
        const launchVelocity = {
            x: deltaX * speedMultiplier,
            y: deltaY * speedMultiplier
        };
        Matter.Body.setVelocity(this.currentBird.body, launchVelocity); 
    }

    // ----------- private methods ------------

    #initListeners() {
        this.container.addEventListener('mousedown', (event) => {
            if (!this.currentBird) return;
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
            if (this.isDragging && this.currentBird) {
                const position = this.#getMousePosition(event);
                this.pullBird(position.x, position.y);
            }
        });

        this.container.addEventListener('mouseup', () => {
            if (this.isDragging && this.currentBird) {
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