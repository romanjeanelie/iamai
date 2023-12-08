import Caroussel from "./components/Caroussel";
import Input from "./components/Input";
import Navbar from "./components/Navbar";
import Discussion from "./components/Discussion";
import { createNanoEvents } from "nanoevents";

class App {
  constructor() {
    this.pageBlue = document.querySelector(".page-blue");
    this.pageGrey = document.querySelector(".page-grey");
    this.navbarEl = document.querySelector(".nav");
    this.cancelBtn = document.querySelector(".cancel-btn");

    this.emitter = createNanoEvents();

    this.addListeners();
    this.resetScroll();

    // this.redirectToLogin();
  }

  redirectToLogin() {
    window.location.href = "/login/index.html";
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
      emitter: this.emitter,
      toPageGrey: this.toPageGrey.bind(this),
    });
  }

  initInput() {
    const props = {
      discussion: this.discussion,
      toPageGrey: this.toPageGrey.bind(this),
      emitter: this.emitter,
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
