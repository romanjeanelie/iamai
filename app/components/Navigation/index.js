import gsap, { Power3 } from "gsap";
import { signOutUser } from "../../User";
import { Flip } from "gsap/Flip";
import { NavigationAnimations } from "./NavigationAnimations";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { debounce } from "../../utils/debounce";

const SECTIONS = {
  history: "history",
  tasks: "tasks",
  discussion: "discussion",
  uploadImages: "upload-images",
};

gsap.registerPlugin(ScrollToPlugin);

export default class Navigation {
  constructor({ user, emitter }) {
    this.user = user;
    this.emitter = emitter;
    this.debug = import.meta.env.VITE_DEBUG === "true";
    this.debugVideo = import.meta.env.VITE_DEBUG_VIDEO === "true";

    // State
    this.rootMargin = -100;
    this.currentSection = SECTIONS.discussion; // State to track the current section
    this.touchStartY = 0;
    this.touchCurrentY = 0;

    // DOM Elements
    this.app = document.querySelector("#app");
    this.headerNav = document.querySelector(".header-nav");
    this.footerNav = document.querySelector(".footer-nav");
    this.inputEl = document.querySelector(".input__container");
    this.inputWrapper = document.querySelector(".input__wrapper");
    this.historyButton = this.headerNav.querySelector(".header-nav__history-container");
    this.tasksButton = this.footerNav.querySelector(".footer-nav__tasks-container");

    this.pageEl = document.querySelector(".page-discussion");
    this.discussionWrapper = document.querySelector("#discussion");
    this.historyContainer = document.querySelector(".history__container");
    this.tasksContainer = document.querySelector(".task-manager__container");
    this.userPicture = this.headerNav.querySelector(".user-logo img");

    // Init Methods
    this.addListeners();
    this.setUserImage();
    this.anims = new NavigationAnimations();

    if (this.debug) {
      this.toggleTasks();
    }
    if (this.debugVideo) {
      this.historyButton.style.display = "none";
      this.userPicture.style.display = "none";
    }
  }

  setUserImage() {
    if (!this.user?.picture) return;
    this.userPicture.src = this.user.picture;
  }

  toggleHistory() {
    if (this.currentSection !== SECTIONS.history) {
      gsap.to(this.pageEl, { scrollTo: 0, duration: 0.5, ease: Power3.easeOut });
    } else {
      this.isHistoryButtonClicked = true;
      this.discussionWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  toggleTasks() {
    console.log("TOGGLE TASKS");
    if (this.currentSection !== SECTIONS.tasks) {
      this.tasksContainer.classList.add("scroll-snap");
      gsap.to(this.pageEl, { scrollTo: ".task-manager__container", duration: 0.5, ease: Power3.easeOut });
    } else {
      this.pageEl.style.scrollSnapType = "none";
      gsap.to(this.pageEl, {
        scrollTo: ".main-content__container",
        duration: 0.5,
        ease: Power3.easeOut,
        onComplete: () => {
          this.pageEl.style.scrollSnapType = "y mandatory";
        },
      });
      this.tasksContainer.classList.remove("scroll-snap");
    }
  }

  updateNavButtons() {
    // in the navigation scss file, when the parent class is changed, the animation will trigger
    // animation = opposit navButton disappears and currentSection chevron rotates
    const initialState = Flip.getState([this.tasksButton, this.inputWrapper]);

    this.app.className = this.currentSection;

    Flip.from(initialState, {
      duration: 0.4,
      ease: "power3.out",
    });
  }

  scrollHistoryToTop() {
    this.historyContainer.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      threshold: 0,
      rootMargin: "-100px",
    };

    const observer = new IntersectionObserver(
      debounce((entries) => {
        let intersectingSections = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target.id);
        const prevSection = this.currentSection;

        if (intersectingSections.length === 0) {
          this.currentSection = SECTIONS.discussion;
          this.tasksContainer.classList.remove("scroll-snap");
        } else {
          this.currentSection = intersectingSections[0];
        }

        if (this.currentSection !== SECTIONS.history) {
          this.scrollHistoryToTop();
        }

        this.updateNavButtons();
      }, 500),
      options
    );

    // Observe the sections
    [SECTIONS.history, SECTIONS.tasks].forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      observer.observe(section);
    });
  }

  displayNavButtons() {
    this.currentSection = SECTIONS.discussion;
    this.updateNavButtons();
  }

  hideNavButtons() {
    this.currentSection = SECTIONS.uploadImages;
    this.updateNavButtons();
  }

  addListeners() {
    // Intersection Observer
    this.setupIntersectionObserver();

    // Buttons
    this.userPicture.addEventListener("click", signOutUser);
    this.historyButton.addEventListener("click", this.toggleHistory.bind(this));
    this.tasksButton.addEventListener("click", this.toggleTasks.bind(this));

    // Emitter
    this.emitter.on("app:initialized", () => {
      this.anims.showNav();
    });
    this.emitter.on("input:updateImages", this.hideNavButtons.bind(this));
    this.emitter.on("phone:open", this.hideNavButtons.bind(this));

    this.emitter.on("phone:close", this.displayNavButtons.bind(this));
    this.emitter.on("input:imagesQuestionAsked", this.displayNavButtons.bind(this));
  }
}
