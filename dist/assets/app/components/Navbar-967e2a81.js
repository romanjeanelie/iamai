import isMobile from "../utils/isMobile-f8de8c05.js";
class Navbar {
  constructor() {
    this.navEl = document.querySelector(".nav");
    this.navBtn = this.navEl.querySelector(".nav__btn");
    this.navList = this.navEl.querySelector(".nav__list");
    this.addListeners();
  }
  addListeners() {
    this.navBtn.addEventListener("click", () => {
      this.navList.classList.toggle("show");
    });
    this.navEl.addEventListener("mouseenter", () => {
      if (isMobile())
        return;
      this.navList.classList.add("show");
    });
    this.navEl.addEventListener("mouseleave", () => {
      if (isMobile())
        return;
      this.navList.classList.remove("show");
    });
  }
}
export {
  Navbar as default
};
