import gsap, { Power2, Power3 } from "gsap";

import animateString from "../utils/animateString";

export class IntroAnimation {
  constructor() {
    this.loginPage = document.querySelector(".login-page");
    this.preLoginContent = document.querySelector(".divlogin");
    this.introContainer = document.querySelector(".divintroinfo");
    this.introText = document.querySelector(".divintrotext");
    this.introLogo = document.querySelector(".divintrologo");
    // slider cards
    this.redCard = document.querySelector(".preLoginContent__slider-content.redCard");
    this.apesCard = document.querySelector(".preLoginContent__slider-content.apesCard");
    this.clockCard = document.querySelector(".preLoginContent__slider-content.clockCard");

    // for debug :
    // this.introContainer.style.display = "none";

    this.animateCards();
    this.addEventListeners();
    // this.blockBodyScrollWhenLoginPageOnScreen();
  }

  animate({ callback }) {
    animateString(0, ["Hello."], this.introText, "", () => {
      this.introText.style.display = "none";
      this.introLogo.style.display = "block";
      const logoP = this.introLogo.querySelector("p");
      const logo = this.introLogo.querySelector(".co-logo");
      gsap.set(logo, {
        opacity: 0,
      });
      gsap.set(this.preLoginContent, { y: "100vh" });

      const tl = gsap.timeline({
        defaults: {
          ease: Power3.easeOut,
        },
      });
      tl.to(logoP, {
        backgroundPosition: "0% 0%",
        ease: Power3.easeIn,
        duration: 1,
      });
      tl.to(logo, {
        opacity: 1,
        duration: 1,
      });
      tl.to(this.introContainer, {
        yPercent: -100,
        duration: 1.2,
      });
      tl.to(
        this.preLoginContent,
        {
          y: 0,
          duration: 1.2,
        },
        "<"
      );
    });
  }

  animateRedCard() {
    // red card texts
    const realMadrid = this.redCard.querySelector(".real-madrid");
    const netflix = this.redCard.querySelector(".netflix");
    const musk = this.redCard.querySelector(".musk");
    const mozza = this.redCard.querySelector(".mozza");
    const redDelay = 0.7;

    gsap.set([realMadrid, netflix, musk, mozza], {
      opacity: 0,
    });

    const redCardTl = gsap.timeline({
      repeat: -1,
      defaults: {
        ease: Power3.easeOut,
        duration: 0.6,
      },
    });

    redCardTl.fromTo(
      realMadrid,
      { x: -50 },
      {
        x: 0,
        opacity: 1,
      }
    );
    redCardTl.to(
      realMadrid,
      {
        x: 50,
        opacity: 0,
      },
      `+=${redDelay}`
    );
    redCardTl.fromTo(netflix, { x: -50 }, { x: 0, opacity: 1 }), "<";
    redCardTl.to(netflix, { x: -50, opacity: 0 }, `+=${redDelay}`);
    redCardTl.fromTo(musk, { x: 50 }, { x: 0, opacity: 1 }), "<";
    redCardTl.to(musk, { y: -50, opacity: 0 }, `+=${redDelay}`);
    redCardTl.fromTo(mozza, { y: 50 }, { y: 0, opacity: 1 }), "<";
    redCardTl.to(mozza, { x: 50, opacity: 0 }, `+=${redDelay}`);
  }

  animateApesCard() {
    const text = this.apesCard.querySelector("h4");
    const spans = gsap.utils.toArray(text.querySelectorAll("span"));

    gsap.set(spans, {
      opacity: 0,
    });

    const tl = gsap.timeline({
      repeat: -1,
      defaults: {
        duration: 1,
        ease: Power2.easeIn,
      },
    });

    tl.to(spans, {
      opacity: 1,
      stagger: 0.9,
    });

    tl.to(spans, {
      opacity: 0,
    });
  }

  animateClockCard() {
    const texts = this.clockCard.querySelectorAll("h4");
    gsap.set(texts, {
      opacity: 0,
      y: 50,
    });

    const tl = gsap.timeline({
      repeat: -1,
      defaults: {
        duration: 1,
      },
    });

    texts.forEach((text, idx) => {
      tl.to(text, {
        opacity: 1,
        y: 0,
        ease: Power3.easeOut,
      });
      tl.to(
        text,
        {
          opacity: 0,
          y: 50,
          ease: Power3.easeIn,
        },
        "+=1"
      );
    });
  }

  animateCards() {
    this.animateRedCard();
    this.animateApesCard();
    this.animateClockCard();
  }

  // we stop the propagation on every touch event to prevent the scroll from being stuck
  // in the fixed positionned login page
  addEventListeners() {
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
