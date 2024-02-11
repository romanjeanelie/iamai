import Caroussel from "./components/Caroussel";
import Input from "./components/Input";
import Navbar from "./components/Navbar";
import Discussion from "./components/Discussion";
import Slider from "./components/Slider";
import { getUser, redirectToLogin } from "./User";
import { createNanoEvents } from "nanoevents";
import { auth } from '../app/firebaseConfig';
import { signOut } from "firebase/auth";


class App {
  constructor() {
    this.app = document.querySelector("#app");
    this.pageBlue = document.querySelector(".page-blue");
    this.pageGrey = document.querySelector(".page-grey");
    this.navbarEl = document.querySelector(".nav");
    this.cancelBtn = document.querySelector(".cancel-btn");
    this.user = getUser();
    // getUser().then(user => {
    // this.user = user;
    // });
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
    console.log("index user", this.user);
    console.log(" ==== is it from here ? =====")
    this.discussion = new Discussion({
      emitter: this.emitter,
      toPageGrey: this.toPageGrey.bind(this),
      user: this.user,
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
    // getUser().then(user => {
    // this.user = user;
    this.user.then((user) => {
      console.log("this.user", this.user);
      this.user = user;
      // if (!this.user) {
      //   redirectToLogin();
      // }
    });

    // });

    window.addEventListener("load", () => {
      // Avoid flash blue page
      this.app.classList.remove("preload");
      document.getElementById('signOutButton').addEventListener('click', () => {
        signOut(auth).then(() => {
          console.log("User signed out.");
          redirectToLogin();
        }).catch((error) => {
          console.error("Error signing out: ", error);
        });
      });
    });
    document.fonts.ready.then(() => {
      this.initApp();
    });
  }
}

new App();
