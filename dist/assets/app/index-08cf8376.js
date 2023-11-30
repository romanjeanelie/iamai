import Caroussel from "./components/Caroussel-97d86629.js";
import Input from "./components/Input/index-b1b35066.js";
import Navbar from "./components/Navbar-967e2a81.js";
import Discussion from "./components/Discussion-9652e326.js";
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
    this.initDiscussion();
    this.initInput();
  }
  initNavbar() {
    new Navbar();
  }
  initCaroussel() {
    this.caroussel = new Caroussel();
    this.caroussel.init();
  }
  initDiscussion() {
    this.discussion = new Discussion();
  }
  initInput() {
    const callbacks = {
      addUserElement: this.discussion.addUserElement
    };
    new Input({ pageEl: this.pageBlue, ...callbacks });
    new Input({ pageEl: this.pageGrey, ...callbacks });
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
