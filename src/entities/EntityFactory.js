import { Bird } from './Bird.js';
import { Pig } from './Pig.js';
import { Ground } from './Ground.js';
import { Block } from './Block.js';

export class EntityFactory {

  static createEntity(type, x, y, radius = null, width = null, height = null, color = null) {
    switch (type) {
      case 'ground':
        return new Ground(x, y, width, height, color);
      case 'bird':
        return new Bird(x, y, radius, color);
      case 'pig':
        return new Pig(x, y, radius, color);
      case 'block':
        return new Block(x, y, width, height, color);

      default:
        throw new Error(`entité inconnue: ${type}`);
    }
  }

}