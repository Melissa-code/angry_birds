import { Entity } from './Entity.js';

export class Pig extends Entity {

  constructor(x, y, radius) {
    super('pig', x, y);
    this.radius = radius;

    this.body = Matter.Bodies.circle(x, y, this.radius, {
      restitution: 0.2, //moins rebondissant qu'un oiseau
      density: 0.002
    });
  }
}