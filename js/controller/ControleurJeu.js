/**
*Crée et lie les controles des joueurs au jeu
*Gère le clavier pour chaque joueur/ les evenements
*Gère les boutons/Nouvelle Partie et Configuration des touches
*Utilise jQuery UI pour la fenêtre de configuration des touches et sauvegarde les nouvelles touches dans le localStorage
 */

/* global $ */



class ControleurJeu {
    constructor(jeu) {
        this.jeu = jeu;
        this.jeu.controleur = this;

        this.controlesJ1 = new Controles(1);
        this.controlesJ2 = new Controles(2);


        this.jeu.lierControles(this.controlesJ1, this.controlesJ2);

        document.addEventListener("DOMContentLoaded", () => {
            this.controlesJ1.afficherTouchesDansHTML(
                this.controlesJ1.touchesDirection,
                this.controlesJ2.touchesDirection
            );
        });

        this._initialiserBoutons();
        this._initialiserClavier();
        this._initialiserDialogConfig();
        this.majAffichagePanel();
    }

    _initialiserBoutons() {

        const btnNouvellePartie = document.querySelector(".btn-new-game");
        btnNouvellePartie.addEventListener("click", () => {
            this.jeu.demarrerJeu();

        });

        const btnConfig = document.querySelector(".btn-config");
        btnConfig.addEventListener("click", () => {
            $("#dialog-config").dialog("open");
        });
    }

    _initialiserClavier() {
        document.addEventListener("keydown", (e) => {
            const key = e.key.toUpperCase();

            // Joueur 1
            for (let dir in this.controlesJ1.touchesDirection) {
                if (this.controlesJ1.touchesDirection[dir] === key) {
                    if (dir.toLowerCase() === "saut") {
                        this.jeu.joueur1._demandeSaut = true;
                    } else {
                        this.controlesJ1.ajouterDirection(dir.toLowerCase());
                    }
                }
            }

            // Joueur 2
            for (let dir in this.controlesJ2.touchesDirection) {
                if (this.controlesJ2.touchesDirection[dir] === key) {
                    if (dir.toLowerCase() === "saut") {
                        this.jeu.joueur2._demandeSaut = true;
                    } else {
                        this.controlesJ2.ajouterDirection(dir.toLowerCase());
                    }
                }
            }
        });
    }

    _initialiserDialogConfig() {

        $("#dialog-config").dialog({
            autoOpen: false,
            width: 400,
            modal: true
        });



        // function pour mettre à jour le panel principal ET le dialogue
        const majAffichagePanel = () => {
            const actions = ["gauche", "droite", "haut", "bas", "saut"];

            actions.forEach((action, i) => {
                // Panel principal
                $(".controls-player.player-cyan .key-cyan").eq(i)
                    .text(this.controlesJ1.touchesDirection[action]);
                $(".controls-player.player-red .key-red").eq(i)
                    .text(this.controlesJ2.touchesDirection[action]);

                // Dialogue
                $("#dialog-config .key-cyan").eq(i)
                    .text(this.controlesJ1.touchesDirection[action]);
                $("#dialog-config .key-red").eq(i)
                    .text(this.controlesJ2.touchesDirection[action]);
            });
        };
        this.majAffichagePanel = majAffichagePanel;

        // edition des touches uniquement DANS le dialogue
        $("#dialog-config .key-cyan, #dialog-config .key-red").on("click", (event) => {
            const div = $(event.currentTarget);
            const oldValue = div.text();
            div.text("_");

            const handleKey = (e) => {
                e.preventDefault();
                const key = e.key.toUpperCase();
                const isCyan = div.hasClass("key-cyan");
                const joueur = isCyan ? this.controlesJ1 : this.controlesJ2;
                const autreJoueur = isCyan ? this.controlesJ2 : this.controlesJ1;

                const touchesJoueur = Object.values(joueur.touchesDirection);
                const touchesAutre = Object.values(autreJoueur.touchesDirection);

                if (touchesJoueur.includes(key)) {
                    alert("Cette touche est déjà utilisée par ce joueur !");
                    div.text(oldValue);
                    $(document).off("keydown", handleKey);
                    return;
                }
                if (touchesAutre.includes(key)) {
                    alert("Cette touche est déjà utilisée par l'autre joueur !");
                    div.text(oldValue);
                    $(document).off("keydown", handleKey);
                    return;
                }

                const dir = div.parent().find("p").text().toLowerCase();
                joueur.definirTouche(dir, key);


                majAffichagePanel();

                $(document).off("keydown", handleKey);
            };

            $(document).on("keydown", handleKey);
        });


        $("#btn-save-controls").on("click", () => {
            let valide = true;

            $("#dialog-config .key-cyan, #dialog-config .key-red").each((_i, elem) => {
                if ($(elem).text() === "_") valide = false;
            });

            if (!valide) {
                alert("Certaines touches sont invalides. Corrigez-les avant de sauvegarder !");
                return;
            }

            majAffichagePanel();
            alert("Touches sauvegardées !");
            $("#dialog-config").dialog("close");
        });

        $("#btn-cancel-controls").on("click", () => {
            majAffichagePanel();
            alert("Modification annulée");
            $("#dialog-config").dialog("close");
        });

        $("#btn-reset-controls").on("click", () => {
            this.controlesJ1.reinitialiser();
            this.controlesJ2.reinitialiser();

            majAffichagePanel();
            alert("Touches réinitialisées aux valeurs par défaut !");
        });


        $("#dialog-config").on("dialogopen", () => {
            majAffichagePanel();
        });
    }


    resetClavier() {
        if (this.controlesJ1 && typeof this.controlesJ1.resetDirections === "function")
            this.controlesJ1.resetDirections();

        if (this.controlesJ2 && typeof this.controlesJ2.resetDirections === "function")
            this.controlesJ2.resetDirections();

        this.directionCouranteJ1 = null;
        this.directionCouranteJ2 = null;

        if (this.touches) {
            for (let k in this.touches) this.touches[k] = false;
        }
        this.jeu.joueur1._demandeSaut = false;
        this.jeu.joueur2._demandeSaut = false;
    }


}