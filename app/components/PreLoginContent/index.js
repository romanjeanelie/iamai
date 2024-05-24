import gsap, { Power3 } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default class PreLoginContent {
  constructor() {
    // DOM Elements
    this.loginPage = document.querySelector(".login-page");
    this.introContainer = document.querySelector(".divintroinfo");
    this.container = document.querySelector(".preLoginContent__container");
    this.slider = document.querySelector(".preLoginContent__slider");
    this.slides = this.slider.querySelectorAll(".preLoginContent__slider-card");
    this.gutterRight = document.querySelector(".preLoginContent__right-gutter");
    this.scrollIndicator = document.querySelector(".preLoginContent__scroll-arrow");

    if (import.meta.env.VITE_DEBUG === "true") {
      this.introContainer.style.display = "none";
    }

    // Init methods
    this.handleSliderGutters();
    this.handleScrollIndicatorAnimation();
    this.addEvents();
  }

  handleScrollIndicatorAnimation() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.container,
        scroller: ".login-page",
        start: "top+=10 top",
        toggleActions: "play none play reverse",
      },
    });

    tl.to(this.scrollIndicator, {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.5,
      ease: Power3.easeOut,
    });
  }

  handleClickOnScrollIndicator() {
    const cta = document.querySelector(".preLoginContent__ctas.mobile");
    cta.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  handleSliderGutters() {
    if (window.innerWidth >= 1280) {
      const x = (window.innerWidth - 1232) / 2;
      this.slider.style.paddingLeft = `${x}px`;
    }

    const slideWidth = this.slides[0].offsetWidth;
    const padding = window.innerWidth < 560 ? 0 : (window.innerWidth - slideWidth) / 2;
    this.gutterRight.style.paddingRight = `${padding}px`;
  }

  addEvents() {
    window.addEventListener("resize", this.handleSliderGutters.bind(this));
    this.scrollIndicator.addEventListener("click", this.handleClickOnScrollIndicator.bind(this));

    // we stop the propagation on every touch event to prevent the scroll from being stuck
    // in the fixed positionned login page
    this.loginPage.addEventListener("touchstart", (e) => {
      e.stopPropagation();
    });
    this.loginPage.addEventListener("touchmove", (e) => {
      e.stopPropagation();
    });
    this.loginPage.addEventListener("touchend", (e) => {
      e.stopPropagation();
    });
  }
}