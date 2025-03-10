import gsap, { Power3 } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default class HistoryAnimation {
  constructor({ emitter }) {
    this.emitter = emitter;
    this.discussionWrapper = document.querySelector(".page-discussion");
    this.container = document.querySelector(".history__container");
    this.dates = document.querySelectorAll(".history__date");
    this.elements = document.querySelectorAll(".history-element__wrapper");

    // InitAnimations is triggered in the history component, after the history elements are created
  }

  initAnimations() {
    this.elements = document.querySelectorAll(".history-element__wrapper");
    gsap.set(this.elements, { opacity: 0, y: 50 });

    ScrollTrigger.create({
      trigger: this.container,
      scroller: this.discussionWrapper,
      start: "top center",
      end: "bottom-=49% center",
      invalidateOnRefresh: true, // Ensures correct positioning on resize

      onLeave: () => {
        this.hideElements();
      },
      onEnterBack: () => {
        this.showElements();
      },
    });
  }

  showElements() {
    this.elements = document.querySelectorAll(".history-element__wrapper");
    const tl = gsap.timeline({ default: { duration: 0.4, ease: Power3.easeOut } });

    gsap.fromTo(
      this.elements,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        delay: 0.4,
        stagger: 0.05,
      }
    );
  }

  hideElements() {
    gsap.to(this.elements, { opacity: 0, y: 50, duration: 0.05, stagger: 0.05, ease: Power3.easeOut });
  }
}
