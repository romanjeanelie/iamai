import { createNanoEvents } from "nanoevents";

class PhoneCallPage {
  constructor() {
    this.emitter = createNanoEvents();
  }
}

new PhoneCallPage();
