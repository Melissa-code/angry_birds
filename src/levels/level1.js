// level 1 data (new Game(1000, 600, document.body);)
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
                "y": 585, 
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
                "x": 500, 
                "y": 200, 
                "radius": 18,
                "color": "#27a300"
            }
        ]   
    }

export default level1;