import { createNanoEvents } from "nanoevents";
import Herobanners from "./Herobanners";

class PhoneCallPage {
  constructor() {
    this.emitter = createNanoEvents();

    // Components
    this.herobanners = new Herobanners({ emitter: this.emitter });
  }
}

new PhoneCallPage();
