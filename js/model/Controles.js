/**
 * Classe qui gère les contrôles du joueur :
 *   touches du clavier
 *  file d'attente des directions pressées
 *  empêche les directions invalides ( demitour)
 *  sauvegarde et lecture des touches personnalisées via localStorage
 */

class Controles {
  constructor(numeroJoueur) {
    this.numeroJoueur = numeroJoueur;
    // clé unique pour le localStorage selon le joueur
    this.cleLocalStorage = `tronControlsJ${numeroJoueur}`;

    // recupere les touches depuis localStorage sinon par défaut
    this.touchesDirection = JSON.parse(localStorage.getItem(this.cleLocalStorage)) || this.touchesParDefaut();

    this.directionSuivante = [];
    this.directionActuelle = null;
  }

  touchesParDefaut() {
    if (this.numeroJoueur === 1) {
      return { gauche: "A", droite: "D", haut: "W", bas: "S", saut: "X" };
    } else {
      return { gauche: "J", droite: "L", haut: "I", bas: "K", saut: "M" };
    }
  }
  afficherTouchesDansHTML(touchesJ1, touchesJ2) {
    const ordre = ["gauche", "droite", "haut", "bas", "saut"];

    // Joueur 1
    document.querySelectorAll(".player-cyan .key-cyan")
      .forEach((div, i) => {
        const action = ordre[i];
        div.textContent = touchesJ1[action];
      });

    // Joueur 2
    document.querySelectorAll(".player-red .key-red")
      .forEach((div, i) => {
        const action = ordre[i];
        div.textContent = touchesJ2[action];
      });
  }


  definirTouche(direction, key) {
    key = key.toUpperCase();

    

    this.touchesDirection[direction] = key;
    if (typeof this.sauvegarder === "function") this.sauvegarder();

    return true;
  }
  /**
 * Analyse une touche pressée et décide si elle doit être ajoutée
 * dans la file directionSuivante.
 */
traiterTouche(key){
    let action=null;
    for (const [dir, touche] of Object.entries(this.touchesDirection)){
        if (touche===key) {
            action=dir; 
            break;
        }
    }

    if(!action) return;

    if(action==="saut"){
        this.ajouterDirection("saut");
        return;
    }

    const opposées={
        haut: "bas",
        bas: "haut",
        gauche: "droite",
        droite: "gauche",
    };

    if(this.directionActuelle && opposées[this.directionActuelle]===action){
      return; 
    }

    this.ajouterDirection(action);
}


  obtenirTouche(direction) {
    return this.touchesDirection[direction];
  }

  // Sauvegarde la configuration actuelle dans le localStorage

  sauvegarder() {
    localStorage.setItem(this.cleLocalStorage, JSON.stringify(this.touchesDirection));
  }

  ajouterDirection(dir) {
    this.directionSuivante.push(dir);
  }

  prochaineDirection() {
    return this.directionSuivante.shift() || null;
  }

  reinitialiser() {
    this.touchesDirection = this.touchesParDefaut();
    this.directionSuivante = [];
    this.directionActuelle = null;
    this.sauvegarder();
  }
  resetDirections() {
    this.directionSuivante = [];
    this.directionActuelle = null;
}

}