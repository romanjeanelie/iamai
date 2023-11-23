import Caroussel from "./components/Caroussel";
import Input from "./components/Input";
import Navbar from "./components/Navbar";

class App {
  constructor() {
    this.pageBlue = document.querySelector(".page-blue");
    this.pageGrey = document.querySelector(".page-grey");

    this.addListeners();
    this.resetScroll();
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
    new Input({ pageEl: this.pageBlue });
    new Input({ pageEl: this.pageGrey });
  }

  resetScroll() {
    window.scrollTo(0, 0);
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
