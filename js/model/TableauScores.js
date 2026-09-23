class TableauScores {
    constructor(joueurs = []) {
        this.scores = {};
        joueurs.forEach(j => {
            if (j && j.nom) this.scores[j.nom] = 0;
            else if (typeof j === "string") this.scores[j] = 0;
        });
    }

    ajouterPoint(nomJoueur) {
        if (nomJoueur in this.scores) {
            this.scores[nomJoueur]++;
        } else {
            console.warn(`Le joueur "${nomJoueur}" n'existe pas dans le tableau de scores`);
        }
    }

    obtenirScore(nomJoueur) {
        return this.scores[nomJoueur] || 0;
    }

 

    obtenirTousLesScores() {
        return Object.assign({}, this.scores);
    }

    reinitialiser() {
        for (let nom in this.scores) {
            this.scores[nom] = 0;
        }
    }
}