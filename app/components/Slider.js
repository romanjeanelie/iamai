import getImageOrientation from "../utils/getImageOrientation";

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
    this.clostBtn = this.sliderEl.querySelector(".slider__close");
    this.questionsBtn = this.sliderEl.querySelector(".slider__questions");

    // Other DOM elements
    this.iconBadge = this.sliderEl.querySelector(".icon-badge");
    this.navbarEl = document.querySelector(".nav");
    this.inputEl = pageEl.querySelector(".input__wrapper");
    this.inputTextEl = this.inputEl.querySelector(".input-text__expand");

    this.imgs = [];
    this.imgsSelected = [];
    this.currentIndex = 0;

    this.emitter.on("slider:open", (data) => this.open(data));
    this.emitter.on("slider:addImg", (img) => this.addImg({ img }));
    this.emitter.on("slider:goTo", ({ index }) => this.goTo({ index }));
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
    this.sliderContentEl.innerHTML = "";

    imgs.forEach((img, i) => {
      this.addImg({ img, container: this.sliderContentEl });
    });

    this.navbarEl.classList.add("hidden");
    this.sliderEl.classList.add("show");
    if (allPage) {
      this.sliderEl.classList.add("all-page");
    }
    this.goTo({ index: currentIndex, immediate: true });
    this.checkButtons();
  }

  openImageQuestions() {
    this.emitter.emit("input:toWrite", { type: "imageQuestions", placeholder: "Ask a question about images" });

    this.imgs.forEach((img, i) => {
      this.addImg({ img, type: "questions" });
    });
    this.sliderContentQuestionsWrapperEl.classList.add("show");
    this.sliderEl.classList.remove("all-page");

    this.positionImageQuestionsWrapper();
    this.setMaxHeightInputText();
  }

  positionImageQuestionsWrapper() {
    const inputOffsetLeft = this.inputEl.getBoundingClientRect().left;
    this.sliderContentQuestionsWrapperEl.style.paddingLeft = inputOffsetLeft + "px";
  }

  setMaxHeightInputText() {
    this.inputTextEl.classList.add("height-imageQuestions");
  }

  resetImageQuestions() {
    this.sliderContentQuestionsEl.innerHTML = "";
    this.sliderContentQuestionsWrapperEl.classList.remove("show");
    this.inputTextEl.classList.remove("height-imageQuestions");
  }

  checkImagesSelected() {
    const imgsSelected = this.sliderContentQuestionsEl.querySelectorAll(".selected img");
    this.imgsSelected = [...imgsSelected];
    this.emitter.emit("input:updateImagesQuestions", this.imgsSelected);
  }

  addImg({ img, type = null }) {
    const imgContainer = document.createElement("div");
    imgContainer.className = "slider__img-container";
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
    this.navbarEl.classList.remove("hidden");
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
    this.clostBtn.addEventListener("click", () => {
      this.close();
    });
    this.questionsBtn.addEventListener("click", () => {
      this.openImageQuestions();
    });

    // Resize
    window.addEventListener("resize", () => {
      this.positionImageQuestionsWrapper();
    });
  }
}
