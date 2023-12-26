import getImageOrientation from "../utils/getImageOrientation";

export default class Slider {
  constructor({ emitter }) {
    this.emitter = emitter;

    this.sliderEl = document.querySelector(".slider");
    this.sliderContentEl = this.sliderEl.querySelector(".slider__content");
    this.nextBtn = this.sliderEl.querySelector(".slider__next");
    this.prevBtn = this.sliderEl.querySelector(".slider__prev");
    this.clostBtn = this.sliderEl.querySelector(".slider__close");

    // Other DOM elements
    this.navbarEl = document.querySelector(".nav");

    this.imgs = null;
    this.currentIndex = 0;

    this.emitter.on("slider:open", (data) => this.open(data));
    this.emitter.on("slider:close", () => this.close());
    this.addListeners();
  }

  checkButtons() {
    this.nextBtn.disabled = this.currentIndex === this.imgs.length - 1;
    this.prevBtn.disabled = this.currentIndex === 0;
  }

  updateIndex() {
    const { scrollLeft, offsetWidth } = this.sliderContentEl;
    const index = Math.round(scrollLeft / offsetWidth);
    if (index !== this.currentIndex) {
      this.currentIndex = index;
      this.checkButtons();
    }
  }

  onScroll() {
    this.updateIndex();
  }

  goTo({ index, immediate = false } = {}) {
    this.sliderContentEl.scrollTo({
      left: index * this.sliderContentEl.offsetWidth,
      behavior: immediate ? "auto" : "smooth",
    });
  }

  open({ imgs = [], currentIndex = 0, allPage = true } = {}) {
    this.imgs = imgs;
    this.sliderContentEl.innerHTML = "";

    this.imgs.forEach((img, i) => {
      const imgContainer = document.createElement("div");
      imgContainer.className = "slider__img-container";
      const imgCopy = img.cloneNode(true);
      const orientation = getImageOrientation(imgCopy);
      imgCopy.classList.add(orientation);
      imgContainer.appendChild(imgCopy);
      this.sliderContentEl.appendChild(imgContainer);
    });

    this.navbarEl.classList.add("hidden");
    this.sliderEl.classList.add("show");
    if (allPage) {
      this.sliderEl.classList.add("all-page");
    }
    this.goTo({ index: currentIndex, immediate: true });
    this.checkButtons();
  }

  next() {
    if (this.currentIndex == this.imgs.length - 1) return;
    this.goTo({ index: this.currentIndex + 1 });
  }

  prev() {
    if (this.currentIndex == 0) return;
    this.goTo({ index: this.currentIndex - 1 });
  }

  close() {
    this.navbarEl.classList.remove("hidden");
    this.sliderEl.classList.remove("show");
  }

  addListeners() {
    this.sliderContentEl.addEventListener("scroll", () => {
      this.onScroll();
    });
    this.nextBtn.addEventListener("click", () => {
      this.next();
    });
    this.prevBtn.addEventListener("click", () => {
      this.prev();
    });
    this.clostBtn.addEventListener("click", () => {
      this.close();
    });
  }
}
