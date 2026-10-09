import { Game } from './Game.js';

const game = new Game(1200, 500, document.body);
window.game = game; // pour pouvoir accéder à l'objet game dans la console du navigateur
await game.init(1);

document.querySelector('#reset-btn').addEventListener('click', () => {
    location.reload();
});

// 30 img/sec !=60 
// protection next level 
// 2 boutons ensble ?
// image cochon ou oiseau
