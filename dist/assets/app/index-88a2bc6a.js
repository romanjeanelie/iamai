/* empty css                           */import Caroussel from "./components/Caroussel-4b9dd825.js";
import InputText from "./components/InputText/index-34baca1c.js";
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
