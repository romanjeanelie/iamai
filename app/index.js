import Caroussel from "./components/Caroussel";
import Input from "./components/Input";
import Navbar from "./components/Navbar";
import Discussion from "./components/Discussion";
import Slider from "./components/Slider";
import { getUser, redirectToLogin } from "./User";
import { createNanoEvents } from "nanoevents";

class App {
  constructor() {
    this.app = document.querySelector("#app");
    this.pageBlue = document.querySelector(".page-blue");
    this.pageGrey = document.querySelector(".page-grey");
    this.navbarEl = document.querySelector(".nav");
    this.cancelBtn = document.querySelector(".cancel-btn");

    this.emitter = createNanoEvents();

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

    setTimeout(() => {
      this.inputBluePage.isActive = false;
      this.inputGreyPage.isActive = true;
    });
  }

  initApp() {
    this.initNavbar();
    this.initCaroussel();
    this.initDiscussion();
    this.initInput();
    this.initSlider();
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

    this.inputBluePage = new Input({ pageEl: this.pageBlue, isActive: true, ...props });
    this.inputGreyPage = new Input({ pageEl: this.pageGrey, isActive: false, ...props });
  }

  initSlider() {
    this.slider = new Slider({ emitter: this.emitter, pageEl: this.pageGrey });
  }

  resetScroll() {
    window.scrollTo(0, 0);
  }

  addListeners() {
    getUser().then(user => {
      this.user = user;
      console.log("this.user", this.user);
      if (!this.user) {
        redirectToLogin();
      }
    });

    window.addEventListener("load", () => {
      // Avoid flash blue page
      this.app.classList.remove("preload");
    });
    document.fonts.ready.then(() => {
      this.initApp();
    });
  }
}

new App();
