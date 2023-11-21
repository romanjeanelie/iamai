import "../scss/index.scss";
import Caroussel from "./components/Caroussel";
import Input from "./components/Input";

class App {
  constructor() {
    this.addListeners();
  }

  initApp() {
    this.initCaroussel();
    this.initInput();
  }

  initCaroussel() {
    this.caroussel = new Caroussel();
    this.caroussel.init();
  }

  initInput() {
    new Input();
  }

  addListeners() {
    window.addEventListener("load", () => {
      document.body.classList.remove("preload");
    });
    document.fonts.ready.then(() => {
      this.initApp();
    });
  }
}

new App();
