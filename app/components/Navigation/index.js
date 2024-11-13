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
      // this.toggleTasks();
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
      this.discussionContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  toggleTasks() {
    if (this.currentSection !== SECTIONS.tasks) {
      this.emitter.emit("Navigation:openTasks");
      gsap.to(this.discussionWrapper, { yPercent: -100 });
      gsap.to(this.tasksContainer, {
        yPercent: 0,
        duration: 1,
        ease: Power3.easeOut,
        onComplete: () => {
          this.isTasksInMotion = false;
        },
      });
      this.inputEl.classList.add("hidden");
    } else {
      this.emitter.emit("Navigation:closeTasks");
      gsap.to(this.discussionWrapper, { yPercent: 0 });
      gsap.to(this.tasksContainer, {
        yPercent: 100,
        duration: 1,
        ease: Power3.easeOut,
        onComplete: () => {
          this.isTasksInMotion = false;
        },
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

        if (intersectingSections.length === 0) {
          this.currentSection = SECTIONS.discussion;
        } else {
          this.currentSection = intersectingSections[0];
        }

        if (this.currentSection !== SECTIONS.history) {
          this.scrollHistoryToTop();
        }

        this.updateNavButtons();
      }, 250),
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
    // Scroll Events
    this.pageEl.addEventListener("touchstart", (e) => {
      if (this.currentSection !== SECTIONS.discussion) return;
      this.touchStartY = e.targetTouches[0].screenY;
    });

    this.pageEl.addEventListener("touchmove", (e) => {
      if (this.currentSection !== SECTIONS.discussion) return;
      this.touchCurrentY = e.targetTouches[0].screenY;

      let changeY = this.touchCurrentY < this.touchStartY ? Math.abs(this.touchCurrentY - this.touchStartY) : 0;

      if (changeY >= 50) {
        if (this.isTasksInMotion) return;
        this.isTasksInMotion = true;
        gsap.to(this.discussionContainer, {
          yPercent: -100,
          duration: 0.5,
          ease: Power3.easeOut,
          onComplete: this.toggleTasks.bind(this),
        });
      }
    });

    this.pageEl.addEventListener("touchend", (e) => {
      // if (this.currentSection !== SECTIONS.discussion) return;
      this.pageEl.style.paddingBottom = "0";
      this.footerNav.style.paddingBottom = "0";
    });

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
    this.emitter.on("input:imagesQuestionAsked", this.displayNavButtons.bind(this));
  }
}
