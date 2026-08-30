import { EntityFactory } from '../entities/EntityFactory.js';

export function loadLevel(levelData) {
  // create entities from level data => createEntity(type, x, y)
  const entities = levelData.entities.map(data => EntityFactory.createEntity(data.type, data.x, data.y));
  
  return entities;
}
