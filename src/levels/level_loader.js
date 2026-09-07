import { EntityFactory } from '../entities/EntityFactory.js';

/**
 * loadLevelAsync pour tout numéro de level sans toucher au code
 */
export async function loadLevelAsync(levelNumber) {
  const url = `./src/levels/data/level${levelNumber}.json`; 

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch level data');
    
    const levelData = await response.json();
    return levelData.entities.map(
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

  } catch (error) {
    console.error('Error loading level data:', error);
  }
}
  
