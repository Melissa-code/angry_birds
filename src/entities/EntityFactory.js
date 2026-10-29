import { Bird } from './Bird.js';
import { YellowBird } from './YellowBird.js';
import { Pig } from './Pig.js';
import { Ground } from './Ground.js';
import { Block } from './Block.js';

export class EntityFactory {

  static createEntity(type, x, y, radius = null, width = null, height = null, color = null, isStatic = true, kind = 'red') {
    switch (type) {
      case 'ground':
        return new Ground(x, y, width, height, color);
      case 'bird':
        switch (kind) {
          case 'red':
            return new Bird(x, y, radius, color, isStatic);
          case 'yellow':
            return new YellowBird(x, y, radius, color, isStatic);
        }
      case 'pig':
        return new Pig(x, y, radius, color);
      case 'block':
        return new Block(x, y, width, height, color, isStatic);
      default:
        throw new Error(`entité inconnue: ${type}`);
    }
  }
}