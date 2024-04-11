import { filtersArray, cityBreaksData } from "./accorData";
import SearchBar from "./accorSearchBar/index.js";

// TO DO
// [X] set up the city breaks with initCityBreaks
// [] manage all the different states for the search bar (create a search bar class)
// [] manage the filters carousel

class Accor {
  constructor() {
    // States
    this.filterSelected = "";

    // DOM Elements
    this.filterContainer = document.querySelector(".accorFilters__items-container");
    this.cityBreaksContainer = document.querySelector(".accorBreaks__container");

    // Init
    this.initFilters();
    this.initCityBreaks();

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
}

new Accor();
