import gsap, { Power3 } from "gsap";

const toggleActions = "play none play reverse";

// ---- anim B : Cascading (staggered) Fade in text ----
export function cascadingFadeInText(elements) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: Array.isArray(elements) ? elements[0] : elements,
      start: "top 75%",
      toggleActions,
    },
  });

  tl.fromTo(elements, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.2, ease: Power3.easeOut });
}

// ---- anim C - Gradient text animation ----
export function gradientAnimation() {
  const gradientText = document.querySelector(".blog__footer .gradient-wrapper");
  gsap.to(gradientText, {
    scrollTrigger: {
      trigger: gradientText,
      start: "top 75%",
      end: "bottom top",
      toggleActions,
    },
    backgroundPosition: "100% 100%",
    duration: 1.5,
    ease: Power3.easeOut,
  });
}

// ---- anim D - Black block Animation ----
export function blackBlockAnimation(introduction, logo, footer) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: introduction, start: "top 55%", toggleActions },
    defaults: { duration: 0.7, ease: Power3.easeOut },
  });

  tl.fromTo(
    introduction,
    { y: 25, opacity: 0 },
    {
      y: 0,
      opacity: 1,
    }
  );

  tl.fromTo(
    logo,
    { scale: 0.9, opacity: 0.8 },
    {
      scale: 1,
      opacity: 1,
    },
    "<0.2"
  );

  gsap.fromTo(
    footer,
    { y: 25, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      ease: Power3.easeOut,
      duration: 1,
      scrollTrigger: { trigger: footer, toggleActions, start: "top 75%" },
    }
  );
}

// ---- anim D : Footer animation ----
export function slidesUp(container) {
  const h1 = container.querySelector("h1");

  gsap.fromTo(
    h1,
    { y: "20vh", opacity: 0 },
    {
      y: 0,
      opacity: 1,
      ease: Power3.easeOut,
      duration: 0.7,
      scrollTrigger: {
        trigger: container,
        toggleActions,
        start: "top 25%",
      },
    }
  );
}

export function footerAnimation(container) {
  const h1 = container.querySelector("h1");
  const cta = container.querySelector("a");
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top 25%",
      toggleActions,
    },
  });

  tl.fromTo(
    h1,
    { y: "20vh", opacity: 0 },
    {
      y: 0,
      opacity: 1,
      ease: Power3.easeOut,
      duration: 0.7,
    }
  );

  tl.fromTo(
    cta,
    { opacity: 0 },
    {
      opacity: 1,
      ease: Power3.easeOut,
      duration: 0.7,
    },
    "-=0.2"
  );
}

// ---- anim E - Staircase Animation ----
export function staircaseAnimation(elements) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: elements[0],
      start: "top bottom",
      toggleActions,
    },
  });

  tl.fromTo(
    elements,
    {
      y: "20vh",
    },
    {
      y: 0,
      duration: 0.5,
      stagger: 0.2,
      ease: Power3.easeOut,
    }
  );
}
