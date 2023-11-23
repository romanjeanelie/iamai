import isMobile from "../utils/isMobile";
export default class Navbar {
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
      console.log(isMobile());
      if (isMobile()) return;

      this.navList.classList.add("show");
    });
    this.navEl.addEventListener("mouseleave", () => {
      if (isMobile()) return;
      this.navList.classList.remove("show");
    });
  }
}
