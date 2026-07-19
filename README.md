# Angry Birds 

Version du célèbre jeu développé ici en JavaScript vanilla, utilisant la 
physique 2D et un rendu graphique dynamique.


## 1. Contexte 

Projet réalisé dans un but pédagogique pour apprendre à manipuler un moteur de 
physique en deux dimensions et à gérer des rendus graphiques interactifs en JavaScript.

**But du jeu** : utiliser un lance-pierre pour projeter des projectiles (des oiseaux) 
sur des structures afin de détruire les cibles (des cochons) qui s'y cachent. 
Le jeu calcule en temps réel les trajectoires, la force des impacts et 
l'effondrement des structures de manière réaliste.


## 2. Principales fonctionnalités 

### 2.1. Jeu basé sur la physique

- **Le lance-pierre Sling-shot**: le joueur utilise un lance-pierre pour propulser les oiseaux sur les structures des cochons. Le contrôle se fait 
intuitivement en glissant le doigt pour régler l'angle et la puissance du tir.

- **Moteur physique en temps réel**: les structures (en bois, glace/verre ou pierre)
s'effondrent de manière réaliste en fonction des impacts et de la gravité.

### 2.2. Diversité des personnages (les oiseaux)

- **Red (rouge)** : classique, sans pouvoir spécial au début, puis doté d'un cri de guerre repoussant les objets.
- **Blues (bleus)** : se divisent en trois petits oiseaux très efficaces contre la glace.
- **Chuck (jaune)** : accélère en ligne droite, idéal pour perforer le bois.
- **Bomb (noir)** : explose sur commande ou quelques secondes après l'impact pour détruire la pierre.
- **Matilda (blanc)** : pond un œuf explosif et est propulsée vers le haut.

### 2.3. Système de progression et score

- **Évaluation par étoiles** : chaque niveau est noté de 1 à 3 étoiles selon le score obtenu. 
Le score dépend des dégâts causés et du nombre d'oiseaux économisés
(chaque oiseau restant rapporte un bonus de 10 000 points).

- **Mondes et thématiques** : les niveaux sont répartis en plusieurs chapitres 
avec des décors et des configurations de plus en plus complexes.

### 2.4. Les bonus et les aides (power-ups)

- **Mighty Eagle (l'aigle Vaillant)**: créature géante qui détruit instantanément 
tout le niveau en échange d'une boîte de sardines (souvent payant ou limité).
- **Visée laser** : elle permet de voir la trajectoire exacte de l'oiseau avant le tir.
- **Potion de croissance**: multiplie la taille et la puissance d'un oiseau.


## 3. Installation et lancement du jeu

Le projet utilise des CDN pour charger les bibliothèques nécessaires, il n'y a 
donc **aucune installation ou configuration complexe requise** (pas besoin de `npm install`).

Pour lancer le jeu localement :

1. Clonez ou téléchargez ce dépôt sur votre ordinateur.
2. Ouvrez le fichier `index.html` directement dans votre navigateur web préféré (Google Chrome, Firefox, Edge...).
3. *Optionnel (recommandé) :* Si vous utilisez VS Code, vous pouvez utiliser l'extension **Live Server** pour lancer le projet en un clic.


## 4. Technologies

- **[Matter.js](https://brm.io/matter-js/) (v0.19.0, version stable) :** 
C'est le moteur de physique 2D du projet. Il gère toute la partie invisible mais cruciale du jeu : 
la gravité, la vitesse de propulsion via le lance-pierre, les forces d'impact, 
les frictions entre les blocs et la détection des collisions.

- **[p5.js](https://p5js.org/) (v1.9.0) :** C'est la bibliothèque de rendu graphique. 
Elle est connectée au moteur physique pour dessiner en temps réel (à 60 images par seconde) 
les éléments du monde (oiseaux, blocs, décors) à partir des coordonnées calculées par Matter.js.

Pour trouver les liens CDN: `cdnjs.com` (bibliothèque publique qui héberge les 
fichiers de presque toutes les extensions JavaScript)


## 5. Fonctionnement technique (Architecture de Matter.js)

Pour structurer le jeu, j'ai utilisé les composants clés de Matter.js 
en les couplant avec p5.js:

- **L'Engine (moteur) :** c'est le cerveau du jeu. 
Il effectue tous les calculs mathématiques complexes dans l'ombre 
(gravité, vitesse de frappe, forces lors des impacts).

- **Le World (monde) :** c'est la scène de théâtre. 
C'est l'espace virtuel dans lequel on ajoute tous les éléments de notre jeu.

- **Les Bodies (corps) :** ce sont les acteurs. Ce sont les formes physiques 
qui subissent les lois de la gravité (un cercle pour l'oiseau, des rectangles 
pour le sol et les blocs de la structure).

- **Le Rendu graphique (p5.js) :** ce sont les yeux du spectateur. 
Au lieu d'utiliser le module `Render` par défaut de Matter.js, 
c'est **p5.js** qui écoute le "cerveau" (l'Engine) et dessine les objets 
à l'écran 60 fois par seconde. 
*(Note : Au début, il dessine des formes géométriques simples pour les tests, avant l'intégration des vraies images d'oiseaux !)*


## 6. Debug

**Note pour l'inspection de l'écran :**
- le canvas occupe tout l'espace, le clic droit peut être bloqué : 
- **Sur Mac :** `Cmd` + `Option` + `I`
- **Sur Windows / Linux :** `Ctrl` + `Shift` + `I` ou `F12`


