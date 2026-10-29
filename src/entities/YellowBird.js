import { Bird } from './Bird.js';

export class YellowBird extends Bird {

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
        restitution: 0.3, // rebondissement
        density: 0.2,     // densité
        render: { 
          fillStyle: this.color,
          sprite: {
            texture: './src/assets/images/birdYellow.svg',
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

  // accélère en ligne droite (multiplie la vitesse par 2)
  usePower() {
     //
  }
}