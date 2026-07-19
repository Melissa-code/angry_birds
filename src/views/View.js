// renderer de Matter.js pour afficher le monde physique
const { Render } = Matter; 

export class View {

    constructor(engine) {
        this.engine = engine;

        this.render = Render.create({
            element: document.body,
            engine: this.engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                showAngleIndicator: true,
                showCollisions: true,
                showVelocity: true
            }
        })

        Render.run(this.render);

        this.resizeCanvas();
    }

    /**
     * Change variables of the renderer of Matter.js 
     * & change pixels of the canvas when window is resized
     */
    resizeCanvas() {
        window.addEventListener('resize', () => {
            this.render.options.width = window.innerWidth; 
            this.render.options.height = window.innerHeight;

            this.render.canvas.width = window.innerWidth; 
            this.render.canvas.height = window.innerHeight;
        });
    }
}