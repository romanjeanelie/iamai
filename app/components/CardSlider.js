export default class CardSlider {
  constructor({ container }) {
    this.container = container;

    // DOM Elements
    this.slider = this.container.querySelector(".slider");
    this.slides = this.slider.querySelectorAll(".slider-card");
    this.gutterRight = this.container.querySelector(".right-gutter");

    // Init methods
    this.generateSlides();
    this.handleSliderGutters();
    this.addEvents();
  }

  generateSlides() {
    console.log("generating slides");
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
