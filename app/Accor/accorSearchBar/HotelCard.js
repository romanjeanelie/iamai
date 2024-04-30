export default class HotelCard {
  constructor({ data, container }) {
    this.container = container;
    this.hotelData = data;

    // State
    this.currentImg = 0;

    // DOM ELEMENTS
    this.hotelCardContainer;
    this.slider;
    this.navBtns;
    this.navIndicators = [];

    this.initHotelCard();
    this.populateSlider();
    this.addEventListener();
  }

  initHotelCard() {
    this.hotelCardContainer = document.createElement("div");
    this.hotelCardContainer.classList.add("accorHotels__hotel-card");

    this.hotelCardContainer.innerHTML = `
      <div class="slider-container">
        <div class="slider-nav-button" data-direction="back">
          <img src="/icons/card-chevron-left.svg" alt="back chevron" />
        </div>
        <div class="slider-nav-button forward" data-direction="forward">
          <img src="/icons/card-chevron-left.svg" alt="back chevron" />
        </div>
        <div class="slider"> </div>
      </div>
      <div class="content-container">
        <div class="hotel-infos">
          <h4>${this.hotelData.hotel}</h4>
          <div class="hotel-wrapper">
            <div class="hotel-ratings">
              <div class="star-icon">
                <img src="/icons/star.svg" alt="star" />
              </div>
              <p>${this.hotelData.ratings} <span>/ 5 </span></p>
            </div>
            <div class="hotel-location">
              <div class="location-icon">
                <img src="/icons/location-icon.svg" alt="location icon" />
              </div>
              <p>${this.hotelData.location} km</p>
            </div>
          </div>
        </div>

        <div class="hotel-footer">
          <div class="hotel-price">
            <p class="reduction">${this.hotelData.reduction}</p>
            <p>${this.hotelData.price}<span> ${this.hotelData.currency}</span></p>
          </div>

          <a class="hotel-cta" href="#">
            VIEW
          </a>

        </div>
      </div>
    `;

    this.container.appendChild(this.hotelCardContainer);

    this.slider = this.hotelCardContainer.querySelector(".slider");
  }

  populateSlider() {
    const nav = document.createElement("div");
    nav.className = "slider-nav";

    this.hotelData.imgs.forEach((element, idx) => {
      this.slider.innerHTML += `
        <div class="slider-img">
          <img src=${element} />
        </div>
      `;

      const navIndic = document.createElement("div");
      navIndic.className = `image-nav-indicator ${idx === 0 ? "active" : ""}`;
      this.navIndicators.push(navIndic);
      nav.appendChild(navIndic);
    });

    this.slider.appendChild(nav);
  }

  updateNavIndicators(i) {
    this.navIndicators.forEach((navI, idx) => {
      navI.classList.remove("active");
      if (i === idx) navI.classList.add("active");
    });
  }

  goTo(index, immediate = false) {
    this.slider.scrollTo({
      left: index * this.slider.offsetWidth,
      behavior: immediate ? "auto" : "smooth",
    });
  }

  handleClickNavBtn(btn) {
    const isBack = btn.currentTarget.dataset.direction === "back";

    if (isBack) {
      if (this.currentImg === 0) return;
      this.currentImg--;
      this.updateNavIndicators(this.currentImg);
    } else {
      if (this.currentImg === this.hotelData.imgs.length - 1) return;
      this.currentImg++;
      this.updateNavIndicators(this.currentImg);
    }

    this.goTo(this.currentImg);
  }

  addEventListener() {
    this.navBtns = this.hotelCardContainer.querySelectorAll(".slider-nav-button");

    this.navBtns.forEach((btn) => {
      btn.addEventListener("click", this.handleClickNavBtn.bind(this));
    });
  }
}
