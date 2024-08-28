import gsap from "gsap";
import getMarked from "./getMarked";

export default function fadeByWord(container, text, timeout = 10) {
  let answerSpan = document.createElement("span");
  answerSpan.className = "AIanswer";
  container.appendChild(answerSpan);

  const md = getMarked();

  return new Promise((resolve) => {
    let words = text.split(" ");
    let content = words.map((word) => `<span class="AIword">${word}</span>`).join(" ");

    const markdownOutput = md.parseInline(content);
    answerSpan.innerHTML = markdownOutput;

    gsap.fromTo(
      answerSpan.querySelectorAll(".AIword"),
      { opacity: 0, filter: "blur(1px)" },
      {
        filter: "blur(0px)",
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power1.in",
        onComplete: resolve,
      }
    );
  });
}
