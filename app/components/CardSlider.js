export default class CardSlider {
  constructor({ container, data, handleClick }) {
    this.container = container;

    // DOM Elements
    this.sliderContainer = null;
    this.header = null;
    this.slider = null;
    this.slides = [];
    this.gutterRight = null;

    // Init methods
    this.generateSlider();
    this.handleSliderGutters();
    this.addEvents();
  }

  generateSlider() {
    // Create container
    this.sliderContainer = document.createElement("div");
    this.sliderContainer.className = "cardSlider__container";

    // Create header
    this.header = document.createElement("h2");
    this.header.className = "cardSlider__header";
    this.header.textContent = "Test";
    this.sliderContainer.appendChild(this.header);

    // Create slider
    this.slider = document.createElement("div");
    this.slider.className = "cardSlider__slider";
    this.sliderContainer.appendChild(this.slider);

    // Create slider cards
    for (let i = 0; i < 6; i++) {
      const card = document.createElement("div");
      card.className = "cardSlider__slider-card";
      this.slides.push(card);
      this.slider.appendChild(card);
    }

    this.gutterRight = document.createElement("div");
    this.gutterRight.className = "right-gutter";
    this.sliderContainer.appendChild(this.gutterRight);

    // Append the container to the body or another parent element
    this.container.appendChild(this.sliderContainer);
  }

  handleSliderGutters() {
    if (window.innerWidth >= 1280) {
      const x = (window.innerWidth - 1232) / 2;
      this.slider.style.paddingLeft = `${x}px`;
    }

    const slideWidth = this.slides[0].offsetWidth;
    const padding = window.innerWidth < 560 ? 0 : (window.innerWidth - slideWidth) / 2;
    this.gutterRight.style.paddingRight = `${padding}px`;
  }

  addEvents() {
    window.addEventListener("resize", this.handleSliderGutters.bind(this));
  }
}
