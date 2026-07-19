# Roadmap Angry Birds

## 1. Architecture 

- Configurer le dossier src/ et le point d'entrée main.js
- Mettre en place Engine et World globaux de Matter.js
- Réfléchir et concevoir le squelette des classes (modèles/entités) dans src/components/


## 2. Squelette Matter.js

- Créer le monde physique, un sol immobile et un rond rouge qui tombe (notre oiseau)

**=> Objectif** : voir l'oiseau tomber et s'arrêter sur le sol


## 3. Le lance-pierre (slingshot) 

- Ajouter un poteau ou un point fixe pour le lance-pierre
- Utiliser les *Constraints (les élastiques)* de Matter.js pour lier l'oiseau au lance-pierre
- Ajouter le contrôle de la souris pour pouvoir tirer sur l'oiseau

**=> Objectif** : pouvoir étirer l'élastique et voir l'oiseau revenir à sa place quand on lâche (comme un élastique)


## 4. Le lâcher et le vol 

- Détecter quand l'utilisateur relâche la souris
- Couper l'élastique au bon moment pour que l'oiseau soit propulsé en avant

**=> Objectif** : l'oiseau s'envole avec une vraie trajectoire de parabole


## 5. Cibles et structures

- Créer une pile de blocs (rectangles en bois/pierre) qui tiennent en équilibre
- Ajouter des cibles (les petits cochons)

**=> Objectif** : l'oiseau fracasse la structure, les blocs tombent de manière réaliste et détruisent les cochons


## 6. Habillage graphique (polish)

- Remplacer le rond rouge par une image d'oiseau
- Remplacer les rectangles gris par des textures de caisses en bois
- Ajouter un fond d'écran (paysage)