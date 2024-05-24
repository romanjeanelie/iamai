import gsap, { Power2, Power3 } from "gsap";

export class IntroAnimation {
  constructor() {
    // DOM Elements
    this.redCard = document.querySelector(".preLoginContent__slider-content.redCard");
    this.apesCard = document.querySelector(".preLoginContent__slider-content.apesCard");
    this.clockCard = document.querySelector(".preLoginContent__slider-content.clockCard");
    this.helloCard = document.querySelector(".preLoginContent__slider-content.helloCard");

    // Init methods
    this.animateCards();
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
    const overlay = this.clockCard.querySelector(".overlay");
    gsap.set(texts, {
      opacity: 0,
      y: 50,
    });

    const tl = gsap.timeline({
      repeat: -1,
      defaults: {
        duration: 1,
        ease: Power3.easeOut,
      },
    });

    texts.forEach((text, idx) => {
      const isFourLineText = text.offsetHeight >= 100;
      tl.to(text, {
        opacity: 1,
        y: 0,
      });
      tl.to(
        overlay,
        {
          scaleY: isFourLineText ? 1.3 : 1,
        },
        "<"
      );
      tl.to(
        text,
        {
          opacity: 0,
          y: 50,
          ease: Power3.easeIn,
        },
        "+=1.5"
      );
      tl.to(
        overlay,
        {
          scaleY: 1,
          ease: Power3.easeIn,
        },
        "<"
      );
    });
  }

  animateHelloCard() {
    const words = this.helloCard.querySelectorAll("p");
    const tl = gsap.timeline({
      repeat: -1,
      defaults: {
        ease: Power3.easeOut,
      },
    });

    words.forEach((word, idx) => {
      tl.set(word, {
        opacity: 1,
        backgroundPosition: "100% 100%",
      });
      tl.to(word, {
        backgroundPosition: "0% 0%",
        duration: 1.6,
      });
      tl.to(
        word,
        {
          opacity: 0,
          duration: 0.6,
        },
        "+=0.8"
      );
    });
  }

  animateCards() {
    this.animateRedCard();
    this.animateApesCard();
    this.animateClockCard();
    this.animateHelloCard();
  }
}
