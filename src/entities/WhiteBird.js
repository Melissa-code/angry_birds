import { Bird } from './Bird.js';

export class WhiteBird extends Bird {

  constructor(x, y, radius, color, isStatic) {
    super(x, y, radius, isStatic);
    this.color = color; 
    this.powerUsed = false;

    // corps physique Matter.js (cercle)
    this.body = Matter.Bodies.circle(
      x, 
      y, 
      this.radius, 
      {
        isStatic: isStatic,
        restitution: 0.4, // rebondissement
        density: 0.3,     // densité
        render: { 
          fillStyle: this.color,
          sprite: {
            texture: './src/assets/images/birdWhite4.svg',
            xScale: 0.4,
            yScale: 0.4,
          }
         }
      }
    );
    this.body.label = 'bird'; // label pour identifier le corps
    this.body.isActive = true; 
    this.body.isLaunched = false;
  }
}