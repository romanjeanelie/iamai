import gsap, { Power3 } from "gsap";

// ---- anim B : Cascading (staggered) Fade in text ----
export function cascadingFadeInText(elements) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: Array.isArray(elements) ? elements[0] : elements,
      start: "top 75%",
    },
  });

  tl.fromTo(elements, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: Power3.easeOut });
}

// ---- anim C - Gradient text animation ----

// ---- anim D - Black block Animation ----
export function blackBlockAnimation(introduction, logo, footer) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: introduction, start: "top 55%" },
    defaults: { duration: 1, ease: Power3.easeOut },
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
      scrollTrigger: { trigger: footer, start: "top 75%" },
    }
  );
}

// ---- anim D : Footer animation ----
export function slidesUp(elements) {
  gsap.fromTo(
    elements,
    { yPercent: 100, opacity: 0.5 },
    {
      yPercent: 0,
      opacity: 1,
      ease: Power3.easeOut,
      duration: 1,
      scrollTrigger: { trigger: elements, start: "top bottom" },
    }
  );
}

// ---- anim E - Staircase Animation ----
export function staircaseAnimation(elements) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: elements[0],
      start: "top bottom",
    },
  });

  tl.fromTo(
    elements,
    {
      y: "50vh",
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: Power3.easeOut,
    }
  );
}
