/* empty css                           */import Caroussel from "./components/Caroussel-4b9dd825.js";
import Input from "./components/Input/index-8283a783.js";
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
