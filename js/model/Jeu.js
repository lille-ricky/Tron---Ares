// Jeu.js

class Jeu {
    constructor(canevas, tickMs = 100) {
        this.nbColonnes = 80;
        this.nbLignes = 59;
        this.tailleCase = 10;
        this.canevas = canevas;
        this.grille = new Grille(this.nbColonnes, this.nbLignes);

        this.tickMs = tickMs;
        this._intervalId = null;
        this.enCours = false;

        // Joueurs avec positions cohérentes avec le HTML
        this.joueur1 = new Joueur("Joueur 1", "cyan", { x: 1, y: 28 }, "droite", null, this.grille);
        this.joueur2 = new Joueur("Joueur 2", "red", { x: 1, y: 30 }, "droite", null, this.grille);

        // Positions de départ
        this._depart = [
            { x: 1, y: 28, dir: "droite", nom: this.joueur1.nom },
            { x: 1, y: 30, dir: "droite", nom: this.joueur2.nom }
        ];

        // Tableau des scores
        this.tableauScores = new TableauScores([this.joueur1, this.joueur2]);
        this.majScoreboard();

        window.addEventListener("keydown", (e)=>{
            if (this.joueur1?.controles) this.joueur1.controles.traiterTouche(e.key);
            if (this.joueur2?.controles) this.joueur2.controles.traiterTouche(e.key);
        });


    }
    lierControles(controlesJ1, controlesJ2) {
        if (this.joueur1) this.joueur1.controles = controlesJ1;
        if (this.joueur2) this.joueur2.controles = controlesJ2;
    }


    lierTableauScores(tableauScores) {
        this.tableauScores = tableauScores;
    }

    demarrerJeu() {
        if (this.enCours) return;
        this.enCours = true;

        const btnNouvellePartie = document.querySelector(".btn-new-game");
        const btnConfig = document.querySelector(".btn-config");

        if (btnNouvellePartie) {
            btnNouvellePartie.disabled = true;
            btnNouvellePartie.textContent = "Partie en cours";
            btnNouvellePartie.classList.add("btn-disabled-game");
        }

        if (btnConfig) {
            btnConfig.disabled = true;
            btnConfig.classList.add("btn-disabled-config");
        }

        this.reinitialiserManche();
        this._intervalId = setInterval(() => {
            this.mettreAJour();
            this.majScoreboard(); // <- MAJ dynamique à chaque tick
        }, this.tickMs);
    }

    arreterJeu() {
        if (!this.enCours) return;
        clearInterval(this._intervalId);
        this.enCours = false;

        const btnNouvellePartie = document.querySelector(".btn-new-game");
        const btnConfig = document.querySelector(".btn-config");

        if (btnNouvellePartie) {
            btnNouvellePartie.disabled = false;
            btnNouvellePartie.textContent = "Nouvelle Partie";
            btnNouvellePartie.classList.remove("btn-disabled-game");
        }
        if (btnConfig) {
            btnConfig.disabled = false;
            btnConfig.classList.remove("btn-disabled-config");
        }
    }

    mettreAJour() {
        [this.joueur1, this.joueur2].forEach(j => j && j.vivant && j.mettreAJourDirection());

        [this.joueur1, this.joueur2].forEach(j => {
            if (!j || !j.vivant) return;
            if (j._demandeSaut) j.sauter();
            else j.deplacer();
        });

        this._verifierFinManche();
        this._dessiner();
    }

    _verifierFinManche() {
        const vivants = [this.joueur1, this.joueur2].filter(j => j && j.vivant);
        if (vivants.length === 2) return; // jeu continue

        this.arreterJeu();

        if (vivants.length === 1) {
            const gagnant = vivants[0];
            this.tableauScores.ajouterPoint(gagnant.nom);
            console.log("Manche terminée — gagnant :", gagnant.nom);
        } else {
            console.log("Manche terminée — égalité (aucun survivant)");
        }
    }

    reinitialiserManche() {
        if (this.grille && typeof this.grille.reinitialiser === "function") this.grille.reinitialiser();

        const [d1, d2] = this._depart;

        this.joueur1.reinitialiser({ x: d1.x, y: d1.y }, d1.dir);
        this.joueur2.reinitialiser({ x: d2.x, y: d2.y }, d2.dir);

        this.grille.occuper(d1.x, d1.y, this.joueur1.nom);
        this.grille.occuper(d2.x, d2.y, this.joueur2.nom);
        if (this.controleur && typeof this.controleur.resetClavier === "function") {
            this.controleur.resetClavier();
        }

        this._dessiner();
    }

    _dessiner() {
        if (!this.canevas) return;
        if (typeof this.canevas.effacer === "function") this.canevas.effacer();

        [this.joueur1, this.joueur2].forEach(j => {
            if (!j) return;
            const trace = j.trace || [];
            trace.forEach(p => {
                if (this.canevas.dessinerCase) this.canevas.dessinerCase(p.x, p.y, j.couleur);
            });
            const pos = j.position;
            if (pos && this.canevas.dessinerTete) this.canevas.dessinerTete(pos, j.couleur, j.direction);
        });
    }

    // Met à jour dynamiquement noms et scores dans le HTML
    majScoreboard() {
        if (!this.tableauScores) return;

        const players = document.querySelectorAll(".scoreboard .player");

        players.forEach(playerDiv => {
            const circle = playerDiv.querySelector(".player-circle-outer");
            if (!circle) return;

            const colorClass = circle.classList.contains("blue") ? "cyan" :
                circle.classList.contains("red") ? "red" : null;
            if (!colorClass) return;

            let joueur = colorClass === "cyan" ? this.joueur1 :
                colorClass === "red" ? this.joueur2 : null;

            if (!joueur) return;

            const h2 = playerDiv.querySelector("h2");
            const scoreP = playerDiv.querySelector(".score");

            if (h2) h2.textContent = joueur.nom;
            if (scoreP) scoreP.textContent = this.tableauScores.obtenirScore(joueur.nom);
        });
    }

    terminerJeu() {
        this.arreterJeu();
    }
}