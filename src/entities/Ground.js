import { Entity } from './Entity.js';

export class Ground extends Entity {

    // Matter.Bodies.rectangle(x, y, width, height, [options])→ Body 
    constructor(x, y, width, height, color = "#95ce93") {
        super('ground', x, y);
        this.width = width; 
        this.height = height; 
        this.color = color;

        this.body = Matter.Bodies.rectangle(
            x, 
            y, 
            this.width, 
            this.height,
            { isStatic: true, render: { fillStyle: this.color } }
        );
    }

}