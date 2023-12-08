import Caroussel from "./components/Caroussel-7626d3d8.js";
import Input from "./components/Input/index-afa37693.js";
import Navbar from "./components/Navbar-967e2a81.js";
import Discussion from "./components/Discussion-ecee6b61.js";
class App {
  constructor() {
    this.pageBlue = document.querySelector(".page-blue");
    this.pageGrey = document.querySelector(".page-grey");
    this.navbarEl = document.querySelector(".nav");
    this.cancelBtn = document.querySelector(".cancel-btn");
    this.addListeners();
    this.resetScroll();
  }
  // Anim
  toPageGrey({ duration = 0 } = {}) {
    this.pageBlue.style.transitionDuration = duration + "ms";
    this.pageGrey.style.transitionDuration = duration + "ms";
    this.pageBlue.classList.add("hidden");
    this.pageGrey.classList.add("show");
    this.navbarEl.classList.add("dark");
    this.cancelBtn.classList.add("dark");
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
    this.discussion = new Discussion({
      toPageGrey: this.toPageGrey.bind(this)
    });
  }
  initInput() {
    const props = {
      discussion: this.discussion,
      toPageGrey: this.toPageGrey.bind(this)
    };
    new Input({ pageEl: this.pageBlue, ...props });
    new Input({ pageEl: this.pageGrey, ...props });
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
