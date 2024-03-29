import Navbar from "../components/Navbar";

// [X] add new preferences page
// [X] add link in navbar to go to preferences page
// [X] make the preferences page integration
// [] handle responsiveness for preferences page
// [] set up logic for the search language
// []

class Settings {
  constructor() {
    // States
    this.languageSelected = "";

    // DOM Elements

    // init
    this.initNavbar();
  }

  initNavbar() {
    new Navbar();
  }
}

new Settings();
