// level 1 data (new Game(1000, 600, document.body);)
// x et y : le milieu de l'objet dans Matter.js (!= coin haut gauche)
const level1 = 
    {
        "name": "level-1",
        "entities": [
            // {
            //     "type": "slingshot", "x": 100, "y": 200
            // },
            {
                "type": "ground", 
                "x": 500, 
                "y": 585, //585 - (30/2) = 570
                "width": 1000, 
                "height": 30, 
                "color": "#005c00"
            },
            {
                "type": "bird", 
                "x": 100, 
                "y": 200, 
                "radius": 15,
                "color": "#ff0000"
            },
            {
                "type": "pig", 
                "x": 700, 
                "y": 52, //50 mais avec gravité +2
                "radius": 18,
                "color": "#3ec300"
            },
            {
                "type": "block", 
                "x": 700, 
                "y": 320,       // 570 (groud) - (hauteur/2) = 320 
                "width": 20, 
                "height": 500, 
                "color": "#983628"
            },
        ]   
    }

export default level1;