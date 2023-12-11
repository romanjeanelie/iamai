import Caroussel from "./components/Caroussel-7626d3d8.js";
import Input from "./components/Input/index-05286e45.js";
import Navbar from "./components/Navbar-967e2a81.js";
import Discussion from "./components/Discussion-17e143ad.js";
import { createNanoEvents } from "../node_modules/nanoevents/index-3cf5d8e6.js";
function decodeJwtResponse(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window.atob(base64).split("").map(function(c) {
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join("")
  );
  return JSON.parse(jsonPayload);
}
class User {
  constructor(uuid, name, picture, email) {
    this.uuid = uuid;
    this.name = name;
    this.picture = picture;
    this.email = email;
  }
}
class App {
  constructor() {
    this.pageBlue = document.querySelector(".page-blue");
    this.pageGrey = document.querySelector(".page-grey");
    this.navbarEl = document.querySelector(".nav");
    this.cancelBtn = document.querySelector(".cancel-btn");
    this.emitter = createNanoEvents();
    this.user = this.getUser();
    this.addListeners();
    this.resetScroll();
    if (!this.user) {
      this.redirectToLogin();
    }
  }
  getUser() {
    if (localStorage.getItem("googleToken")) {
      const responsePayload = decodeJwtResponse(localStorage.getItem("googleToken"));
      return new User(responsePayload.sub, responsePayload.name, responsePayload.picture, responsePayload.email);
    } else {
      return null;
    }
  }
  redirectToLogin() {
    console.log("notloggedin");
    window.location.href = "./login/index.html";
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
      toPageGrey: this.toPageGrey.bind(this)
    });
  }
  initInput() {
    const props = {
      discussion: this.discussion,
      toPageGrey: this.toPageGrey.bind(this),
      emitter: this.emitter
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