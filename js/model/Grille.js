class Grille{
    constructor(colonnes,lignes){
        //initialise une grille vide

        this.colonnes=colonnes;
        this.lignes=lignes;
        this.cellules=[];
        this.reinitialiser();

    }

   //verifie si une cellule est libre

    estlibre(x,y){
        //verifie si la cellule aux coordonnees (x,y) est libre
        if (x<0 || x>=this.colonnes || y<0 || y>=this.lignes){
            return false; //hors de la grille
        }
        return this.cellules[x][y]===null;
    }
    

    /**
     * Occupe une cellule de la grille avec un joueur donné
     * @param {Array} coordonnees - Les coordonnées [x, y] de la cellule a occuper
     * @param {Object} joueur - Le joueur qui occupe la cellule
     */
    occuper(x,y, joueur){
        //occupe la cellule aux coordonnees (x,y) avec le joueur donné
        if (this.estlibre(x,y)){
            this.cellules[x][y]=joueur;
            return true;
        }
        return false;   
      
    }

  
     

    reinitialiser(){
        //remplit la grille de cellules vides (null)
        this.cellules=[];
        for (let x=0; x<this.colonnes; x++){
            this.cellules[x]=[];
            for (let y=0; y<this.lignes; y++){
                this.cellules[x][y]=null;
            }
        }
    }
}