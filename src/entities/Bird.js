import { Entity } from './Entity.js';

export class Bird extends Entity {

  constructor(x, y, radius, color, isStatic) {
    super('bird', x, y);
    this.radius = radius; // rayon 
    this.color = color; 

    // corps physique Matter.js (cercle)
    this.body = Matter.Bodies.circle(
      x, 
      y, 
      this.radius, 
      {
        isStatic: isStatic,
        restitution: 0.1, // rebondissement
        density: 0.001,
        render: { fillStyle: this.color }
      }
    );
    this.body.label = 'bird'; // label pour identifier le corps
  }
  
}