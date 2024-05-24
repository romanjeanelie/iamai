import { createNanoEvents } from "nanoevents";
import Herobanners from "./Herobanners";
import CardSliders from "./PopUp/CardSliders";

class PhoneCallPage {
  constructor() {
    this.emitter = createNanoEvents();

    // Components
    this.herobanners = new Herobanners({ emitter: this.emitter });
    this.cardsSliders = new CardSliders({ emitter: this.emitter });
  }
}

new PhoneCallPage();
