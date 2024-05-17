import * as dat from "dat.gui";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { createNanoEvents } from "nanoevents";
import User, { getUserDataFireDB, redirectToLogin, saveUserDataFireDB } from "./User";
import Caroussel from "./components/Caroussel";
import Discussion from "./components/Discussion";
import Input from "./components/Input";
import { IntroAnimation } from "./components/IntroAnimation";
import Navbar from "./components/Navbar";
import Slider from "./components/Slider";
import TaskManager from "./components/TaskManager";
import { auth } from "./firebaseConfig";
import stopOverscroll from "./utils/stopOverscroll";
import IntroContent from "./IntroContent";
import animateString from "./utils/animateString";
import WaitListForm from "./components/Login/WaitListForm";

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
const signInButton = document.getElementById("divgoogle");
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
    this.pageBlue = document.querySelector(".page-blue");
    this.pageGrey = document.querySelector(".page-grey");
    this.cancelBtn = document.querySelector(".cancel-btn");
    this.user = null;
    // getUser().then(user => {
    // this.user = user;
    // });
    this.emitter = createNanoEvents();

    this.debug = import.meta.env.VITE_DEBUG === "true";
    this.introContent = new IntroContent();
    this.introAnim = new IntroAnimation();
    this.waitListForm = new WaitListForm();
    this.addListeners();
    this.resetScroll();
    // stopOverscroll is a function that prevents overscrolling behavior on touch devices.
    // to be tested on a touch device
    stopOverscroll();

    if (this.debug) {
      this.gui = new dat.GUI();
      this.gui.hide();
      showForm();
      // this.toPageGrey({ duration: 0 });
      // this.initApp();
      return;
    }
  }

  // Anim
  toPageGrey({ duration = 0 } = {}) {
    this.loginPage.style.transitionDuration = duration + "ms";
    this.pageGrey.style.transitionDuration = duration + "ms";
    this.loginPage.classList.add("hidden");
    this.pageGrey.classList.add("show");
  }

  initApp() {
    this.initNavbar();
    this.initCaroussel();
    this.initDiscussion();
    this.initInput();
    this.initTaskManager();
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
      user: this.user,
    });
  }

  initInput() {
    const props = {
      discussion: this.discussion,
      toPageGrey: this.toPageGrey.bind(this),
      emitter: this.emitter,
    };

    // this.inputBluePage = new Input({ pageEl: this.pageBlue, isActive: true, ...props });
    this.inputGreyPage = new Input({ pageEl: this.pageGrey, isActive: false, ...props });
  }
  initTaskManager() {
    this.taskManager = new TaskManager({ emitter: this.emitter, pageEl: this.pageGrey, gui: this.gui });
  }

  initSlider() {
    this.slider = new Slider({ emitter: this.emitter, pageEl: this.pageGrey });
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
    signInButton.style.display = "none";
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    signInWithPopup(auth, provider)
      .then(function (result) {
        if (!result) return;
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
      })
      .catch(function (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
        if (errorCode === "auth/account-exists-with-different-credential") {
          alert("You have already signed up with a different auth provider for that email.");
        } else {
          signInButton.style.display = "flex";
        }
      });
  }

  signoutgoogle() {
    signOut(auth)
      .then(() => {
        console.log("User signed out.");
        redirectToLogin();
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
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
      console.log("this.user:", this.user);
      if (this.user.status == "active") {
        await this.user.setuseraddress();
        this.toPageGrey({ duration: 1200 });
        // this.user = user;
        if (this.debug) return;
        this.initApp();
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
        signInButton.style.display = "flex";
      }
    });

    window.addEventListener("load", async () => {
      signInButton.addEventListener("click", this.toggleSignIn, false);
      // signInButton.style.display = "none";

      // Avoid flash blue page
      document.getElementById("signOutButton").addEventListener("click", () => {
        this.signoutgoogle();
      });
      if (linksignout) {
        linksignout.addEventListener("click", (e) => {
          // e.preventDefault();
          this.signoutgoogle();
        });
      }

      btnwaitlistinfosubmit.addEventListener("click", async () => {
        await this.saveUser();
      });

      //load and play the animations
      this.introAnim.animate({ callback: this.checkuser.bind(this) });
    });
    document.fonts.ready.then(() => {
      this.app.classList.remove("preload");
    });
  }
}

new App();
