import animateString from "../utils/animateString";
import gsap from "gsap";

export class IntroAnimation {
  constructor() {
    this.introContainer = document.querySelector(".divintroinfo");
    this.introText = document.querySelector(".divintrotext");
    this.introLogo = document.querySelector(".divintrologo");

    // this.animate();
    this.introLogo.style.display = "block";
    this.introText.style.display = "none";
  }

  animate() {
    animateString(0, ["Hello."], this.introText, "", () => {
      this.introText.style.display = "none";
      this.introLogo.style.display = "block";
    });
  }
}
