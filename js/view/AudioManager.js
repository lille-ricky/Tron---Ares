/**
 * Gère la musique de fond et les effets sonores du jeu.
 * La lecture ne peut démarrer qu'après une interaction utilisateur
 * (politique des navigateurs).
 */
class AudioManager {
  constructor() {
    this.musique = document.getElementById("bg-music");
    if (!this.musique) {
      console.warn("AudioManager : élément #bg-music introuvable.");
    }

    this.volumeBase = 0.4;
    if (this.musique) this.musique.volume = this.volumeBase;

    this.demarree = false;

    if (this.musique) this._armerDemarrage();
  }

  _armerDemarrage() {
    const demarrer = () => {
      if (this.demarree) return;
      this.musique.play()
        .then(() => { this.demarree = true; })
        .catch(err => console.warn("Lecture audio bloquée :", err));
      document.removeEventListener("click", demarrer);
      document.removeEventListener("keydown", demarrer);
    };

    document.addEventListener("click", demarrer, { once: true });
    document.addEventListener("keydown", demarrer, { once: true });
  }

  play() {
    if (!this.demarree || !this.musique) return;
    this.musique.play().catch(() => {});
  }

  pause() {
    this.musique?.pause();
  }

  setVolume(v) {
    this.volumeBase = Math.max(0, Math.min(1, v));
    if (this.musique) this.musique.volume = this.volumeBase;
  }

  /** Baisse temporairement le volume (ex. pendant une manche). */
  duck(v = 0.15) {
    if (!this.musique) return;
    this.musique.volume = Math.max(0, Math.min(1, v));
  }

  /** Rétablit le volume de base configuré par setVolume(). */
  unduck() {
    if (!this.musique) return;
    this.musique.volume = this.volumeBase;
  }
}

export default AudioManager;