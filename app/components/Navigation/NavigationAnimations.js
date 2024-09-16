import gsap, { Power3 } from "gsap";

export class NavigationAnimations {
  constructor() {
    // DOM ELEMENTS
    this.headerNav = document.querySelector(".header-nav");
    this.footerNav = document.querySelector(".footer-nav");

    // Init Methods
    this.initializeNavHidden();
  }

  initializeNavHidden() {
    gsap.set(this.headerNav, { opacity: 0, yPercent: -100 });
    gsap.set(this.footerNav, { opacity: 0, yPercent: 100 });
  }

  showNav() {
    const tl = gsap.timeline({ defaults: { duration: 0.3, delay: 0.2, ease: Power3.easeOut } });
    tl.to(this.headerNav, { opacity: 1, yPercent: 0, duration: 0.5 });
    tl.to(this.footerNav, { opacity: 1, yPercent: 0, duration: 0.5 }, "<+=0.1");
  }
}
