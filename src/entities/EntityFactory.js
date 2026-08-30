import { Bird } from './Bird.js';
import { Pig } from './Pig.js';
// import { Slingshot } from './Slingshot.js';
// import { Block } from './Block.js';
// import { Ground } from './Ground.js';

export class EntityFactory {

  static createEntity(type, x, y) {
    switch (type) {
      case 'bird':
        return new Bird(x, y);
      case 'pig':
        return new Pig(x, y);
      // case 'slingshot':
      //   return new Slingshot(x, y);
      // case 'block':
      //   return new Block(x, y);
      // case 'ground':
      //   return new Ground(x, y);
      default:
        throw new Error(`entité inconnue: ${type}`);
    }
  }

}