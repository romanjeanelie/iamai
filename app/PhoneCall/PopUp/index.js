import { connect, StringCodec, AckPolicy, JSONCodec } from "https://cdn.jsdelivr.net/npm/nats.ws@latest/esm/nats.js";
const NATS_URL = import.meta.env.VITE_API_NATS_URL || "wss://nats.asterizk.ai";
const NATS_USER = import.meta.env.VITE_API_NATS_USER || "iamplus-acc";
const NATS_PASS = import.meta.env.VITE_API_NATS_PASS || "cis8Asto6HepremoGApI";
const PHONECALLCONNECTED = "PHONE_CALL_CONNECTED",
  TRANSCRIPT = "TRANSCRIPT",
  PHONECALLENDED = "PHONE_CALL_ENDED",
  ASSISTANT = "Assistant",
  USER = "User";

import gsap, { Power3 } from "gsap";
import CountryInput from "./CountryInput";
import PhoneInput from "./PhoneInput";
import typeByWord from "../../utils/typeByWord";

export const countries = [
  { label: "United Kingdom", code: "+44" },
  { label: "United States", code: "+1" },
  { label: "France", code: "+33" }, // for test purposes
  { label: "India", code: "+91" },
  { label: "Singapore", code: "+65" },
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

const defaultOpening = "Hi ! I'm costar.";
const defaultPrompt =
  "Robust, Male, Mid 30s, American, Highly professional, Empathising, Knowledgeable, Helpful, Fast, Able to give suggestions.";

export default class PopUp {
  constructor({ emitter, section = "light", data }) {
    this.emitter = emitter;
    this.data = data;
    // States
    this.section = section;
    this.isFormValid = false;
    this.inputs = {
      opening: section === "light" ? "" : defaultOpening,
      prompt: section === "light" ? "" : defaultPrompt,
      country: { name: "English", code: "en-US" }, // default value
      phone: "+1", // default value
      email: "",
    };

    // Bind and store event listener references
    this.handleIntroInput = this.handleIntroInput.bind(this);
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
    // -- Discussion elements
    this.discussionContainer = document.querySelector(".phonePage__popup-discussion-container");
    this.discussionTitle = document.querySelector(".phonePage__popup-discussion-ai-title");

    // -- Set the class of the wrapper in function of the section
    this.wrapper.classList.remove("dark", "light");
    this.wrapper.classList.add(this.section);

    this.countryInput = new CountryInput({ onCountrySelect: this.handleCountryInput });
    this.phoneInput = new PhoneInput({ onPhoneSelect: this.handlePhoneInput });

    // -- Init Methods
    if (this.data) this.initializeWithData();
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

  initializeWithData() {
    if (this.data.opening) this.inputs.opening = this.data.opening;
    if (this.data.prompt) this.inputs.prompt = this.data.prompt;

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

  setFormValidity(boolean) {
    this.isFormValid = boolean;
    this.callBtn.disabled = !boolean;
  }

  validateForm() {
    const isPhoneValid = this.validatePhoneNumber(this.inputs.phone);
    const isCountrySelected = this.inputs.country !== null;

    let isOpeningFilled = true;
    let isPromptFilled = true;

    if (this.section === "light") {
      isOpeningFilled = this.inputs.opening.trim() !== "";
      isPromptFilled = this.inputs.prompt.trim() !== "";
    }

    if (isPhoneValid && isCountrySelected && isOpeningFilled && isPromptFilled) {
      this.setFormValidity(true);
    } else {
      this.setFormValidity(false);
    }
  }

  // ----- Adding events to the inputs -----
  handleIntroInput(e) {
    this.inputs.opening = e.target.value;
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
      const UUID = this.vonage(this.inputs.opening, this.inputs.prompt, this.inputs.phone, this.inputs.country.code);
      this.getcalldata(UUID);

      // -- Set the discussion title --
      if (this.data?.title) {
        this.discussionTitle.innerText = this.data.title;
      } else {
        this.discussionTitle.innerText = this.section === "light" ? "Custom Service" : "Hotel Manager";
      }

      // -- Animation to the second state
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

  vonage(opening, prompt, phone, languageCode) {
    console.log("vonage", opening, prompt, phone, languageCode);
    // WARNING: For POST requests, body is set to null by browsers.
    const UUID = crypto.randomUUID();
    var data = JSON.stringify({
      intro_text: opening,
      system_prompt: prompt,
      phone: phone,
      language_code: languageCode,
      web_hook_url: "",
      nats_session_id: UUID,
    });

    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
        // ---- HERE WE OPEN THE SECOND STATE OF THE POPUP ----
      }
    });

    xhr.open("POST", "https://outbound.telephoney.iamplus.ngrok.app/call");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);

    return UUID;
  }

  getcalldata = async function (uuid) {
    // const callres = document.getElementById("callresinner"); // container for call results
    let previousRole = "";
    let lastMessageP = null; // Keep track of the last message element
    const streamName = uuid;
    const subject = `${streamName}.call.>`;
    console.log("subject: ", subject);
    let nc = await connect({
      servers: [NATS_URL],
      user: NATS_USER,
      pass: NATS_PASS,
    });
    const jsm = await nc.jetstreamManager();

    let si = await jsm.streams.add({
      name: streamName,
      subjects: [subject],
    });
    console.log("Stream add_stream =", si);
    // Add the consumer
    si = await jsm.consumers.add(streamName, {
      durable_name: streamName,
      config: {
        durable_name: streamName,
      },
    });

    const js = nc.jetstream();
    const c = await js.consumers.get(streamName, streamName);
    let iter = await c.consume();
    nc.onclose = function (e) {
      console.log("Socket is closed. Reconnect will be attempted in 1 second.", e.reason);
      setTimeout(async function () {
        console.log("Socket is closed. Reconnect will be attempted in 1 second.", e.reason);
        nc = await connect({
          servers: [NATS_URL],
          user: NATS_USER,
          pass: NATS_PASS,
        });
      }, 1000);
    };

    nc.onerror = function (err) {
      console.error("Socket encountered error: ", err.message, "Closing socket");
      ws.close();
    };
    for await (const m of iter) {
      var mdata = m.json();
      console.log("mdata:", mdata);
      m.ack();
      if (mdata.event) {
        if (mdata.event == PHONECALLCONNECTED || mdata.event == PHONECALLENDED) {
          if (mdata.event == PHONECALLCONNECTED) {
            // close the pop up ?
          }
        } else if (mdata.event == TRANSCRIPT) {
          let currentRole = "";
          if (mdata.sender == USER) {
            currentRole = "USER";
          } else if (mdata.sender == ASSISTANT) {
            currentRole = "AI";
          }

          if (previousRole !== currentRole) {
            previousRole = currentRole;
            const answerWrapper = document.createElement("div");
            answerWrapper.className = "phonePage__popup-discussion-wrapper";

            // setting the role and the message
            const roleP = document.createElement("p");
            roleP.className = "message-role";
            const messageP = document.createElement("p");
            messageP.className = "message-content";

            // appending them to the answerWrapper
            answerWrapper.appendChild(roleP);
            answerWrapper.appendChild(messageP);

            if (currentRole == "USER") {
              answerWrapper.classList.add("user");
              roleP.innerText = "USER";
            } else if (currentRole == "AI") {
              answerWrapper.classList.add("ai");
              roleP.innerText = "AI";
            }

            this.discussionContainer.appendChild(answerWrapper);
            lastMessageP = messageP; // Update the reference to the last message element
          }

          // Append new text to the existing messageP if roles are the same
          if (lastMessageP) {
            typeByWord(lastMessageP, mdata.transcript, 50);
          }
        }
      }
    }
    nc.drain();
  };

  addEvents() {
    this.closeBtn.addEventListener("click", this.closePopUp);
    this.popUpBg.addEventListener("click", this.closePopUp);

    // -- Input events
    this.titleInput?.addEventListener("input", this.handleIntroInput);
    this.promptInput?.addEventListener("input", this.handlePromptInput);
    this.emailInput.addEventListener("input", this.handleEmailInput);

    // -- Call button
    this.callBtn.addEventListener("click", this.handleSubmitBtn);
  }

  // ----- Destroy method -----
  removeEvents() {
    this.closeBtn.removeEventListener("click", this.closePopUp);
    this.popUpBg.removeEventListener("click", this.closePopUp);
    this.titleInput?.removeEventListener("input", this.handleIntroInput);
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
    this.discussionContainer.innerHTML = "";
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
    this.discussionContainer = null;
  }
}
