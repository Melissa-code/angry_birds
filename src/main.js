import { Game } from './Game.js';

const game = new Game(1000, 600, document.body);
window.game = game; // pour pouvoir accéder à l'objet game dans la console du navigateur
await game.init(7);

// juste annonce gangé et bouton niveau suivant (recommence niveau en cours ou suivant  )