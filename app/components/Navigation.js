import { signOutUser } from "../User";

const SECTIONS = {
  history: "history",
  tasks: "tasks",
  discussion: "discussion",
};

export default class Navigation {
  constructor({ user }) {
    this.user = user;
    this.debug = import.meta.env.VITE_DEBUG === "true";

    // State
    this.rootMargin = -100;
    this.currentSection = SECTIONS.discussion; // State to track the current section

    // DOM Elements
    this.app = document.querySelector("#app");
    this.headerNav = document.querySelector(".header-nav");
    this.footerNav = document.querySelector(".footer-nav");

    this.historyButton = this.headerNav.querySelector(".header-nav__history-container");
    this.tasksButton = this.footerNav.querySelector(".footer-nav__tasks-container");

    this.historyContainer = document.querySelector(".history__container");
    this.userPicture = this.headerNav.querySelector(".user-logo img");

    // Init Methods
    this.addListeners();
    this.setUserImage();
  }

  setUserImage() {
    if (!this.user?.picture) return;
    this.userPicture.src = this.user.picture;
  }

  scrollToHistory() {
    const containerRect = this.historyContainer.getBoundingClientRect();
    const scrollTarget = containerRect.height - window.innerHeight + 202;
    window.scrollTo({
      top: scrollTarget,
      behavior: "smooth",
    });
  }

  updateNavButtons() {
    // in the navigation scss file, when the parent class is changed, the animation will trigger
    // animation = oppositin navButton disappears and currentSection chevron rotates
    this.app.className = this.currentSection;
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

  addListeners() {
    this.setupIntersectionObserver();
    this.userPicture.addEventListener("click", signOutUser);
    this.historyButton.addEventListener("click", this.scrollToHistory.bind(this));
  }
}
