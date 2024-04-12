import gsap from "gsap";
import { filtersArray, cityBreaksData } from "./accorData";
import SearchBar from "./accorSearchBar/index.js";

// TO DO
// [X] set up the city breaks with initCityBreaks
// [X] manage all the different states for the search bar (create a search bar class)
// [X] manage the filters carousel
// [] make the forgotten components responsive
// [] make the animations for the Call
// [] make the custom Date Picker
// [] make the search bar responsive

class Accor {
  constructor() {
    // States
    this.filterSelected = "";

    // DOM Elements
    this.filterContainer = document.querySelector(".accorFilters__items-container");
    this.cityBreaksContainer = document.querySelector(".accorBreaks__container");
    this.filtersArrow = document.querySelector(".accorFilters__arrow");

    // Init
    this.initFilters();
    this.initCityBreaks();
    this.addEventListeners();

    new SearchBar();
  }

  // ------ Filters Section ------
  initFilters() {
    filtersArray.forEach((filter) => {
      const filterContainer = document.createElement("li");
      filterContainer.classList.add("accorFilters__item");
      filterContainer.dataset.filter = filter;

      const label = filter.toUpperCase();

      filterContainer.innerHTML = `
      <img src="/icons/accorFilters/${filter}-icon.svg" alt="arrow right icon" />
      <p>${label}</p>
      `;

      this.filterContainer.appendChild(filterContainer);

      filterContainer.addEventListener("click", () => {
        this.updateSelectedFilter(filter);
      });
    });
  }

  updateSelectedFilter(filter) {
    this.filterSelected = filter;
  }

  navigateThroughFilters() {
    const filters = document.querySelectorAll(".accorFilters__item");
    const lastFilter = filters[filters.length - 1];
    const isLastFilterVisible =
      lastFilter.offsetLeft + lastFilter.clientWidth <=
      this.filterContainer.scrollLeft + this.filterContainer.clientWidth;

    if (isLastFilterVisible) {
      this.filtersArrow.style.transform = "translateY(-50%) rotate(0deg)";
      // If the last filter is visible, animate the filters back to the start
      gsap.to(this.filterContainer, { scrollLeft: 0, duration: 1 });
    } else {
      this.filtersArrow.style.transform = "translateY(-50%) rotate(180deg)";

      // If the last filter is not visible, animate the filters to the left
      gsap.to(this.filterContainer, {
        scrollLeft: this.filterContainer.scrollLeft + this.filterContainer.clientWidth,
        duration: 1,
      });
    }
  }

  // ------ City Breaks Section ------
  initCityBreaks() {
    cityBreaksData.forEach((cityBreak) => {
      this.cityBreaksContainer.innerHTML += `
      <div class="accorBreaks__item">
        <div
          class="accorBreaks__item-location"
          style="background-image: url('${cityBreak.bg}')"
        >
          <p>${cityBreak.city}</p>
        </div>
        <div class="accorBreaks__item-footer">
          <p class="accorBreaks__item-price">
            ${cityBreak.price}
          </p>
          <p class="accorBreaks__item-currency">
            ${cityBreak.currency}
          </p>
        </div>
      </div>
      `;
    });
  }

  addEventListeners() {
    this.filtersArrow.addEventListener("click", this.navigateThroughFilters.bind(this));
  }
}

new Accor();
