import gsap, { Power3 } from "gsap";

export function cascadingFadeInText(elements) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: Array.isArray(elements) ? elements[0] : elements,
      start: "top 75%",
    },
  });

  tl.fromTo(elements, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: Power3.easeOut });
}

export function blackBlockAnimation(introduction, logo, footer) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: introduction, markers: true, start: "top 55%" },
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
