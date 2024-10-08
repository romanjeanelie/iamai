import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { createNanoEvents } from "nanoevents";
import User, { getUserDataFireDB, saveUserDataFireDB, signOutUser } from "./User";
import Caroussel from "./components/Caroussel";
import Discussion from "./components/Discussion";
import HeroBento from "./components/HeroBento";
import Input from "./components/Input";
import { IntroAnimation } from "./components/IntroAnimation";
import WaitListForm from "./components/Login/WaitListForm";
import Navigation from "./components/Navigation";
import PreLoginContent from "./components/PreLoginContent";
import Slider from "./components/Slider";
import TaskManager from "./components/TaskManager";
import { auth } from "./firebaseConfig";
import animateString from "./utils/animateString";
import { GUI } from "dat.gui";

const divlogin = document.getElementById("divlogin");

// ---- DEBUG FUNCTIONS ----
const showFormValidation = () => {
  divlogin.style.display = "none";
  divwaitlist.style.display = "flex";
  divwaitlistform.style.display = "none";
  divwaitlistvalidation.style.display = "block";
};

const showForm = () => {
  divlogin.style.display = "none";
  divwaitlist.style.display = "flex";
  divwaitlistform.style.display = "flex";
  divwaitlistvalidation.style.display = "none";
};

const divwaitlist = document.getElementById("divwaitlist");
const divwaitlistvalidation = document.querySelector(".waitListForm__validation-container");
const divwaitlistform = document.getElementById("divwaitlistform");
const divlink = document.getElementById("divlinklogout");
const linksignout = document.getElementById("linksignout");
const signInButtons = document.querySelectorAll(".divgoogle");
const btnwaitlistinfosubmit = document.getElementById("btnwaitlistinfosubmit");
const txtcompany = document.getElementById("txtcompany");
const txttwitter = document.getElementById("txttwitter");
const txtfacebook = document.getElementById("txtfacebook");
const txtlinkedin = document.getElementById("txtlinkedin");
const txtuse = document.getElementById("txtuse");
var isStopped = false;

class App {
  constructor() {
    this.app = document.querySelector("#app");
    this.loginPage = document.querySelector(".login-page");
    this.pageEl = document.querySelector(".page-discussion");
    this.user = null;
    this.emitter = createNanoEvents();

    this.debug = import.meta.env.VITE_DEBUG === "true";
    this.introContent = new PreLoginContent();
    this.introAnim = new IntroAnimation();
    this.waitListForm = new WaitListForm();
    this.addListeners();
    this.resetScroll();

    if (this.debug) {
      this.gui = new GUI();
      this.toPageGrey({ duration: 0 });
      this.initApp();
      return;
    }
  }

  // Anim
  toPageGrey({ duration = 0 } = {}) {
    this.loginPage.style.transitionDuration = duration + "ms";
    this.pageEl.style.transitionDuration = duration + "ms";
    this.loginPage.classList.add("hidden");
    this.pageEl.classList.add("show");
  }

  initApp() {
    this.initNavbar();
    this.initDiscussion();
    this.initInput();
    this.initTaskManager();
    this.initSlider();
    this.initHeroBento();
  }

  initNavbar() {
    this.navigation = new Navigation({ user: this.user, emitter: this.emitter });
  }

  initCaroussel() {
    this.caroussel = new Caroussel();
    this.caroussel.init();
  }

  initDiscussion() {
    this.discussion = new Discussion({
      navigation: this.navigation,
      emitter: this.emitter,
      pageEl: this.pageEl,
      user: this.user,
    });
  }

  initHeroBento() {
    this.heroBento = new HeroBento({ user: this.user, emitter: this.emitter });
  }

  initInput() {
    const props = {
      discussion: this.discussion,
      toPageGrey: this.toPageGrey.bind(this),
      emitter: this.emitter,
    };

    this.input = new Input({ pageEl: this.pageEl, isActive: false, ...props });
  }

  initTaskManager() {
    this.taskManager = new TaskManager({
      gui: this.gui,
      emitter: this.emitter,
      discussion: this.discussion,
      navigation: this.navigation,
    });
  }

  initSlider() {
    this.slider = new Slider({ emitter: this.emitter, pageEl: this.pageEl });
  }

  resetScroll() {
    window.scrollTo(0, 0);
  }

  startAnimations(textArray, element) {
    let index = 0;
    this.next(textArray, index, element, "");
  }

  next = (textArray, index, element, imgSrc = "") => {
    if (isStopped) return;
    if (index < textArray.length) {
      animateString(index, textArray, element, imgSrc, this.next, 50, 1, 1600);
    } else {
      index = 0;
      animateString(index, textArray, element, imgSrc, this.next, 50, 1, 1600);
    }
  };

  toggleSignIn() {
    sessionStorage.setItem("attemptedSignIn", "true");

    for (let i = 0; i < signInButtons.length; i++) {
      signInButtons[i].style.display = "none";
    }
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    signInWithPopup(auth, provider)
      .then(function (result) {
        if (!result) return;
        const credential = GoogleAuthProvider.credentialFromResult(result);
      })
      .catch(function (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
        if (errorCode === "auth/account-exists-with-different-credential") {
          alert("You have already signed up with a different auth provider for that email.");
        } else {
          for (let i = 0; i < signInButtons.length; i++) {
            signInButtons[i].style.display = "flex";
          }
        }
      });
  }

  async checkuserwaitlist(user) {
    this.user = user;
    console.log("checkuserwaitlist : ", this.user);
    var userstatus = await getUserDataFireDB(user);
    if (userstatus) {
      this.user.setstatus(userstatus.status);
    }
    if (sessionStorage.getItem("attemptedSignIn") === "true") {
      sessionStorage.removeItem("attemptedSignIn");
    }
    await this.checkuser();
  }
  async saveUser() {
    console.log("saveuser");
    if (txtuse.value.length > 0) {
      this.user.setprofile(txtcompany.value, txttwitter.value, txtfacebook.value, txtlinkedin.value, txtuse.value);
      await saveUserDataFireDB(this.user);
      divlogin.style.display = "none";
      divwaitlist.style.display = "flex";
      divwaitlistvalidation.style.display = "block";
      divwaitlistform.style.display = "none";
    } else {
      txtuse.classList.add("error");
    }
  }

  async checkuser() {
    if (this.user) {
      isStopped = true;
      if (this.user.status == "active") {
        await this.user.setuseraddress();
        this.toPageGrey({ duration: 1200 });
        // this.user = user;
        console.time("logged in");
        if (this.debug) return;
        this.initApp();
        this.heroBento.anims.showBentoCards();
      } else if (this.user.status == "waitlisted") {
        divlogin.style.display = "none";
        divwaitlist.style.display = "flex";
        divwaitlistvalidation.style.display = "block";
        divwaitlistform.style.display = "none";
      } else {
        divlogin.style.display = "none";
        divwaitlist.style.display = "flex";
        divwaitlistvalidation.style.display = "none";
        divlink.style.display = "flex";
        divwaitlistform.style.display = "flex";
      }
    } else {
      divlogin.style.display = "block";
    }
  }

  addListeners() {
    onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        try {
          // let idToken = await user.getIdToken(true);
          const loggedinuser = new User(user.uid, user.displayName, user.photoURL, user.email, user);
          await this.checkuserwaitlist(loggedinuser);
        } catch (error) {
          console.log(error);
        }
      } else {
        signInButtons.forEach((button) => (button.style.display = "flex"));
      }
    });

    window.addEventListener("load", async () => {
      console.log("ADDING PRELOAD");
      this.app.classList.add("preload");
      for (let i = 0; i < signInButtons.length; i++) {
        signInButtons[i].addEventListener("click", this.toggleSignIn, false);
      }

      if (linksignout) {
        linksignout.addEventListener("click", (e) => {
          // e.preventDefault();
          signOutUser();
        });
      }

      btnwaitlistinfosubmit.addEventListener("click", async () => {
        await this.saveUser();
      });

      //load and play the animations
      this.introAnim.animate({ callback: this.checkuser.bind(this) });
    });

    Promise.all([new Promise((resolve) => window.addEventListener("load", resolve)), document.fonts.ready]).then(() => {
      console.log("REMOVING PRELOAD");
      this.app.classList.remove("preload");
    });
  }
}

new App();
