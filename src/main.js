import { Game } from './Game.js';

const game = new Game(1200, 500, document.body);
window.game = game; // pour pouvoir accéder à l'objet game dans la console du navigateur
await game.init(4);

document.querySelector('#reset-btn').addEventListener('click', () => {
    location.reload();
});

// add differents birds 
// detecte coll oiseau noir avec autre obj pour exploser(dans tous les sens )
