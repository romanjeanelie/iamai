import "../scss/index.scss";
import Caroussel from "./components/Caroussel";
import InputText from "./components/InputText";

class App {
  constructor() {
    this.addListeners();
  }

  initApp() {
    this.initCaroussel();
    this.initInputText();
  }

  initCaroussel() {
    this.caroussel = new Caroussel();
    this.caroussel.init();
  }
  initInputText() {
    new InputText();
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
