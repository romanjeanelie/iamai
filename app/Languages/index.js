import Navbar from "../components/Navbar";

// [X] add new preferences page
// [X] add link in navbar to go to preferences page
// [X] make the preferences page integration
// [X] display all the languages
// [X] handle responsiveness for preferences page
// [X] set up logic for the search language
// [X] change the font for Noto
// [X] add the auto-detect choice in the languages
// [X] when search, the selected language changes ?
// [X] save the selected language in the local storage
// [X] use it in the chat page
// [] fix the login page


// const languagesArray = [
//   { label: "Auto Detect", code: "ad" },
//   { label: "Afrikaans", code: "af" },
//   { label: "Arabic", code: "ar" },
//   { label: "Armenian", code: "hy" },
//   { label: "Azerbaijani", code: "az" },
//   { label: "Belarusian", code: "be" },
//   { label: "Bosnian", code: "bs" },
//   { label: "Bulgarian", code: "bg" },
//   { label: "Catalan", code: "ca" },
//   { label: "Chinese", code: "zh" },
//   { label: "Croatian", code: "hr" },
//   { label: "Czech", code: "cs" },
//   { label: "Danish", code: "da" },
//   { label: "Dutch", code: "nl" },
//   { label: "English", code: "en" },
//   { label: "Estonian", code: "et" },
//   { label: "Finnish", code: "fi" },
//   { label: "French", code: "fr" },
//   { label: "Galician", code: "gl" },
//   { label: "German", code: "de" },
//   { label: "Greek", code: "el" },
//   { label: "Hebrew", code: "he" },
//   { label: "Hindi", code: "hi" },
//   { label: "Hungarian", code: "hu" },
//   { label: "Icelandic", code: "is" },
//   { label: "Indonesian", code: "id" },
//   { label: "Italian", code: "it" },
//   { label: "Japanese", code: "ja" },
//   { label: "Kannada", code: "kn" },
//   { label: "Kazakh", code: "kk" },
//   { label: "Korean", code: "ko" },
//   { label: "Latvian", code: "lv" },
//   { label: "Lithuanian", code: "lt" },
//   { label: "Macedonian", code: "mk" },
//   { label: "Malay", code: "ms" },
//   { label: "Marathi", code: "mr" },
//   { label: "Maori", code: "mi" },
//   { label: "Nepali", code: "ne" },
//   { label: "Norwegian", code: "no" },
//   { label: "Persian", code: "fa" },
//   { label: "Polish", code: "pl" },
//   { label: "Portuguese", code: "pt" },
//   { label: "Romanian", code: "ro" },
//   { label: "Russian", code: "ru" },
//   { label: "Serbian", code: "sr" },
//   { label: "Slovak", code: "sk" },
//   { label: "Slovenian", code: "sl" },
//   { label: "Spanish", code: "es" },
//   { label: "Swahili", code: "sw" },
//   { label: "Swedish", code: "sv" },
//   { label: "Tagalog", code: "tl" },
//   { label: "Tamil", code: "ta" },
//   { label: "Thai", code: "th" },
//   { label: "Turkish", code: "tr" },
//   { label: "Ukrainian", code: "uk" },
//   { label: "Urdu", code: "ur" },
//   { label: "Vietnamese", code: "vi" },
//   { label: "Welsh", code: "cy" },
// ];

class Languages {
  constructor() {
    // States
    this.languageSelected = "";
    this.languagesArray = [];
    // DOM Elements
    this.languages = [];
    this.languagesContainer = document.querySelector(".languagesPage__languages-container");
    this.languageSearch = document.querySelector(".languagesPage__search");

    fetch('lang.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.text();
      })
      .then(data => {
        // data = JSON.parse(data);
        // console.log("data:", data);
        this.languagesArray = JSON.parse(data);
        this.initNavbar();
        this.initLanguages(this.languagesArray);
        this.initSelectedLanguage();
        this.addEventListener();
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }

  initNavbar() {
    new Navbar();
  }

  initLanguages(languagesArray) {
    this.languages = [];


    languagesArray.forEach((language) => {
      const languageContainer = document.createElement("li");
      languageContainer.classList.add("languagesPage__language");
      languageContainer.dataset.code = language.code;

      languageContainer.innerHTML = `
            <p>${language.label}</p>
            <div class="languagesPage__check-icon">
              <img src="/icons/check-icon.svg" alt="check icon" />
            </div>
          `;
      this.languages.push(languageContainer);

      this.languagesContainer.appendChild(languageContainer);

      languageContainer.addEventListener("click", () => {
        this.updateSelectedLanguage(language);
      });
    });

    this.initSelectedLanguage();
  }

  initSelectedLanguage() {
    // get the selected language from the local storage
    this.languageSelected = localStorage.getItem("language") || "ad";

    // update the selected language
    this.updateSelectedLanguage({ code: this.languageSelected });
  }

  updateSelectedLanguage(language) {
    // updating the state
    this.languageSelected = language.code;

    // removing "selected" class from every language
    this.languages.forEach((language) => {
      language.classList.remove("selected");
    });

    // adding "selected" class to the new selected language
    const selectedLanguage = this.languages.find((language) => language.dataset.code === this.languageSelected);
    selectedLanguage?.classList.add("selected");

    // save the selected language in the local storage
    localStorage.setItem("language", this.languageSelected);
  }

  searchLanguage() {
    const searchValue = this.languageSearch.value.toLowerCase();
    const filteredLanguages = this.languagesArray.filter((language) => language.label.toLowerCase().startsWith(searchValue));

    // Clear the current list
    this.languagesContainer.innerHTML = "";

    // Add filtered languages to the list
    this.initLanguages(filteredLanguages);
  }

  addEventListener() {
    this.languageSearch.addEventListener("input", () => {
      this.searchLanguage();
    });
  }
}

new Languages();
