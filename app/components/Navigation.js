import { signOutUser } from "../User";

export default class Navigation {
  constructor({ user }) {
    this.user = user;

    this.headerNav = document.querySelector(".header-nav");
    this.footerNav = document.querySelector(".footer-nav");
    this.historyButton = this.headerNav.querySelector(".header-nav__history-container");
    this.tasksButton = this.footerNav.querySelector(".footer-nav__tasks-container");

    this.historyContainer = document.querySelector(".history__container");

    this.userPicture = this.headerNav.querySelector(".user-logo img");

    this.currentSection = null; // State to track the current section

    this.addListeners();
    this.setUserImage();
  }

  setUserImage() {
    if (!this.user.picture) return;
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

  updateButtonVisibility() {
    [this.tasksButton, this.historyButton].forEach((button) => {
      button.classList.remove("hidden");
    });

    // if the currentSection is the one affiliated to the button, hide it
    if (this.currentSection === "tasks") {
      this.tasksButton.classList.add("hidden");
    } else if (this.currentSection === "history") {
      this.historyButton.classList.add("hidden");
    }
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: "-200px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.currentSection = entry.target.id;

          this.updateButtonVisibility();
        }
      });
    }, options);

    // Observe the sections
    ["history", "discussion", "tasks"].forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
      }
    });
  }

  addListeners() {
    this.setupIntersectionObserver();

    this.userPicture.addEventListener("click", signOutUser);
    this.historyButton.addEventListener("click", this.scrollToHistory.bind(this));
  }
}
