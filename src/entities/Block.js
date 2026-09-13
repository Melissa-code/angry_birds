import { Entity } from './Entity.js';

/**
 * structures en bois/en pierre à détruire
 */
export class Block extends Entity {
    constructor(x, y, width, height, color, isStatic) {
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
              isStatic: isStatic, 
              render: { fillStyle: this.color } 
            }
        );
        this.body.label = 'block'; // label pour identifier le corps
    }

}