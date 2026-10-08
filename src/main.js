import { Game } from './Game.js';

const game = new Game(1200, 600, document.body);
// const game = new Game(1200, 550, document.getElementById('game-container'));
window.game = game; // pour pouvoir accéder à l'objet game dans la console du navigateur
await game.init(1);

// Ajouter un score 