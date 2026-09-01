import { Entity } from './Entity.js';

export class Pig extends Entity {

  constructor(x, y, radius, color) {
    super('pig', x, y);
    this.radius = radius;
    this.color = color;

    this.body = Matter.Bodies.circle(
      x,
      y, 
      this.radius, 
      { 
        restitution: 0.2, //moins de rebondissement que l'oiseau et mois dense
        density: 0.002,
        render: { fillStyle: this.color }
      }
    );
  }
}