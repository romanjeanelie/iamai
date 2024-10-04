import HotelCard from "./HotelCard";

export default class HotelsUI {
  constructor(HotelsSearch, HotelsSearchResults) {
    this.hotelsSearchData = HotelsSearch;
    this.hotelsResultsData = HotelsSearchResults;

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

    // Set the innerHTML of hotelsContainer
    this.mainContainer.innerHTML = htmlContent;

    // Append the hotel cards UI
    this.hotelsContainer = this.getHotelsCardsUI();
    this.mainContainer.appendChild(this.hotelsContainer);

    this.filters = this.mainContainer.querySelectorAll(".hotels-ui__filter-item");
    this.filters.forEach((element) => {
      const filter = element.getAttribute("data-filter");
      element.addEventListener("click", () => this.filterHotels(filter));
    });

    return this.mainContainer;
  }

  filterHotels(filter) {
    this.filter = filter;

    this.filters.forEach((f) => {
      f.classList.remove("active");

      if (f.getAttribute("data-filter") === filter) {
        f.classList.add("active");
      }
    });

    // TO DO - Update the hotelsContainer with the new filter
    const newHotels = this.hotelsResultsData.all.filter((hotel) => {
      return filter === "all" || hotel.website === filter;
    });
    this.hotelsContainer.innerHTML = "";
    newHotels.forEach((element) => {
      const hotelCard = new HotelCard(element, this.hotelsSearchData).getElement();
      this.hotelsContainer.appendChild(hotelCard);
    });
    this.mainContainer.appendChild(this.hotelsContainer);
  }

  getHotelsCardsUI() {
    const hotelcardcontainerdiv = document.createElement("div");
    hotelcardcontainerdiv.className = "hotels-ui__main-container";

    this.hotelsResultsData.all.forEach((element) => {
      const hotelCard = new HotelCard(element, this.hotelsSearchData).getElement();
      hotelcardcontainerdiv.appendChild(hotelCard);
    });

    return hotelcardcontainerdiv;
  }

  getElement() {
    return this.mainContainer;
  }
}
