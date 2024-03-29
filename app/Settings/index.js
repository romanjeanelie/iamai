import Navbar from "../components/Navbar";

console.log("settings js");

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
