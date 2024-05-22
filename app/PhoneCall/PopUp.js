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
// [] add validation to the inputs
// [] when inputs are valid -> make the call button clickable
// [] in function of the button clicked, set the state of the pop up
// [] Make the pop up intro animation
// [] Make the second state pop up

export default class PopUp {
  constructor({ section = "light", emitter }) {
    this.emitter = emitter;
    // States
    this.section = section;
    this.inputs = {
      title: "",
      prompt: "",
      country: "",
      phone: "",
      email: "",
    };

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
    this.phoneNbInput = document.querySelector(".phonePage__popup-input.phoneNb");
    this.phoneNbButton = this.phoneNbInput.querySelector(".phoneNb__prefix-button");
    this.emailInput = document.querySelector(".phonePage__popup-input.email");

    this.wrapper.classList.remove("dark", "light");
    this.wrapper.classList.add(this.section);

    this.generateCountryOptions();
    this.generatePhonePrefixes();
    this.addEvents();
  }

  // ----- Generating all the options for the country input -----
  generateCountryOptions() {
    const selectDropdown = document.querySelector(".country__select-dropdown");
    countries.forEach((country, idx) => {
      // if (idx > 5) return;
      selectDropdown.innerHTML += `
        <li role="option">
          <input type="radio" id=${country.label} name="country" />
          <label for=${country.label}>${country.label}</label>
        </li>
      `;
    });

    this.countryButton.addEventListener("click", () => {
      this.countryInput.classList.toggle("open");
    });

    const countryDropdown = document.querySelector(".country__select-dropdown");
    countryDropdown.addEventListener("click", (e) => {
      if (e.target.tagName === "LABEL") {
        const countrySpan = this.countryInput.querySelector("span");
        const checkIcon = this.countryInput.querySelector(".check-icon");
        countrySpan.innerHTML = e.target.innerHTML;
        countrySpan.classList.add("selected");
        checkIcon.style.opacity = "1";
        this.countryInput.classList.remove("open");
      }
    });
  }

  // ----- Generating all the options for the phone prefix input -----
  generatePhonePrefixes() {
    const selectDropdown = document.querySelector(".phoneNb__prefix-dropdown");
    countries.forEach((country, idx) => {
      // if (idx > 5) return;
      selectDropdown.innerHTML += `
        <li role="option">
          <input type="radio" id=${country.label} name="country" />
          <label for=${country.label}>${country.code}</label>
        </li>
      `;
    });

    this.phoneNbButton.addEventListener("click", () => {
      this.phoneNbInput.classList.toggle("open");
    });

    const phonePrefixDropdown = document.querySelector(".phoneNb__prefix-dropdown");
    phonePrefixDropdown.addEventListener("click", (e) => {
      if (e.target.tagName === "LABEL") {
        const phonePrefixSpan = this.phoneNbInput.querySelector(".phoneNb__prefix");
        phonePrefixSpan.innerHTML = e.target.innerHTML;
        phonePrefixSpan.classList.add("selected");
        this.phoneNbInput.classList.remove("open");
      }
    });
  }

  // ----- Adding events to the pop up -----
  closePopUp() {
    this.mainContainer.style.display = "none";
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

    console.log("is intro filled : ", isIntroFilled, this.inputs.title);
    console.log("is prompt filled : ", isPromptFilled, this.inputs.prompt);
    console.log("is country selected : ", isCountrySelected, this.inputs.country);
    console.log("is phone valid : ", isPhoneValid, this.inputs.phone);
    console.log("is email valid : ", isEmailValid, this.inputs.email);

    if (isPhoneValid && isEmailValid && isCountrySelected && isIntroFilled && isPromptFilled) {
      this.callBtn.disabled = false;
    } else {
      this.callBtn.disabled = true;
    }
  }

  addEvents() {
    this.closeBtn.addEventListener("click", this.closePopUp.bind(this));
    this.popUpBg.addEventListener("click", this.closePopUp.bind(this));

    // -- Input events
    this.titleInput?.addEventListener("input", (e) => {
      this.inputs.title = e.target.value;
      this.validateForm();
    });

    this.promptInput?.addEventListener("input", (e) => {
      this.inputs.prompt = e.target.value;
      this.validateForm();
    });

    this.countryInput.addEventListener("input", (e) => {
      const countrySelected = this.countryInput.querySelector("span");
      this.inputs.country = countrySelected.innerText;
      this.validateForm();
    });

    this.phoneNbInput.addEventListener("input", (e) => {
      const prefix = this.phoneNbInput.querySelector(".phoneNb__prefix").innerText;
      this.inputs.phone = prefix + e.target.value;
      this.validateForm();
    });

    this.emailInput.addEventListener("input", (e) => {
      this.inputs.email = e.target.value;
      this.validateForm();
    });
  }
}
