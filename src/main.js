import { Game } from './Game.js';

const game = new Game(1000, 600, document.body);
await game.init(2);

// faire un autre niveau 2 plus complexe 
// logique realiste pour lancer l'oiseau via slingshot 