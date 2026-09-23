class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //retourne les coordonnees sous forme d'un tableau

    coordonees() {
        return [this.x, this.y];
        /**utile pour les fonctions qui prennent des coordonnees en tableau
         * ex: mouvementValide([x,y])
         * grille.occuper([x,y],joueur)
         */

    }
    /**
     * Dessine le point sur le contexte de dessin donnz
     * @param {CanvasRenderingContext2D} context - Le contexte de dessin du canvas.
     * @param {number} tailleCase - La taille de chaque case en pixels.
     * @param {string} couleur - La couleur de remplissage du point.
     */
    dessiner(context, tailleCase, couleur) {
        if (!context || tailleCase <= 0) // Validation des paramètres
        {
            throw new Error("Contexte invalide ou taille de case non positive.");
        }

        context.fillStyle = couleur || '#FFFFFF'; // Couleur par défaut blanche
        context.fillRect(this.x * tailleCase, this.y * tailleCase, tailleCase, tailleCase);

    }

       /**
     * Permet de comparer deux points
     * utilisé pour vérifier si deux positions sont identiques
     * utilisé pour verifier si un joueur a deja passé par une cellule dans l'historique des positions
     *
     * 
     */
    compare(point) {
        return this.x === point.x && this.y === point.y;
    }
 
    

    /**
     * 
    * Retourne un nouveau point déplacé dans la direction spécifiée
    * utiliseé dans joueur.deplacer(direction) ou /et joueur.sauter(direction)
    * 
    * @param {string} directions - La direction du mouvement ('haut', 'bas', 'gauche', 'droite').
    * @param {number} pas - Le nombre de cases à déplacer (par défaut 1).
    * @returns {Point} - Un nouveau point représentant la nouvelle position.
     */
    suivant(directions , pas=1) {
        let nouvelleX = this.x;
        let nouvelleY = this.y;

        switch (directions) {
            case 'haut':
                nouvelleY -= pas;
                break;
            case 'bas':
                nouvelleY += pas;
                break;
            case 'gauche':
                nouvelleX -= pas;
                break;
            case 'droite':
                nouvelleX += pas;
                break;
            default:
                throw new Error("Direction invalide. Utilisez 'haut', 'bas', 'gauche' ou 'droite'.");
        }

        return new Point(nouvelleX, nouvelleY);

    }



}