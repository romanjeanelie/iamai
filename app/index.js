import * as dat from "dat.gui";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { createNanoEvents } from "nanoevents";
import User, { getUser, getUserDataFireDB, redirectToLogin, saveUserDataFireDB } from "./User";
import Caroussel from "./components/Caroussel";
import Discussion from "./components/Discussion";
import Input from "./components/Input";
import Navbar from "./components/Navbar";
import Slider from "./components/Slider";
import TaskManager from "./components/TaskManager";
import { auth } from "./firebaseConfig";
import stopOverscroll from "./utils/stopOverscroll";

var animation;
const divintrotext = document.getElementById("divintrotext");
const divintrologo = document.getElementById("divintrologo");

const divlogin = document.getElementById("divlogin");
const divinfotext = document.getElementById("divinfotext");

const divwaitlist = document.getElementById("divwaitlist");
const divlottieanimation = document.getElementById("divlottieanimation");

const linksignout = document.getElementById("linksignout");
const signInButton = document.getElementById("divgoogle");

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
    this.addListeners();
    this.resetScroll();
    stopOverscroll();

    if (this.debug) {
      this.gui = new dat.GUI();
      this.toPageGrey({ duration: 0 });
      this.initApp();
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

  animateString = (
    index,
    textArray,
    element,
    imgSrc = "",
    callback,
    delay = 150,
    deletedelay = 50,
    fulltextdelay = 1000
  ) => {
    if (!element) return; // Element not found

    let str = textArray[index++];
    let i = 0;
    let isAdding = true;

    function createImageElement() {
      const img = document.createElement("img");
      img.src = imgSrc;
      return img;
    }

    function updateText() {
      if (isAdding) {
        element.textContent += str[i++];
        if (i === str.length) {
          isAdding = false;
          if (imgSrc && imgSrc.length > 0) {
            setTimeout(delay);
            const img = createImageElement();
            img.alt = str[i];
            element.appendChild(img);
          }
          // else {
          setTimeout(updateText, fulltextdelay);
          // }
        } else {
          setTimeout(updateText, delay);
        }
      } else {
        element.textContent = element.textContent.slice(0, -1);
        if (element.textContent.length > 0) {
          setTimeout(updateText, deletedelay);
        } else if (callback) {
          callback(textArray, index, element, imgSrc);
        }
      }
    }
    updateText();
  };

  startAnimations(textArray, element) {
    let index = 0;
    this.next(textArray, index, element, "");
  }

  next = (textArray, index, element, imgSrc = "") => {
    if (index < textArray.length) {
      this.animateString(index, textArray, element, imgSrc, this.next, 50, 1, 1600);
    } else {
      index = 0;
      this.animateString(index, textArray, element, imgSrc, this.next, 50, 1, 1600);
    }
  };

  toggleSignIn() {
    signInButton.style.display = "none";
    divlottieanimation.style.display = "block";
    animation.play();
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
          signInButton.style.display = "block";
          divlottieanimation.style.display = "none";
          animation.stop();
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
    var userstatus = await getUserDataFireDB(user);
    if (userstatus) {
      if (userstatus.status == "active") {
        await user.setuseraddress();
        this.toPageGrey({ duration: 1200 });
        this.user = user;
        console.log("user", user);
        if (this.debug) return;
        this.initApp();
      } else {
        divlogin.style.display = "none";
        divwaitlist.style.display = "flex";
      }
    } else {
      await saveUserDataFireDB(user);
      divlogin.style.display = "none";
      divwaitlist.style.display = "flex";
    }
  }
  addListeners() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const loggedinuser = new User(user.uid, user.displayName, user.photoURL, user.email);
        this.checkuserwaitlist(loggedinuser);
      } else {
        signInButton.style.display = "flex";
      }
    });

    window.addEventListener("load", async () => {
      let user = await getUser();

      if (user) {
        this.checkuserwaitlist(user);
        divlottieanimation.style.display = "block";
        signInButton.style.display = "none";
      } else {
        divlottieanimation.style.display = "none";
      }
      animation = lottie.loadAnimation({
        container: divlottieanimation,
        renderer: "svg",
        loop: true,
        autoplay: false,
        path: "../animations/asterisk_loading.json",
      });
      animation.play();

      signInButton.addEventListener("click", this.toggleSignIn, false);
      // signInButton.style.display = "none";

      // Avoid flash blue page
      document.getElementById("signOutButton").addEventListener("click", () => {
        this.signoutgoogle();
      });
      linksignout.addEventListener("click", (e) => {
        // e.preventDefault();
        this.signoutgoogle();
      });

      //load and play the animations
      divwaitlist.style.display = "none";
      divlogin.style.display = "none";
      // animateString("hello, I am", divintrotext, "", function () {
      divintrotext.style.display = "none";
      // animateString("Asterizk ", divintrologo, "../images/asterizk.svg", function () {
      divintrologo.style.display = "none";
      divlogin.style.display = "flex";
      const texts = [
        "Find a flight to Bali",
        "Get a taxi to office",
        "Book a Hotel",
        "Tell me joke",
        "What are the movies playing",
      ];
      this.startAnimations(texts, divinfotext);
    });
    document.fonts.ready.then(() => {
      this.app.classList.remove("preload");
    });
  }
}

new App();
