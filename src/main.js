import { Game } from './Game.js';

const game = new Game(1000, 600, document.body);
await game.init(2);

// faire 10 niveaux progressifs 
// prendre en considération qu'il y a plusieurs birds (dans niveau ex 3)
// si plusieurs birds, celui qui est tiré il devient statique (hors jeu)
// après tous les tirs, et que les cochons ne sont pas au sol (collision
// alors partie = perdue 
// juste annonce gangé et bouton niveau suivant 