export default class SlideDetect {
  constructor({ leftSlideCallback, rightSlideCallback }) {
    this.leftSlideCallback = leftSlideCallback;
    this.rightSlideCallback = rightSlideCallback;

    // States
    this.xDown = null;
    this.threshold = 0;

    // Bind Methods
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleMouseStart = this.handleMouseStart.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    // Init Methods
    this.addEvents();
  }

  handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    this.xDown = firstTouch.clientX;
  }

  handleTouchMove(evt) {
    if (!this.xDown) return;
    let xUp = evt.touches[0].clientX;
    let xDiff = this.xDown - xUp;
    if (Math.abs(xDiff) > this.threshold && xDiff > 0) {
      this.leftSlideCallback();
    } else if (Math.abs(xDiff) > this.threshold && xDiff < 0) {
      this.rightSlideCallback();
    }
    /* reset values */
    this.xDown = null;
  }

  handleMouseStart(evt) {
    this.xDown = evt.clientX;
  }

  handleMouseUp(evt) {
    if (!this.xDown) return;
    let xUp = evt.clientX;
    let xDiff = this.xDown - xUp;
    if (xDiff > 0) {
      this.leftSlideCallback();
    } else if (xDiff < 0) {
      this.rightSlideCallback();
    }
    /* reset values */
    this.xDown = null;
  }

  addEvents() {
    document.addEventListener("mousedown", this.handleMouseStart, false);
    document.addEventListener("mouseup", this.handleMouseUp, false);
    document.addEventListener("touchstart", this.handleTouchStart, false);
    document.addEventListener("touchmove", this.handleTouchMove, false);
  }

  destroy() {
    console.log("destroy slide detect");
    document.removeEventListener("mousedown", this.handleMouseStart, false);
    document.removeEventListener("mouseup", this.handleMouseUp, false);
    document.removeEventListener("touchstart", this.handleTouchStart, false);
    document.removeEventListener("touchmove", this.handleTouchMove, false);
    this.xDown = null;
  }
}
