import { filtersArray } from "./accorData";

// TO DO
// [] set up the city breaks with initCityBreaks
// [] manage all the different states for the search bar (create a search bar class)
// [] manage the filters carousel

class Accor {
  constructor() {
    // States
    this.filterSelected = "";

    // DOM Elements
    this.filterContainer = document.querySelector(".accorFilters__items-container");

    // Init
    this.initFilters();
  }

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
    console.log(`${filter} is selected`);
    this.filterSelected = filter;
  }
}

new Accor();
