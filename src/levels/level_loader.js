import { EntityFactory } from '../entities/EntityFactory.js';
import level1 from './data/level1.js';
// import level2 from './data/level2.js';

const levels = {
  1: level1,
  // 2: level2
};


export function loadLevel(levelNumber) {
  // create entities from level data => createEntity(type, x, y)
  const levelData = levels[levelNumber];

  const entities = levelData.entities.map(
    data => EntityFactory.createEntity(
      data.type, 
      data.x, 
      data.y, 
      data.radius, 
      data.width, 
      data.height, 
      data.color)
    );
  
  return entities;
}
