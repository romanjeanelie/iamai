export default class HotelCard {
  constructor(hotelData, searchParams) {
    this.hotelData = hotelData;
    this.searchParams = searchParams;

    // DOM Elements
    this.cardContainer = null;
    this.navButtons = null;

    // Init Methods
    this.initCard();
  }

  extractNumericRating(rating) {
    if (typeof rating === "string") {
      // find the number in the string and return it as an integer
      return parseInt(rating.match(/\d+/)[0]);
    } else return rating;
  }

  initCard() {
    this.cardContainer = document.createElement("div");
    this.cardContainer.className = "hotels-ui__card-container animate";

    const rating = this.extractNumericRating(this.hotelData.rating);

    const hotelCardHTML = `
      <div class="hotels-ui__hotel-details">
        <div class="hotels-ui__hotel-image">
          <img src=${this.hotelData.pictures[0]}> </img>
        </div>

        <div class="hotels-ui__hotel-info">
          <div class="hotels-ui__hotel-name">${this.hotelData.title}</div>
          <div class="hotels-ui__hotel-rating">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.63278 10.6713C6.50432 10.6147 6.35798 10.6147 6.22953 10.6713L3.10221 12.0494C2.75154 12.2039 2.36453 11.9227 2.40313 11.5415L2.74739 8.14135C2.76153 8.00169 2.71631 7.86251 2.62278 7.75784L0.345732 5.20944C0.0904047 4.92369 0.238231 4.46872 0.612758 4.38762L3.95284 3.66434C4.09003 3.63463 4.20842 3.54861 4.27907 3.42731L5.9991 0.474216C6.19196 0.143082 6.67034 0.143083 6.86321 0.474216L8.58323 3.42731C8.65388 3.54861 8.77227 3.63463 8.90947 3.66434L12.2495 4.38762C12.6241 4.46872 12.7719 4.92369 12.5166 5.20944L10.2395 7.75784C10.146 7.86251 10.1008 8.00169 10.1149 8.14135L10.4592 11.5415C10.4978 11.9227 10.1108 12.2039 9.76009 12.0494L6.63278 10.6713Z" fill="#CED4DE"/>
            </svg>
            ${rating}
          </div>
          <div class="hotels-ui__hotel-location">${this.searchParams.location}</div>
        </div>
      </div>

      <div class="hotels-ui__hotel-price">
        From ${this.hotelData.public_price_per_night || this.hotelData.price} p/ night
      </div>
    `;

    this.cardContainer.innerHTML += hotelCardHTML;

    // Now that the HTML is set, query for the nav buttons
    this.navButtons = this.cardContainer.querySelectorAll(".slider__nav-button");
  }

  // Artifact from old design, keeping it just in case
  initSlider() {
    let hotelImagesHTML = "";
    let hotelDotsHTML = "";

    for (let index = 0; index < this.hotelData.pictures?.length; index++) {
      hotelImagesHTML += `
        <div class="hotels-image-slide ${index === 0 ? "active" : ""}">
          <img class="hotels-image" alt="${this.hotelData.title.replace(/'/g, "&#39;")}" src="${
        this.hotelData.pictures[index]
      }">
        </div>
      `;
      hotelDotsHTML += `<span class="hotels-dot ${index === 0 ? "active" : ""}"></span>`;
      if (index === 3) break;
    }

    const slider = ` 
      <div class="hotels-image-div">
        <div class="hotels-image-slides">
          ${hotelImagesHTML}
        </div>
        <div class="hotels-dots">
          ${hotelDotsHTML}
        </div>
        <button class="slider__nav-button" data-dir="prev">
          <svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="20" r="20" fill="#00254E" fill-opacity="0.24"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M25.0742 12.0002L20.5 20.0002L25.0742 28.0002H27L22.4258 20.0002L27 12.0002H25.0742Z" fill="white"/>
          </svg>
        </button>
        <button class="slider__nav-button" data-dir="next">
          <svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="20" r="20" fill="#00254E" fill-opacity="0.24"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M23.9264 12L28.5023 20L23.9264 28H22L26.5759 20L22 12H23.9264Z" fill="white"/>
          </svg>
        </button>
      </div>
    `;

    return slider;
  }

  hotelmoveSlide(event, next) {
    let currentSlide = event.target.closest(".hotels-card").querySelector(".hotels-image-slide.active");
    let currentDot = event.target.closest(".hotels-card").querySelector(".hotels-dot.active");
    currentSlide.classList.remove("active");
    currentDot.classList.remove("active");

    if (next) {
      // Move to the next slide, or loop back to the first if at the end
      let nextSlide = currentSlide.nextElementSibling || currentSlide.parentNode.firstElementChild;
      nextSlide.classList.add("active");
      let nextDot = currentDot.nextElementSibling || currentDot.parentNode.firstElementChild;
      nextDot.classList.add("active");
    } else {
      // Move to the previous slide, or loop back to the last if at the beginning
      let prevSlide = currentSlide.previousElementSibling || currentSlide.parentNode.lastElementChild;
      prevSlide.classList.add("active");
      let prevDot = currentDot.previousElementSibling || currentDot.parentNode.lastElementChild;
      prevDot.classList.add("active");
    }
  }

  getElement() {
    return this.cardContainer;
  }
}
