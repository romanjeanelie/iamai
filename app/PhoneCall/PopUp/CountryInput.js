const languages = [
  { name: "Bengali", code: "bn-IN" },
  { name: "English", code: "en-US" },
  { name: "French", code: "fr-FR" },
  { name: "Mandarin", code: "zh-CN" },
  { name: "Tamil", code: "ta-IN" },
];

export default class CountryInput {
  constructor({ onCountrySelect }) {
    this.onCountrySelect = onCountrySelect;

    this.destroy = this.destroy.bind(this);
    this.toggleCountryDropdown = this.toggleCountryDropdown.bind(this);
    this.selectCountry = this.selectCountry.bind(this);

    this.countryInput = document.querySelector(".phonePage__popup-input.country");
    this.countryButton = this.countryInput.querySelector(".country__select-button");
    this.countryDropdown = document.querySelector(".country__select-dropdown");

    this.generateCountryOptions();
    this.addEvents();
  }

  generateCountryOptions() {
    languages.forEach((language) => {
      this.countryDropdown.innerHTML += `
        <li role="option">
          <input type="radio" id=${language.name} name="country" />
          <label for=${language.name}>${language.name}</label>
        </li>
      `;
    });
  }

  toggleCountryDropdown() {
    this.countryInput.classList.toggle("open");
  }

  selectCountry(e) {
    if (e.target.tagName === "LABEL") {
      const countrySpan = this.countryInput.querySelector("span");
      const checkIcon = this.countryInput.querySelector(".check-icon");
      countrySpan.innerHTML = e.target.innerHTML;
      countrySpan.classList.add("selected");
      checkIcon.style.opacity = "1";
      this.countryInput.classList.remove("open");
      if (this.onCountrySelect) this.onCountrySelect(countrySpan.innerText);
    }
  }

  addEvents() {
    this.countryButton.addEventListener("click", this.toggleCountryDropdown);
    this.countryDropdown.addEventListener("click", this.selectCountry);
  }

  removeEvents() {
    this.countryButton.removeEventListener("click", this.toggleCountryDropdown);
    this.countryDropdown.removeEventListener("click", this.selectCountry);
  }

  resetDom() {
    this.countryDropdown.innerHTML = "";
    const countrySpan = this.countryInput.querySelector("span");
    countrySpan.innerText = "Languages";
    countrySpan.classList.remove("selected");
    const checkIcon = this.countryInput.querySelector(".check-icon");
    checkIcon.style.opacity = "0";
  }

  destroy() {
    this.resetDom();
    this.removeEvents();
    this.countryInput = null;
    this.countryButton = null;
    this.countryDropdown = null;
  }
}
