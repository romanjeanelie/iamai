import gsap, { Power3 } from "gsap";
import animateString from "../utils/animateString";

export class IntroAnimation {
  constructor() {
    this.introContainer = document.querySelector(".divintroinfo");
    this.introText = document.querySelector(".divintrotext");
    this.introLogo = document.querySelector(".divintrologo");
  }

  animate() {
    animateString(0, ["Hello."], this.introText, "", () => {
      this.introText.style.display = "none";
      this.introLogo.style.display = "block";
      const logoP = this.introLogo.querySelector("p");
      const logo = this.introLogo.querySelector(".co-logo");
      gsap.set([logoP, logo], {
        opacity: 0,
      });
      const tl = gsap.timeline({
        defaults: {
          ease: Power3.easeOut,
        },
      });
      tl.to(logoP, {
        opacity: 0.6,
      });
      tl.to(logo, {
        opacity: 1,
        duration: 1,
      });
      tl.to(this.introContainer, {
        yPercent: -100,
        duration: 0.7,
        ease: Power3.easeIn,
      });
    });
  }
}
