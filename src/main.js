import { View } from './views/View.js';

// Engine et World globaux de Matter.js
const Engine = Matter.Engine;
const World = Matter.World;
const Body = Matter.Body;

const engine = Engine.create();
const world = engine.world; 

const view = new View(engine);

const runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);