import "../scss/index.scss";
import Caroussel from "./components/Caroussel";
import Input from "./components/Input";
import Navbar from "./components/Navbar";

class App {
  constructor() {
    this.addListeners();
  }

  initApp() {
    this.initNavbar();
    this.initCaroussel();
    this.initInput();
  }

  initNavbar() {
    new Navbar();
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
