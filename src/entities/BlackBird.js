import { Bird } from './Bird.js';

export class BlackBird extends Bird {

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
            texture: './src/assets/images/birdBlack.svg',
            xScale: 0.3,
            yScale: 0.3,
          }
         }
      }
    );
    this.body.label = 'bird'; // label pour identifier le corps
    this.body.isActive = true; 
    this.body.isLaunched = false;
  }
}