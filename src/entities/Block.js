import { Entity } from './Entity.js';

/**
 * structures en bois/en pierre à détruire
 */
export class Block extends Entity {

    // Matter.Bodies.rectangle(x, y, width, height, [options])→ Body 
    constructor(x, y, width, height, color) {
        super('block', x, y);
        this.width = width; 
        this.height = height; 
        this.color = color;

        this.body = Matter.Bodies.rectangle(
            x, 
            y, 
            this.width, 
            this.height,
            { 
              isStatic: true, 
              render: { fillStyle: this.color } 
            }
        );
    }

}