import HotelCard from "./HotelCard";

export default class HotelsUI {
  constructor(HotelsSearch, HotelsSearchResults) {
    this.hotelsSearch = HotelsSearch;
    this.hotelsSearchResults = HotelsSearchResults;

    // State
    this.filter = "all";

    // DOM Elements
    this.mainContainer = null;
    this.hotelsContainer = null;
    this.initUI();
  }

  initUI() {
    // Initialize the UI
    this.mainContainer = document.createElement("div");

    // Build the HTML content as a string
    let htmlContent = `
      <div class="hotels-ui__filter-container">
        <button class="hotels-ui__filter-item active" data-filter="all">
          All
        </button>
        <button class="hotels-ui__filter-item" data-filter="airbnb">
          Airbnb
        </button>
        <button class="hotels-ui__filter-item" data-filter="accor">
          Hotels
        </button>
      </div>
    `;

    // Append the hotel cards UI
    this.hotelsContainer = this.getHotelsCardsUI().outerHTML;
    htmlContent += this.hotelsContainer;

    // Set the innerHTML of hotelsContainer
    this.mainContainer.innerHTML = htmlContent;

    this.filters = this.mainContainer.querySelectorAll(".hotels-ui__filter-item");
    this.filters.forEach((element) => {
      const filter = element.getAttribute("data-filter");
      element.addEventListener("click", (event) => this.filterHotels(event, filter));
    });

    return this.mainContainer;
  }

  filterHotels(event, filter) {
    this.filter = filter;

    this.filters.forEach((f) => {
      f.classList.remove("active");

      if (f.getAttribute("data-filter") === filter) {
        f.classList.add("active");
      }
    });

    // TO DO - Update the hotelsContainer with the new filter
  }

  getHotelsCardsUI() {
    const hotelcardcontainerdiv = document.createElement("div");
    hotelcardcontainerdiv.className = "hotelscard-container";

    this.hotelsSearchResults.all.forEach((element) => {
      const hotelCard = new HotelCard(element).getElement();
      hotelcardcontainerdiv.appendChild(hotelCard);
    });

    return hotelcardcontainerdiv;
  }

  getElement() {
    return this.mainContainer;
  }
}
