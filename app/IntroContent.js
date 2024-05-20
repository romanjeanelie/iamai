export default class IntroContent {
  constructor() {
    // DOM
    this.slider = document.querySelector(".preLoginContent__slider");
    this.slides = this.slider.querySelectorAll(".preLoginContent__slider-card");
    this.gutterRight = document.querySelector(".preLoginContent__right-gutter");

    // init
    this.handleSliderGutters();
    this.addEvents();
  }

  handleSliderGutters() {
    if (window.innerWidth >= 1200) {
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
