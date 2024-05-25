import gsap, { Power3 } from "gsap";
import CountryInput from "./CountryInput";
import PhoneInput from "./PhoneInput";

export const countries = [
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
// [X] refactor the countryForm
// [X] refactor the NbPrefix form
// [] close the country and phone prefix dropdown when clicking outside

export default class PopUp {
  constructor({ emitter, section = "light", data }) {
    this.emitter = emitter;
    this.data = data;
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

    this.handleSubmitBtn = this.handleSubmitBtn.bind(this);

    // DOM Elements
    this.mainContainer = document.querySelector(".phonePage__popup-container");
    this.wrapper = document.querySelector(".phonePage__popup-wrapper");
    this.popUpBg = document.querySelector(".phonePage__popup-bg");
    // -- Button Elements
    this.closeBtn = document.querySelector(".phonePage__popup-exit-btn");
    this.callBtn = document.querySelector(".phonePage__popup-phone-button");
    this.personaContainer = document.querySelector(".phonePage__popup-persona-preview");
    // -- Input elements
    this.titleInput = document.querySelector(".phonePage__popup-input.intro");
    this.promptInput = document.querySelector(".phonePage__popup-input.prompt");
    this.emailInput = document.querySelector(".phonePage__popup-input.email");

    // -- Set the class of the wrapper in function of the section
    this.wrapper.classList.remove("dark", "light");
    this.wrapper.classList.add(this.section);

    this.countryInput = new CountryInput({ onCountrySelect: this.handleCountryInput });
    this.phoneInput = new PhoneInput({ onPhoneSelect: this.handlePhoneInput });

    // -- Methods
    if (this.data) this.rearrangeUi();
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

  rearrangeUi() {
    this.personaContainer.classList.add("data");
    const bgImg = this.personaContainer.querySelector(".persona__preview-background-img").querySelector("img");

    bgImg.src = this.data.imgFull;
    bgImg.alt = this.data.title;

    const title = this.personaContainer.querySelector("h3");

    title.innerText = this.data.title;
    const description = this.personaContainer.querySelector("p");
    description.innerText = this.data.description;
  }

  resetUi() {
    this.personaContainer.classList.remove("data");
    this.personaContainer.style.backgroundImage = "";
    const title = this.personaContainer.querySelector("h3");
    title.innerText = "Hotel Manager";
    const description = this.personaContainer.querySelector("p");
    description.innerText =
      "Robust, Male, Mid 30s, American, Highly professional, Empathising, Knowledgeable, Helpful, Fast, Able to give suggestions.";
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

  setFormValidity(boolean) {
    this.isFormValid = boolean;
    this.callBtn.disabled = !boolean;
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
      this.setFormValidity(true);
    } else {
      this.setFormValidity(false);
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

  handleEmailInput(e) {
    this.inputs.email = e.target.value;
    this.validateForm();
  }

  handleCountryInput(country) {
    this.inputs.country = country;
    this.validateForm();
  }

  handlePhoneInput(phoneNumber) {
    this.inputs.phone = phoneNumber;
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
    this.emailInput.removeEventListener("input", this.handleEmailInput);

    this.callBtn.removeEventListener("click", this.handleSubmitBtn);
  }

  resetDom() {
    const inputs = this.wrapper.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.value = "";
    });
    // Reset the form validity
    this.setFormValidity(false);
    // go back to first state : form
    this.wrapper.classList.remove("discussion");
  }

  destroy() {
    this.resetUi();
    this.removeEvents();
    this.resetDom();

    this.countryInput.destroy();
    this.phoneInput.destroy();

    // Nullify object references
    this.mainContainer = null;
    this.wrapper = null;
    this.popUpBg = null;
    this.closeBtn = null;
    this.callBtn = null;
    this.titleInput = null;
    this.promptInput = null;
    this.emailInput = null;
  }
}
