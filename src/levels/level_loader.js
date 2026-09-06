import { EntityFactory } from '../entities/EntityFactory.js';
// import level1 from './data/level1.js';

// const levels = {
//   1: level1, 
// };

// export function loadLevel(levelNumber) {
//   // create entities from level data => createEntity(type, x, y)
//   const levelData = levels[levelNumber];

//   const entities = levelData.entities.map(
//     data => EntityFactory.createEntity(
//       data.type, 
//       data.x, 
//       data.y, 
//       data.radius, 
//       data.width, 
//       data.height, 
//       data.color)
//     );
//   return entities;
// }

/**
 * loadLevelAsync pour tout numéro de level sans toucher au code
 */
export async function loadLevelAsync(levelNumber) {
  const url = `./src/levels/data/level${levelNumber}.json`; 

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch level data');
    
    const levelData = await response.json();
    const entities = levelData.entities.map(
      data => EntityFactory.createEntity(
        data.type, 
        data.x, 
        data.y, 
        data.radius, 
        data.width, 
        data.height, 
        data.color
      )
    );
  return entities; 
  
  } catch (error) {
    console.error('Error loading level data:', error);
  }
}
  
