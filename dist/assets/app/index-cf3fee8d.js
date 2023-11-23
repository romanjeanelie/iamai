/* empty css                           */import Caroussel from "./components/Caroussel-4b9dd825.js";
import Input from "./components/Input/index-b8838e60.js";
import Navbar from "./components/Navbar-991c0115.js";
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
