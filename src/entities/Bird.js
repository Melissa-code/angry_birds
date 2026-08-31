import { Entity } from './Entity.js';

export class Bird extends Entity {

  constructor(x, y, radius) {
    super('bird', x, y);
    this.radius = radius; // rayon 

    // corps physique Matter.js (cercle)
    this.body = Matter.Bodies.circle(x, y, this.radius, {
      restitution: 0.8, //rebondissement
      density: 0.004
    });
  }
  
}