import { Game } from './Game.js';

const game = new Game(1200, 500, document.body);
window.game = game; // pour pouvoir accéder à l'objet game dans la console du navigateur
await game.init(1);


// reset game
document.querySelector('#reset-btn').addEventListener('click', () => {
    location.reload();
});

// Ajouter un score 