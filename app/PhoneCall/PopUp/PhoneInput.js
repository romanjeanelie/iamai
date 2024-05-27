import { countries } from ".";

export default class PhoneInput {
  constructor({ onPhoneSelect }) {
    this.onPhoneSelect = onPhoneSelect;

    // State
    this.phonePrefix = "+XX";
    this.phoneNumber = "";

    // Dom Elements
    this.phoneNbInput = document.querySelector(".phonePage__popup-input.phoneNb");
    this.phoneNbButton = document.querySelector(".phoneNb__prefix-button");
    this.phonePrefixDropdown = document.querySelector(".phoneNb__prefix-dropdown");
    this.phonePrefixSpan = document.querySelector(".phoneNb__prefix");

    // Bind methods
    this.togglePhonePrefixDropdown = this.togglePhonePrefixDropdown.bind(this);
    this.setPhonePrefix = this.setPhonePrefix.bind(this);
    this.setPhoneInput = this.setPhoneInput.bind(this);

    // Methods
    this.generatePhonePrefixes();
    // set default value as +1
    this.setPhonePrefix({ target: { tagName: "LABEL", innerText: "+1" } });
    this.addEvents();
  }

  generatePhonePrefixes() {
    // order the countries by their phone code in ascending order
    const sortedCountries = countries.sort((a, b) => {
      // Remove the "+" sign and convert to number for comparison
      const codeA = parseInt(a.code.replace("+", ""), 10);
      const codeB = parseInt(b.code.replace("+", ""), 10);
      return codeA - codeB;
    });

    sortedCountries.forEach((country) => {
      this.phonePrefixDropdown.innerHTML += `
        <li role="option">
          <input type="radio" id=${country.label} name="country" />
          <label for=${country.label}>${country.code}</label>
        </li>
      `;
    });
  }

  togglePhonePrefixDropdown() {
    this.phoneNbInput.classList.toggle("open");
  }

  setPhoneInput(e) {
    this.phoneNumber = e.target.value;
    const phoneValue = this.phonePrefix + this.phoneNumber;
    if (this.onPhoneSelect) this.onPhoneSelect(phoneValue);
  }

  setPhonePrefix(e) {
    if (e.target.tagName === "LABEL") {
      this.phonePrefix = e.target.innerText;
      this.phonePrefixSpan.innerText = this.phonePrefix;
      this.phonePrefixSpan.classList.add("selected");
      this.phoneNbInput.classList.remove("open");
      const phoneValue = this.phonePrefix + this.phoneNumber;
      if (this.onPhoneSelect) this.onPhoneSelect(phoneValue);
    }
  }

  addEvents() {
    this.phoneNbButton.addEventListener("click", this.togglePhonePrefixDropdown);
    this.phonePrefixDropdown.addEventListener("click", this.setPhonePrefix);
    this.phoneNbInput.addEventListener("input", this.setPhoneInput);
  }

  // handle all the destroy functions
  removeEvents() {
    this.phoneNbButton.removeEventListener("click", this.togglePhonePrefixDropdown);
    this.phonePrefixDropdown.removeEventListener("click", this.setPhonePrefix);
    this.phoneNbInput.removeEventListener("input", this.setPhoneInput);
  }

  resetStates() {
    this.phonePrefix = "+XX";
    this.phoneNumber = "";
  }

  resetDom() {
    this.phoneNbInput.classList.remove("open");
    this.phonePrefixDropdown.innerHTML = this.phoneNumber;
    this.phonePrefixSpan.innerText = this.phonePrefix;
  }

  destroy() {
    this.resetStates();
    this.resetDom();
    this.removeEvents();

    this.phoneNbInput = null;
    this.phoneNbButton = null;
    this.phonePrefixDropdown = null;
    this.phonePrefixSpan = null;
  }
}
