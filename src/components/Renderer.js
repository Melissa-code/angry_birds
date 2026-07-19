/**
 * Renderer.js
 * Gère l'affichage des éléments du jeu avec p5.js
 * Dessine les corps physiques du monde Matter.js
 */

class Renderer {
  constructor(world, canvas) {
    this.world = world;
    this.canvas = canvas;
    this.bodies = [];
    this.constraints = [];
    this.scale = 1;
    this.backgroundColor = 135; // gris
    this.strokeColor = 0;
    this.fillColor = 200;
  }

  /**
   * Initialise le renderer
   * Appelé une fois au démarrage
   */
  init() {
    // Récupérer les corps du monde
    this.bodies = Matter.Composite.allBodies(this.world);
    this.constraints = Matter.Composite.allConstraints(this.world);
  }

  /**
   * Met à jour les corps à afficher
   */
  update() {
    this.bodies = Matter.Composite.allBodies(this.world);
    this.constraints = Matter.Composite.allConstraints(this.world);
  }

  /**
   * Affiche tous les éléments du monde
   */
  display() {
    // Mettre à jour les corps
    this.update();

    // Dessiner les corps
    this.bodies.forEach((body) => {
      this.drawBody(body);
    });

    // Dessiner les contraintes (ressorts, élastiques)
    this.constraints.forEach((constraint) => {
      this.drawConstraint(constraint);
    });
  }

  /**
   * Dessine un corps physique
   * @param {Matter.Body} body - Le corps à dessiner
   */
  drawBody(body) {
    const vertices = body.vertices;
    
    // Déterminer la couleur selon le type de corps
    let fillColor = this.getFillColor(body);
    let strokeColor = this.getStrokeColor(body);

    // Appliquer les couleurs
    fill(fillColor);
    stroke(strokeColor);
    strokeWeight(2);

    // Dessiner le polygone
    beginShape();
    for (let i = 0; i < vertices.length; i++) {
      const v = vertices[i];
      vertex(v.x, v.y);
    }
    endShape(CLOSE);

    // Afficher le label si présent
    if (body.label) {
      this.drawLabel(body);
    }
  }

  /**
   * Détermine la couleur de remplissage selon le type de corps
   * @param {Matter.Body} body - Le corps
   * @returns {number|Array} - La couleur (RGB ou grayscale)
   */
  getFillColor(body) {
    if (body.label === 'bird') {
      return [255, 200, 0]; // Orange
    } else if (body.label === 'pig') {
      return [100, 200, 100]; // Vert
    } else if (body.label === 'block') {
      return [200, 100, 50]; // Brun
    } else if (body.label === 'ground') {
      return [50, 50, 50]; // Noir
    }
    return [200, 200, 200]; // Gris par défaut
  }

  /**
   * Détermine la couleur du contour selon le type de corps
   * @param {Matter.Body} body - Le corps
   * @returns {number} - La couleur
   */
  getStrokeColor(body) {
    if (body.isStatic) {
      return 0; // Noir pour les corps statiques
    }
    return 100; // Gris foncé pour les dynamiques
  }

  /**
   * Affiche le label/nom du corps
   * @param {Matter.Body} body - Le corps
   */
  drawLabel(body) {
    push();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(12);
    const x = body.position.x;
    const y = body.position.y;
    text(body.label, x, y);
    pop();
  }

  /**
   * Dessine une contrainte (ressort, élastique)
   * @param {Matter.Constraint} constraint - La contrainte
   */
  drawConstraint(constraint) {
    const pointA = constraint.pointA;
    const pointB = constraint.bodyB
      ? constraint.bodyB.position
      : constraint.pointB;

    stroke(100, 100, 200);
    strokeWeight(1);
    line(pointA.x, pointA.y, pointB.x, pointB.y);
  }

  /**
   * Définit la couleur de fond
   * @param {number|Array} color - La couleur RGB ou grayscale
   */
  setBackgroundColor(color) {
    this.backgroundColor = color;
  }

  /**
   * Obtient la couleur de fond
   * @returns {number|Array}
   */
  getBackgroundColor() {
    return this.backgroundColor;
  }

  /**
   * Affiche les informations de debug (FPS, nombre de corps)
   */
  displayDebugInfo() {
    push();
    fill(0);
    textSize(14);
    textAlign(LEFT);
    text(`FPS: ${frameRate().toFixed(2)}`, 10, 20);
    text(`Bodies: ${this.bodies.length}`, 10, 40);
    text(`Constraints: ${this.constraints.length}`, 10, 60);
    pop();
  }

  /**
   * Efface le renderer
   */
  clear() {
    this.bodies = [];
    this.constraints = [];
  }
}
