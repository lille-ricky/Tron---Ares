class Historique {
    constructor() {
        this.points = [];
    }

    ajouter(point) {

        this.points.push({ x: point.x, y: point.y });
    }

    contient(point) {
        return this.points.some(p => p.x === point.x && p.y === point.y);
    }



    reset() {
        this.points = [];
    }
}