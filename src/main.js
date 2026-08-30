import { Game } from './Game.js';

const game = new Game(1000, 600, document.body);

// formate json (js) pour stocker niveaux du jeu (modulaire)
// définir les class d'entities qui sont liées 
// après:  level loader  (return Level et levelreturn entities[])