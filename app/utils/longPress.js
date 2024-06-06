export default class LongPress {
  constructor(element, callback, cancelCallback, duration = 3000) {
    this.element = element;
    this.callback = callback;
    this.cancelCallback = cancelCallback;
    this.duration = duration;
    this.timeoutId = null;

    // Bind the event handlers
    this.handleStartPress = this.handleStartPress.bind(this);
    this.handleCancelPress = this.handleCancelPress.bind(this);

    // Add event listeners
    this.addEvents();
    console.log("long press");
  }

  handleStartPress() {
    console.log("start press");
    this.timeoutId = setTimeout(() => {
      this.callback();
      this.timeoutId = null; // Clear timeout ID after callback execution
    }, this.duration);
  }

  handleCancelPress() {
    console.log("cancel press");
    if (this.timeoutId === null) {
      this.cancelCallback();
    } else {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  addEvents() {
    this.element.addEventListener("mousedown", this.handleStartPress);
    this.element.addEventListener("mouseleave", this.handleCancelPress);
    this.element.addEventListener("mouseup", this.handleCancelPress);
    this.element.addEventListener("touchstart", this.handleStartPress);
    this.element.addEventListener("touchend", this.handleCancelPress);
    this.element.addEventListener("touchcancel", this.handleCancelPress);
  }

  destroy() {
    this.element.removeEventListener("mousedown", this.handleStartPress);
    this.element.removeEventListener("mouseleave", this.handleCancelPress);
    this.element.removeEventListener("mouseup", this.handleCancelPress);
    this.element.removeEventListener("touchstart", this.handleStartPress);
    this.element.removeEventListener("touchend", this.handleCancelPress);
    this.element.removeEventListener("touchcancel", this.handleCancelPress);
  }
}
