import { calculate, split } from "../utils/text-43126ad4.js";
import { sortArrayFromMiddleToEnds } from "../utils/sortArrayFromMiddleToEnds-f167eb8d.js";
import anim from "../utils/anim-54bd80a9.js";
import { backgroundColorBluePage, colorMain } from "../../scss/variables/_colors.module.scss-f9d2d4d4.js";
const texts = [
  "Book me a flight from Singapore to Kuala Lumpur on  flight from Singapore to Kuala Lumpur",
  "Book me a flight from Paris to Kuala Lumpur on  flight from Singapore to Kuala Lumpur",
  "Book me a flight from London to Kuala Lumpur on  flight from Singapore to Kuala Lumpur"
];
function animMask(mask, translateXValue, isShow) {
  const transformStart = isShow ? "translateX(0%)" : `translateX(${translateXValue})`;
  const transformEnd = isShow ? `translateX(${translateXValue})` : "translateX(0%)";
  return anim(
    mask,
    [
      { color: backgroundColorBluePage, transform: transformStart, offset: 0 },
      { color: colorMain, offset: 0.5 },
      { color: colorMain, offset: 0.95 },
      { color: backgroundColorBluePage, transform: transformEnd, offset: 1 },
      { opacity: 1 }
    ],
    {
      duration: 500,
      fill: "forwards",
      ease: "ease-in-out"
    }
  );
}
class Caroussel {
  constructor() {
    this.carousselEl = document.querySelector(".caroussel__container");
    this.carousselTextEl = this.carousselEl.querySelector(".caroussel__text");
    this.nextBtn = this.carousselEl.querySelector("#btn-next");
    this.prevBtn = this.carousselEl.querySelector("#btn-prev");
    this.markerEl = this.carousselEl.querySelector(".caroussel__markers");
  }
  init() {
    this.currentIndex = 0;
    this.startAnimIndex = 0;
    this.isComplete = false;
    this.addText();
    this.createMarkers();
    this.updateButtons();
    this.createLines();
    this.addListeners();
    this.showLines();
  }
  createMarkers() {
    for (let i = 0; i < texts.length; i++) {
      let marker = document.createElement("span");
      marker.classList.add("marker");
      if (i === this.currentIndex) {
        marker.classList.add("active");
      }
      this.markerEl.appendChild(marker);
    }
  }
  addText() {
    this.carousselTextEl.innerHTML = "";
    this.carousselTextEl.textContent = texts[this.currentIndex];
  }
  createLines() {
    this.splitLines = calculate(split({ element: this.carousselTextEl }));
    this.nbLines = this.splitLines.length;
    this.middleLineIndex = this.nbLines % 2 === 1 ? Math.floor(this.nbLines / 2) : null;
    this.carousselTextEl.innerHTML = "";
    this.linesEls = this.getLines(this.splitLines);
    this.linesSorted = sortArrayFromMiddleToEnds(this.linesEls);
    this.addClasses();
    this.addMasks();
  }
  getLines(splitLines) {
    return splitLines.map((line, i) => {
      const lineContent = line.map((word) => word.outerHTML).join(" ");
      const lineEl = document.createElement("div");
      lineEl.innerHTML = lineContent;
      this.carousselTextEl.appendChild(lineEl);
      return lineEl;
    });
  }
  addClasses() {
    this.linesEls.forEach((line, i) => {
      if (this.middleLineIndex !== null && i === this.middleLineIndex) {
        line.classList.add("caroussel__line--middle");
      } else {
        const isEven = (i - this.middleLineIndex) % 2 === 0;
        const className = isEven ? "caroussel__line--even" : "caroussel__line--odd";
        line.classList.add("caroussel__line");
        line.classList.add(className);
      }
    });
  }
  addMasks() {
    for (let i = 0; i < this.linesSorted.length; ) {
      const line = this.linesSorted[i];
      if (line.classList.contains("caroussel__line--middle")) {
        const maskL = document.createElement("span");
        const maskR = document.createElement("span");
        maskL.classList.add("mask", "mask-left");
        maskR.classList.add("mask", "mask-right");
        maskL.textContent = "/";
        maskR.textContent = "/";
        line.appendChild(maskL);
        line.appendChild(maskR);
        i++;
      } else {
        const line1 = this.linesSorted[i];
        const line2 = this.linesSorted[i + 1];
        const maskL = document.createElement("span");
        const maskR = document.createElement("span");
        maskL.classList.add("mask", "mask-left");
        maskR.classList.add("mask", "mask-right");
        maskL.textContent = "/";
        maskR.textContent = "/";
        line2.appendChild(maskL);
        line1.appendChild(maskR);
        i += 2;
      }
    }
  }
  onHideComplete() {
    if (this.isComplete)
      return;
    this.isComplete = true;
    this.carousselTextEl.style.opacity = 0;
    this.addText();
    this.createLines();
    this.carousselTextEl.style.opacity = 1;
    this.updateMarkers();
    this.animLines(true);
  }
  onShowComplete() {
    this.startAnimIndex = 0;
    this.isAnimating = false;
  }
  animLines(isShow) {
    if (this.startAnimIndex > this.nbLines - 1) {
      this.startAnimIndex = 0;
      if (isShow) {
        this.onShowComplete();
      } else {
        this.startAnimIndex = 0;
        this.onHideComplete();
      }
      return;
    }
    if (this.middleLineIndex !== null && this.startAnimIndex === 0) {
      const middleLine = this.linesSorted[this.startAnimIndex];
      const maskLeft = middleLine.querySelector(".mask-left");
      const maskRight = middleLine.querySelector(".mask-right");
      animMask(maskRight, "100%", isShow);
      const animLeft = animMask(maskLeft, "-100%", isShow);
      animLeft.onfinish = () => {
        this.startAnimIndex = 1;
        this.animLines(isShow);
      };
    } else {
      const line1 = this.linesSorted[this.startAnimIndex];
      const line2 = this.linesSorted[this.startAnimIndex + 1];
      const mask1 = line1.querySelector(".mask");
      const mask2 = line2.querySelector(".mask");
      animMask(mask1, "100%", isShow);
      const animLeft = animMask(mask2, "-100%", isShow);
      animLeft.onfinish = () => {
        this.startAnimIndex += 2;
        this.animLines(isShow);
      };
    }
  }
  showLines() {
    const maskEls = this.carousselTextEl.querySelectorAll(".mask");
    maskEls.forEach((mask) => {
      if (mask.classList.contains("mask-left")) {
        mask.style.transform = "translateX(-100%)";
      } else {
        mask.style.transform = "translateX(100%)";
      }
    });
  }
  updateMarkers() {
    const markerEls = this.markerEl.querySelectorAll(".marker");
    markerEls.forEach((marker) => marker.classList.remove("active"));
    markerEls[this.currentIndex].classList.add("active");
  }
  updateButtons() {
    this.nextBtn.disabled = this.currentIndex === texts.length - 1;
    this.prevBtn.disabled = this.currentIndex === 0;
  }
  prev() {
    if (this.isAnimating)
      return;
    this.isAnimating = true;
    this.isComplete = false;
    this.currentIndex -= 1;
    this.updateButtons();
    this.animLines(false);
  }
  next() {
    if (this.isAnimating)
      return;
    this.isAnimating = true;
    this.isComplete = false;
    this.currentIndex += 1;
    this.updateButtons();
    this.animLines(false);
  }
  addListeners() {
    this.nextBtn.addEventListener("click", () => {
      this.next();
    });
    this.prevBtn.addEventListener("click", () => {
      this.prev();
    });
  }
}
export {
  Caroussel as default
};
