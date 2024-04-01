"use strict";

var _Navbar = _interopRequireDefault(require("../components/Navbar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// [X] add new preferences page
// [X] add link in navbar to go to preferences page
// [X] make the preferences page integration
// [X] display all the languages
// [X] handle responsiveness for preferences page
// [X] set up logic for the search language
// [] change the font for Noto
// [] add the auto-detect choice in the languages
// [] save the selected language in the local storage
// [] use it in the chat page
var languagesArray = [{
  label: "Afrikaans",
  code: "af"
}, {
  label: "Arabic",
  code: "ar"
}, {
  label: "Armenian",
  code: "hy"
}, {
  label: "Azerbaijani",
  code: "az"
}, {
  label: "Belarusian",
  code: "be"
}, {
  label: "Bosnian",
  code: "bs"
}, {
  label: "Bulgarian",
  code: "bg"
}, {
  label: "Catalan",
  code: "ca"
}, {
  label: "Chinese",
  code: "zh"
}, {
  label: "Croatian",
  code: "hr"
}, {
  label: "Czech",
  code: "cs"
}, {
  label: "Danish",
  code: "da"
}, {
  label: "Dutch",
  code: "nl"
}, {
  label: "English",
  code: "en"
}, {
  label: "Estonian",
  code: "et"
}, {
  label: "Finnish",
  code: "fi"
}, {
  label: "French",
  code: "fr"
}, {
  label: "Galician",
  code: "gl"
}, {
  label: "German",
  code: "de"
}, {
  label: "Greek",
  code: "el"
}, {
  label: "Hebrew",
  code: "he"
}, {
  label: "Hindi",
  code: "hi"
}, {
  label: "Hungarian",
  code: "hu"
}, {
  label: "Icelandic",
  code: "is"
}, {
  label: "Indonesian",
  code: "id"
}, {
  label: "Italian",
  code: "it"
}, {
  label: "Japanese",
  code: "ja"
}, {
  label: "Kannada",
  code: "kn"
}, {
  label: "Kazakh",
  code: "kk"
}, {
  label: "Korean",
  code: "ko"
}, {
  label: "Latvian",
  code: "lv"
}, {
  label: "Lithuanian",
  code: "lt"
}, {
  label: "Macedonian",
  code: "mk"
}, {
  label: "Malay",
  code: "ms"
}, {
  label: "Marathi",
  code: "mr"
}, {
  label: "Maori",
  code: "mi"
}, {
  label: "Nepali",
  code: "ne"
}, {
  label: "Norwegian",
  code: "no"
}, {
  label: "Persian",
  code: "fa"
}, {
  label: "Polish",
  code: "pl"
}, {
  label: "Portuguese",
  code: "pt"
}, {
  label: "Romanian",
  code: "ro"
}, {
  label: "Russian",
  code: "ru"
}, {
  label: "Serbian",
  code: "sr"
}, {
  label: "Slovak",
  code: "sk"
}, {
  label: "Slovenian",
  code: "sl"
}, {
  label: "Spanish",
  code: "es"
}, {
  label: "Swahili",
  code: "sw"
}, {
  label: "Swedish",
  code: "sv"
}, {
  label: "Tagalog",
  code: "tl"
}, {
  label: "Tamil",
  code: "ta"
}, {
  label: "Thai",
  code: "th"
}, {
  label: "Turkish",
  code: "tr"
}, {
  label: "Ukrainian",
  code: "uk"
}, {
  label: "Urdu",
  code: "ur"
}, {
  label: "Vietnamese",
  code: "vi"
}, {
  label: "Welsh",
  code: "cy"
}];

var Languages =
/*#__PURE__*/
function () {
  function Languages() {
    _classCallCheck(this, Languages);

    // States
    this.languageSelected = ""; // DOM Elements

    this.languages = [];
    this.languagesContainer = document.querySelector(".languagesPage__languages-container");
    this.languageSearch = document.querySelector(".languagesPage__search"); // init

    this.initNavbar();
    this.initLanguages();
    this.initSelectedLanguage();
    this.addEventListener();
  }

  _createClass(Languages, [{
    key: "initNavbar",
    value: function initNavbar() {
      new _Navbar["default"]();
    }
  }, {
    key: "initLanguages",
    value: function initLanguages() {
      var _this = this;

      languagesArray.forEach(function (language) {
        var languageContainer = document.createElement("li");
        languageContainer.classList.add("languagesPage__language");
        languageContainer.dataset.code = language.code;
        languageContainer.innerHTML = "\n        <p>".concat(language.label, "</p>\n        <div class=\"languagesPage__check-icon\">\n          <img src=\"/icons/check-icon.svg\" alt=\"check icon\" />\n        </div>\n      ");

        _this.languages.push(languageContainer);

        _this.languagesContainer.appendChild(languageContainer);

        languageContainer.addEventListener("click", function () {
          _this.updateSelectedLanguage(language);
        });
      });
    }
  }, {
    key: "initSelectedLanguage",
    value: function initSelectedLanguage() {
      // get the selected language from the local storage
      this.languageSelected = localStorage.getItem("language") || "en"; // update the selected language

      this.updateSelectedLanguage({
        code: this.languageSelected
      });
    }
  }, {
    key: "updateSelectedLanguage",
    value: function updateSelectedLanguage(language) {
      var _this2 = this;

      // updating the state
      this.languageSelected = language.code; // removing "selected" class from every language

      this.languages.forEach(function (language) {
        language.classList.remove("selected");
      }); // adding "selected" class to the new selected language

      var selectedLanguage = this.languages.find(function (language) {
        return language.dataset.code === _this2.languageSelected;
      });
      selectedLanguage.classList.add("selected");
    }
  }, {
    key: "searchLanguage",
    value: function searchLanguage() {
      var _this3 = this;

      var searchValue = this.languageSearch.value.toLowerCase();
      var filteredLanguages = languagesArray.filter(function (language) {
        return language.label.toLowerCase().startsWith(searchValue);
      }); // Clear the current list

      this.languagesContainer.innerHTML = ""; // Add filtered languages to the list

      filteredLanguages.forEach(function (language) {
        _this3.languagesContainer.innerHTML += "\n        <li class=\"languagesPage__language\" data-code=\"".concat(language.code, "\">\n          <p>").concat(language.label, "</p>\n          <div class=\"languagesPage__check-icon\">\n            <img src=\"/icons/check-icon.svg\" alt=\"check icon\" />\n          </div>\n        </li>\n      ");
      });
    }
  }, {
    key: "addEventListener",
    value: function addEventListener() {
      var _this4 = this;

      this.languageSearch.addEventListener("input", function () {
        _this4.searchLanguage();
      });
    }
  }]);

  return Languages;
}();

new Languages();