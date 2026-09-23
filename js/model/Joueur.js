// Joueur.js

class Joueur {
    constructor(nom, couleur, positionInitiale, directionInitiale, controles, grille) {
        this.nom = nom;
        this.couleur = couleur;
        this.controles = controles;
        this.grille = grille;

        this.position = new Point(positionInitiale.x, positionInitiale.y);
        this.direction = directionInitiale;
        this.trace = [new Point(this.position.x, this.position.y)];

        this.historique = new Historique();
        this.historique.ajouter(this.position);

        this.vivant = true;
        this._demandeSaut = false;
    }

    // Met à jour la direction à partir des controles (une seule direction par tick)
    mettreAJourDirection() {
        const prochain = this.controles.prochaineDirection();
        if (prochain && !this.estDirectionInverse(prochain)) {
            this.direction = prochain;
        }

        const d=this.controles.prochaineDirection();
        if(d){
            if(d==="saut") {
                this._demandeSaut=true;
            }else{
                this.direction=d;
                this.controles.directionActuelle=d;
            }
        }

    }

    estDirectionInverse(nouvelleDir) {
        return (
            (this.direction === "haut" && nouvelleDir === "bas") ||
            (this.direction === "bas" && nouvelleDir === "haut") ||
            (this.direction === "gauche" && nouvelleDir === "droite") ||
            (this.direction === "droite" && nouvelleDir === "gauche")
        );
    }

    deplacer() {
        if (!this.vivant) return;
        const np = this.position.suivant(this.direction);
        if (
            np.x < 0 || np.x >= this.grille.colonnes ||
            np.y < 0 || np.y >= this.grille.lignes ||
            !this.grille.estlibre(np.x, np.y) ||
            this.historique.contient(np)
        ) {
            this.vivant = false;
            return;
        }
        this._appliquerPosition(np);
    }

   sauter() {
    if (!this.vivant) return;

    const caseInterm = this.position.suivant(this.direction, 1); // case sautée
    const np = this.position.suivant(this.direction, 2);         // case d'arrivée

    if (np.x < 0 || np.x >= this.grille.colonnes || np.y < 0 || np.y >= this.grille.lignes) {
        this.vivant = false;
        this._demandeSaut = false;
        return;
    }

    if (this.grille.estlibre(np.x, np.y) && !this.historique.contient(np)) {

        if (this.grille.estlibre(caseInterm.x, caseInterm.y)) {
            this.grille.occuper(caseInterm.x, caseInterm.y, this.nom);
            this.trace.push(new Point(caseInterm.x, caseInterm.y));
            this.historique.ajouter(new Point(caseInterm.x, caseInterm.y));
        }

        this._appliquerPosition(np);

    } else {
        this.vivant = false;
    }

    this._demandeSaut = false;
}


    _appliquerPosition(np) {
        this.position = new Point(np.x, np.y);
        this.trace.push(new Point(np.x, np.y));
        this.historique.ajouter(new Point(np.x, np.y));
        this.grille.occuper(np.x, np.y, this.nom);
    }

    reinitialiser(posObj, dir) {
        this.position = new Point(posObj.x, posObj.y);
        this.direction = dir;
        this.trace = [new Point(this.position.x, this.position.y)];
        if (this.historique && typeof this.historique.reset === "function") {
            this.historique.reset();
            this.historique.ajouter(new Point(this.position.x, this.position.y));
        }
        this.vivant = true;
        this._demandeSaut = false;
    }
}