import gsap, { Power3 } from "gsap";

const countries = [
  { label: "Afrikaans", code: "+27" },
  { label: "Arabic", code: "+20" },
  { label: "Armenian", code: "+374" },
  { label: "Azerbaijani", code: "+994" },
  { label: "Belarusian", code: "+375" },
  { label: "Bosnian", code: "+387" },
  { label: "Bulgarian", code: "+359" },
  { label: "Catalan", code: "+34" },
  { label: "Chinese", code: "+86" },
  { label: "Croatian", code: "+385" },
  { label: "Czech", code: "+420" },
  { label: "Danish", code: "+45" },
  { label: "Dutch", code: "+31" },
  { label: "English", code: "+44" },
  { label: "Estonian", code: "+372" },
  { label: "Finnish", code: "+358" },
  { label: "French", code: "+33" },
  { label: "Galician", code: "+34" },
  { label: "German", code: "+49" },
  { label: "Greek", code: "+30" },
  { label: "Hebrew", code: "+972" },
  { label: "Hindi", code: "+91" },
  { label: "Hungarian", code: "+36" },
  { label: "Icelandic", code: "+354" },
  { label: "Indonesian", code: "+62" },
  { label: "Italian", code: "+39" },
  { label: "Japanese", code: "+81" },
  { label: "Kannada", code: "+91" },
  { label: "Kazakh", code: "+7" },
  { label: "Korean", code: "+82" },
  { label: "Latvian", code: "+371" },
  { label: "Lithuanian", code: "+370" },
  { label: "Macedonian", code: "+389" },
  { label: "Malay", code: "+60" },
  { label: "Marathi", code: "+91" },
  { label: "Maori", code: "+64" },
  { label: "Nepali", code: "+977" },
  { label: "Norwegian", code: "+47" },
  { label: "Persian", code: "+98" },
  { label: "Polish", code: "+48" },
  { label: "Portuguese", code: "+351" },
  { label: "Romanian", code: "+40" },
  { label: "Russian", code: "+7" },
  { label: "Serbian", code: "+381" },
  { label: "Slovak", code: "+421" },
  { label: "Slovenian", code: "+386" },
  { label: "Spanish", code: "+34" },
  { label: "Swahili", code: "+255" },
  { label: "Swedish", code: "+46" },
  { label: "Tagalog", code: "+63" },
  { label: "Tamil", code: "+91" },
  { label: "Thai", code: "+66" },
  { label: "Turkish", code: "+90" },
  { label: "Ukrainian", code: "+380" },
  { label: "Urdu", code: "+92" },
  { label: "Vietnamese", code: "+84" },
  { label: "Welsh", code: "+44" },
];

// TO DO
// [X] in function of the state, set the class of the phonePage__popup-wrapper (to dark or light)
// [X] in function of the class, display or not the first sections
// [X] add the cross btn and make the close popup function
// [X] make the popup responsive
// [X] add validation to the inputs
// [X] when inputs are valid -> make the call button clickable
// [X] Make the second state pop up
// [X] refactor
// [X] make a good destroy function
// [X] handle going to the second state upon click on the phone btn
// [X] Make the pop up intro animation
// [X] make the animation towards second state
// [] close the country and phone prefix dropdown when clicking outside

export default class PopUp {
  constructor({ section = "light", emitter }) {
    this.emitter = emitter;
    // States
    this.section = section;
    this.isFormValid = false;
    this.inputs = {
      title: "",
      prompt: "",
      country: "",
      phone: "",
      email: "",
    };

    // Bind and store event listener references
    this.handleTitleInput = this.handleTitleInput.bind(this);
    this.handlePromptInput = this.handlePromptInput.bind(this);
    this.handleCountryInput = this.handleCountryInput.bind(this);
    this.handlePhoneInput = this.handlePhoneInput.bind(this);
    this.handleEmailInput = this.handleEmailInput.bind(this);
    this.closePopUp = this.closePopUp.bind(this);
    this.toggleCountryDropdown = this.toggleCountryDropdown.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
    this.togglePhonePrefixDropdown = this.togglePhonePrefixDropdown.bind(this);
    this.selectPhonePrefix = this.selectPhonePrefix.bind(this);
    this.handleSubmitBtn = this.handleSubmitBtn.bind(this);

    // DOM Elements
    this.mainContainer = document.querySelector(".phonePage__popup-container");
    this.wrapper = document.querySelector(".phonePage__popup-wrapper");
    this.popUpBg = document.querySelector(".phonePage__popup-bg");
    // -- Button Elements
    this.closeBtn = document.querySelector(".phonePage__popup-exit-btn");
    this.callBtn = document.querySelector(".phonePage__popup-phone-button");
    // -- Input elements
    this.titleInput = document.querySelector(".phonePage__popup-input.intro");
    this.promptInput = document.querySelector(".phonePage__popup-input.prompt");
    this.countryInput = document.querySelector(".phonePage__popup-input.country");
    this.countryButton = this.countryInput.querySelector(".country__select-button");
    this.countryDropdown = document.querySelector(".country__select-dropdown");

    this.phoneNbInput = document.querySelector(".phonePage__popup-input.phoneNb");
    this.phoneNbButton = this.phoneNbInput.querySelector(".phoneNb__prefix-button");
    this.phonePrefixDropdown = document.querySelector(".phoneNb__prefix-dropdown");
    this.emailInput = document.querySelector(".phonePage__popup-input.email");

    // -- Set the class of the wrapper in function of the section
    this.wrapper.classList.remove("dark", "light");
    this.wrapper.classList.add(this.section);

    // -- Methods
    this.generateCountryOptions();
    this.generatePhonePrefixes();
    this.addEvents();
    this.showingPopUp();
  }

  showingPopUp() {
    gsap.set(this.popUpBg, {
      opacity: 0,
    });
    gsap.set(this.wrapper, {
      y: "100vh",
    });
    this.mainContainer.style.display = "flex";
    const tl = gsap.timeline({ defaults: { ease: Power3.easeOut } });
    tl.to(this.popUpBg, {
      opacity: 1,
    });
    tl.to(
      this.wrapper,
      {
        y: 0,
      },
      "<"
    );
  }

  // ----- Generating all the options for the country input -----
  generateCountryOptions() {
    const selectDropdown = document.querySelector(".country__select-dropdown");
    countries.forEach((country, idx) => {
      if (idx > 5) return;
      selectDropdown.innerHTML += `
        <li role="option">
          <input type="radio" id=${country.label} name="country" />
          <label for=${country.label}>${country.label}</label>
        </li>
      `;
    });

    this.countryButton.addEventListener("click", this.toggleCountryDropdown);
    this.countryDropdown.addEventListener("click", this.selectCountry);
  }

  toggleCountryDropdown() {
    this.countryInput?.classList.toggle("open");
  }

  selectCountry(e) {
    if (e.target.tagName === "LABEL") {
      const countrySpan = this.countryInput.querySelector("span");
      const checkIcon = this.countryInput.querySelector(".check-icon");
      countrySpan.innerHTML = e.target.innerHTML;
      countrySpan.classList.add("selected");
      checkIcon.style.opacity = "1";
      this.countryInput.classList.remove("open");
      this.inputs.country = countrySpan.innerText;
      this.validateForm();
    }
  }

  // ----- Generating all the options for the phone prefix input -----
  generatePhonePrefixes() {
    const selectDropdown = document.querySelector(".phoneNb__prefix-dropdown");

    const sortedCountries = countries.sort((a, b) => {
      // Remove the "+" sign and convert to number for comparison
      const codeA = parseInt(a.code.replace("+", ""), 10);
      const codeB = parseInt(b.code.replace("+", ""), 10);

      return codeA - codeB;
    });

    sortedCountries.forEach((country) => {
      selectDropdown.innerHTML += `
        <li role="option">
          <input type="radio" id=${country.label} name="country" />
          <label for=${country.label}>${country.code}</label>
        </li>
      `;
    });

    this.phoneNbButton.addEventListener("click", this.togglePhonePrefixDropdown);
    this.phonePrefixDropdown.addEventListener("click", this.selectPhonePrefix);
  }

  togglePhonePrefixDropdown() {
    this.phoneNbInput.classList.toggle("open");
  }

  selectPhonePrefix(e) {
    if (e.target.tagName === "LABEL") {
      const phonePrefixSpan = this.phoneNbInput.querySelector(".phoneNb__prefix");
      phonePrefixSpan.innerHTML = e.target.innerHTML;
      phonePrefixSpan.classList.add("selected");
      this.phoneNbInput.classList.remove("open");
      this.inputs.phone = phonePrefixSpan.innerText + this.phoneNbInput.querySelector("input").value;
      this.validateForm();
    }
  }

  // ----- Adding events to the pop up -----
  closePopUp() {
    const tl = gsap.timeline({
      defaults: { ease: Power3.easeOut },
      onComplete: () => {
        this.mainContainer.style.display = "none";
        this.destroy();
      },
    });

    tl.to(this.popUpBg, {
      opacity: 0,
    });
    tl.to(this.wrapper, { y: "100vh" }, "<");
  }

  // ----- Handling form validation ------
  validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\+?\d{9,15}$/;
    return phoneRegex.test(phoneNumber);
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateForm() {
    const isPhoneValid = this.validatePhoneNumber(this.inputs.phone);
    const isEmailValid = this.validateEmail(this.inputs.email);
    const isCountrySelected = this.inputs.country !== "";

    let isIntroFilled = true;
    let isPromptFilled = true;

    if (this.section === "light") {
      isIntroFilled = this.inputs.title.trim() !== "";
      isPromptFilled = this.inputs.prompt.trim() !== "";
    }

    if (isPhoneValid && isEmailValid && isCountrySelected && isIntroFilled && isPromptFilled) {
      this.isFormValid = true;
      this.callBtn.disabled = false;
    } else {
      this.isFormValid = false;
      this.callBtn.disabled = true;
    }
  }

  // ----- Adding events to the inputs -----
  handleTitleInput(e) {
    this.inputs.title = e.target.value;
    this.validateForm();
  }

  handlePromptInput(e) {
    this.inputs.prompt = e.target.value;
    this.validateForm();
  }

  handleCountryInput(e) {
    const countrySelected = this.countryInput.querySelector("span");
    this.inputs.country = countrySelected.innerText;
    this.validateForm();
  }

  handlePhoneInput(e) {
    const prefix = this.phoneNbInput.querySelector(".phoneNb__prefix").innerText;
    this.inputs.phone = prefix + e.target.value;
    this.validateForm();
  }

  handleEmailInput(e) {
    this.inputs.email = e.target.value;
    this.validateForm();
  }

  handleSubmitBtn() {
    if (this.isFormValid) {
      const formElements = gsap.utils.toArray(
        ".phonePage__popup-form, .phonePage__popup-persona-preview, .phonePage__popup-phone-button"
      );
      const discussionElements = gsap.utils.toArray(
        ".phonePage__popup-discussion-ai-title, .phonePage__popup-discussion-container"
      );
      gsap.set(discussionElements, { opacity: 0 });
      const tl = gsap.timeline({ defaults: { ease: Power3.easeOut, duration: 0.4 } });
      tl.to(formElements, {
        opacity: 0,
        onComplete: () => {
          this.wrapper.classList.add("discussion");
        },
      });
      tl.to(discussionElements, {
        opacity: 1,
      });
      tl.set(formElements, { opacity: 1 });
    } else {
      throw new Error("Form is not valid, please complete each field.");
    }
  }

  addEvents() {
    this.closeBtn.addEventListener("click", this.closePopUp);
    this.popUpBg.addEventListener("click", this.closePopUp);

    // -- Input events
    this.titleInput?.addEventListener("input", this.handleTitleInput);
    this.promptInput?.addEventListener("input", this.handlePromptInput);
    this.countryInput.addEventListener("input", this.handleCountryInput);
    this.phoneNbInput.addEventListener("input", this.handlePhoneInput);
    this.emailInput.addEventListener("input", this.handleEmailInput);

    // -- Call button
    this.callBtn.addEventListener("click", this.handleSubmitBtn);
  }

  // ----- Destroy method -----
  removeEvents() {
    this.closeBtn.removeEventListener("click", this.closePopUp);
    this.popUpBg.removeEventListener("click", this.closePopUp);
    this.titleInput?.removeEventListener("input", this.handleTitleInput);
    this.promptInput?.removeEventListener("input", this.handlePromptInput);
    this.countryButton.removeEventListener("click", this.toggleCountryDropdown);
    this.countryInput.removeEventListener("input", this.handleCountryInput);
    this.phoneNbButton.removeEventListener("click", this.togglePhonePrefixDropdown);
    this.phoneNbInput.removeEventListener("input", this.handlePhoneInput);
    this.emailInput.removeEventListener("input", this.handleEmailInput);

    this.countryDropdown.removeEventListener("click", this.selectCountry);
    this.phonePrefixDropdown.removeEventListener("click", this.selectPhonePrefix);

    this.callBtn.removeEventListener("click", this.handleSubmitBtn);
  }

  resetDom() {
    const inputs = this.wrapper.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.value = "";
    });

    // Clear DOM elements' content if necessary
    const countryDropdownElement = document.querySelector(".country__select-dropdown");
    if (countryDropdownElement) countryDropdownElement.innerHTML = "";
    const countrySpan = this.countryInput.querySelector("span");
    countrySpan.innerText = "Country";
    countrySpan.classList.remove("selected");
    const checkIcon = this.countryInput.querySelector(".check-icon");
    checkIcon.style.opacity = "0";

    const phonePrefixDropdownElement = document.querySelector(".phoneNb__prefix-dropdown");
    if (phonePrefixDropdownElement) phonePrefixDropdownElement.innerHTML = "";
    const phonePrefixSpan = this.phoneNbInput.querySelector(".phoneNb__prefix");
    phonePrefixSpan.innerText = "+XX";

    // go back to first state : form
    this.wrapper.classList.remove("discussion");
  }

  destroy() {
    this.removeEvents();
    this.resetDom();

    // Nullify object references
    this.mainContainer = null;
    this.wrapper = null;
    this.popUpBg = null;
    this.closeBtn = null;
    this.callBtn = null;
    this.titleInput = null;
    this.promptInput = null;
    this.countryInput = null;
    this.countryButton = null;
    this.phoneNbInput = null;
    this.phoneNbButton = null;
    this.emailInput = null;
  }
}
