import gsap from "gsap";
import { signOutUser } from "../../User";
import { Flip } from "gsap/Flip";
import { NavigationAnimations } from "./NavigationAnimations";
import ScrollToPlugin from "gsap/ScrollToPlugin";

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

    // State
    this.rootMargin = -100;
    this.currentSection = SECTIONS.discussion; // State to track the current section

    // DOM Elements
    this.app = document.querySelector("#app");
    this.headerNav = document.querySelector(".header-nav");
    this.footerNav = document.querySelector(".footer-nav");
    this.inputEl = document.querySelector(".input__container");
    this.inputWrapper = document.querySelector(".input__wrapper");
    this.historyButton = this.headerNav.querySelector(".header-nav__history-container");
    this.tasksButton = this.footerNav.querySelector(".footer-nav__tasks-container");
    this.pageEl = document.querySelector(".page-discussion");
    this.discussionWrapper = document.querySelector(".discussion__wrapper");
    this.discussionContainer = document.querySelector(".discussion__container");
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
  }

  setUserImage() {
    if (!this.user?.picture) return;
    this.userPicture.src = this.user.picture;
  }

  toggleHistory() {
    if (this.currentSection !== SECTIONS.history) {
      const containerRect = this.historyContainer.getBoundingClientRect();
      const scrollTarget = containerRect.height - window.innerHeight + 202;
      this.pageEl.scrollTo({
        top: scrollTarget,
        behavior: "smooth",
        duration: 5,
      });
    } else {
      this.isHistoryButtonClicked = true;
      this.discussionContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  toggleTasks() {
    if (this.currentSection !== SECTIONS.tasks) {
      this.emitter.emit("Navigation:openTasks");
      gsap.to(this.discussionWrapper, { yPercent: -100 });
      gsap.to(this.tasksContainer, {
        yPercent: 0,
        duration: 0.5,
        ease: "power3.inOut",
      });
      this.inputEl.classList.add("hidden");
    } else {
      this.emitter.emit("Navigation:closeTasks");
      gsap.to(this.discussionWrapper, { yPercent: 0 });
      gsap.to(this.tasksContainer, {
        yPercent: 100,
        duration: 0.5,
        ease: "power3.inOut",
      });
      this.inputEl.classList.remove("hidden");
    }
  }

  updateNavButtons() {
    // in the navigation scss file, when the parent class is changed, the animation will trigger
    // animation = oppositin navButton disappears and currentSection chevron rotates
    const initialState = Flip.getState([this.tasksButton, this.inputWrapper]);

    this.app.className = this.currentSection;

    Flip.from(initialState, {
      duration: 0.4,
      ease: "power3.out",
    });
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      threshold: 0,
      rootMargin: "-100px",
    };

    const observer = new IntersectionObserver((entries) => {
      let intersectingSections = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target.id);

      if (intersectingSections.length === 0) {
        this.currentSection = SECTIONS.discussion;
      } else {
        this.currentSection = intersectingSections[0];
      }

      this.updateNavButtons();
    }, options);

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
    this.setupIntersectionObserver();
    this.userPicture.addEventListener("click", signOutUser);
    this.historyButton.addEventListener("click", this.toggleHistory.bind(this));
    this.tasksButton.addEventListener("click", this.toggleTasks.bind(this));

    this.emitter.on("app:initialized", () => {
      this.anims.showNav();
    });

    this.emitter.on("input:updateImages", this.hideNavButtons.bind(this));
    this.emitter.on("input:imagesQuestionAsked", this.displayNavButtons.bind(this));
  }
}
