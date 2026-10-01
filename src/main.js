import { Game } from './Game.js';

const game = new Game(2000, 600, document.body);
window.game = game; // pour pouvoir accéder à l'objet game dans la console du navigateur
await game.init(1);

// Ajouter un score 