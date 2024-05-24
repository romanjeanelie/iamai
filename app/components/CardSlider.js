import { cardsType } from "../PhoneCall/PopUp/CardSliders";

export default class CardSlider {
  constructor({ container, data, handleClick }) {
    this.data = data;
    this.container = container;
    this.handleClick = handleClick;

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
    this.header.textContent = this.data.sliderHeader;
    this.sliderContainer.appendChild(this.header);

    // Create slider
    this.slider = document.createElement("div");
    this.slider.className = "cardSlider__slider";
    this.sliderContainer.appendChild(this.slider);

    // Create slider cards
    for (let i = 0; i < this.data.sliderCards.length; i++) {
      const card = document.createElement("div");
      card.className = "cardSlider__slider-card";
      this.generateCard(this.data.sliderCards[i], card);
      this.slides.push(card);
      this.slider.appendChild(card);
    }

    this.gutterRight = document.createElement("div");
    this.gutterRight.className = "right-gutter";
    this.slider.appendChild(this.gutterRight);

    // Append the container to the body or another parent element
    this.container.appendChild(this.sliderContainer);
  }

  generateCard(data, card) {
    switch (data.type) {
      case cardsType.classic:
        card.classList.add("classic");
        const header = document.createElement("div");
        header.className = "cardSlider__slider-card-header";

        const title = document.createElement("h3");
        title.textContent = data.title;
        const subTitle = document.createElement("p");
        subTitle.textContent = data.subTitle;

        header.appendChild(title);
        header.appendChild(subTitle);

        const button = document.createElement("button");
        button.textContent = "Try Me";

        button.addEventListener("click", this.handleClick);

        card.style.backgroundImage = `url(${data.imgCropped})`;
        card.appendChild(header);
        card.appendChild(button);

        break;

      case cardsType.language:
        card.classList.add("language");
        const languageP = document.createElement("p");
        languageP.textContent = data.title;
        languageP.style.background = data.gradient;
        card.appendChild(languageP);
        break;

      default:
        card.classList.add("empty");
        break;
    }
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
