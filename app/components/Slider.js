import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import getImageOrientation from "../utils/getImageOrientation";
import isMobile from "../utils/isMobile";

gsap.registerPlugin(ScrollTrigger);
export default class Slider {
  constructor({ emitter, pageEl }) {
    this.emitter = emitter;

    // Containers
    this.sliderEl = document.querySelector(".slider");
    this.sliderContentEl = this.sliderEl.querySelector(".slider__content");
    this.sliderContentQuestionsWrapperEl = this.sliderEl.querySelector(".slider__contentQuestionsWrapper");
    this.sliderContentQuestionsEl = this.sliderEl.querySelector(".slider__contentQuestions");

    // Buttons
    this.nextBtn = this.sliderEl.querySelector(".slider__next");
    this.prevBtn = this.sliderEl.querySelector(".slider__prev");
    this.closeBtn = this.sliderEl.querySelector(".slider__close");
    this.questionsBtn = this.sliderEl.querySelector(".slider__questions");

    // Other DOM elements
    this.iconBadge = this.sliderEl.querySelector(".icon-badge");
    this.inputEl = pageEl.querySelector(".input__wrapper");
    this.selectedCounter = null; // set in open questions slider

    this.imgs = [];
    this.imgsSelected = [];
    this.questionsImgs = [];
    this.currentIndex = 0;
    this.gap = 24;

    this.emitter.on("slider:open", (data) => this.open(data));
    this.emitter.on("slider:addImg", (img) => this.addImg({ img }));
    this.emitter.on("slider:goTo", ({ index }) => this.goTo({ index }));
    this.emitter.on("slider:close", () => this.close());
    this.addListeners();
  }

  checkButtons() {
    this.nextBtn.style.visibility = this.imgs.length > 1 ? "visible" : "hidden";
    this.prevBtn.style.visibility = this.imgs.length > 1 ? "visible" : "hidden";

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
    this.sliderContentEl.innerHTML = "";
    this.emitter.emit("input:updateImages", []);

    imgs.forEach((img, i) => {
      this.addImg({ img, container: this.sliderContentEl });
    });

    this.sliderEl.classList.add("show");
    if (allPage) {
      this.sliderEl.classList.add("all-page");
    }
    this.goTo({ index: currentIndex, immediate: true });
    this.checkButtons();
  }

  openImageQuestions() {
    this.emitter.emit("input:toWrite", {
      type: "imageQuestions",
      placeholder: "Ask a question about images",
      focus: !isMobile(),
    });

    this.leftGutter = document.createElement("div");
    this.leftGutter.className = "slider__gutter slider__left-gutter";
    this.sliderContentQuestionsEl.appendChild(this.leftGutter);

    this.selectedCounter = document.createElement("div");
    this.selectedCounter.className = "slider__selected-counter";
    this.selectedCounter.innerHTML = `Images Selected <span class="selected-counter empty">0</span> of ${this.imgs.length}`;

    this.sliderContentQuestionsWrapperEl.appendChild(this.selectedCounter);

    this.imgs.forEach((img, i) => {
      this.addImg({ img, type: "questions" });
    });

    this.rightGutter = document.createElement("div");
    this.rightGutter.className = "slider__gutter slider__right-gutter";
    this.sliderContentQuestionsEl.appendChild(this.rightGutter);

    const firstImg = this.questionsImgs[0].querySelector("img");

    // Wait for the image to load
    firstImg.addEventListener("load", (e) => {
      this.setGutterWidth("left");
      this.questionsImgs.forEach((img) => {
        img.classList.remove("hidden");
      });
    });

    this.sliderContentQuestionsWrapperEl.classList.add("show");

    const lastImg = this.questionsImgs[this.questionsImgs.length - 1].querySelector("img");
    lastImg.addEventListener("load", () => {
      this.setGutterWidth("right");
    });

    this.sliderEl.classList.remove("all-page");

    this.setMaxHeightInputText();
  }

  setGutterWidth(gutter = "left") {
    if (!this.questionsImgs.length) return;
    if (gutter === "left") {
      const leftGutterWidth =
        window.innerWidth < 560 ? 0 : (window.innerWidth - this.questionsImgs[0].offsetWidth) / 2 - this.gap;
      this.leftGutter.style.width = `${leftGutterWidth}px`;
    } else if (gutter === "right") {
      const rightGutterWidth =
        window.innerWidth < 560
          ? 0
          : (window.innerWidth - this.questionsImgs[this.questionsImgs.length - 1].offsetWidth) / 2 - this.gap;
      this.rightGutter.style.width = `${rightGutterWidth}px`;
    }
  }

  resetImageQuestions() {
    this.selectedCounter?.remove();
    this.questionsImgs = [];
    this.sliderContentQuestionsEl.innerHTML = "";
    this.sliderContentQuestionsWrapperEl.classList.remove("show");

    this.emitter.emit("input:imagesQuestionAsked");
  }

  updateSelectedCounter() {
    const selectCounterSpan = this.selectedCounter.querySelector(".selected-counter");
    selectCounterSpan.textContent = this.imgsSelected.length;
    if (this.imgsSelected.length > 0) {
      selectCounterSpan.classList.remove("empty");
    } else {
      selectCounterSpan.classList.add("empty");
    }
  }

  checkImagesSelected() {
    const imgsSelected = this.sliderContentQuestionsEl.querySelectorAll(".selected img");
    this.imgsSelected = [...imgsSelected];
    this.updateSelectedCounter();
    this.emitter.emit("input:updateImages", this.imgsSelected);
  }

  addImg({ img, type = null }) {
    const imgContainer = document.createElement("div");
    imgContainer.className = "slider__img-container";
    imgContainer.classList.add("hidden");
    const imgCopy = img.cloneNode(true);
    const orientation = getImageOrientation(imgCopy);
    imgCopy.classList.add(orientation);
    imgContainer.appendChild(imgCopy);
    if (type == "questions") {
      // Add icon
      const iconBadgeCopy = this.iconBadge.cloneNode(true);
      iconBadgeCopy.classList.add("show");
      imgContainer.appendChild(iconBadgeCopy);

      // Add click listener
      imgContainer.addEventListener("click", () => {
        imgContainer.classList.toggle("selected");
        this.checkImagesSelected();
      });

      this.sliderContentQuestionsEl.appendChild(imgContainer);
      this.questionsImgs.push(imgContainer);
    } else {
      this.sliderContentEl.appendChild(imgContainer);
      this.imgs.push(img);
    }
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
    this.imgs = [];
    this.sliderEl.classList.remove("show");

    this.resetImageQuestions();
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
    this.closeBtn.addEventListener("click", () => {
      this.close();
    });
    this.questionsBtn.addEventListener("click", () => {
      this.openImageQuestions();
    });

    // Resize
    window.addEventListener("resize", () => {
      this.setGutterWidth("left");
      this.setGutterWidth("right");
    });
  }
}
