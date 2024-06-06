export default class SlideDetect {
  constructor() {
    this.xDown = null;
    this.threshold = 5;

    this.addEvents();
  }

  getTouches(evt) {
    console.log(evt);
    return (
      evt.touches || // browser API
      evt.originalEvent.touches
    ); // jQuery
  }

  handleTouchStart(evt) {
    const firstTouch = this.getTouches(evt)[0];
    this.xDown = firstTouch.clientX;
  }

  handleTouchMove(evt) {
    if (!this.xDown) return;
    let xUp = evt.touches[0].clientX;
    let xDiff = this.xDown - xUp;
    console.log(xDiff);
    if (Math.abs(xDiff) > this.threshold && xDiff > 0) {
      console.log("left swipe");
    } else if (Math.abs(xDiff) > this.threshold && xDiff < 0) {
      console.log("right swipe");
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
    if (Math.abs(xDiff) > this.threshold && xDiff > 0) {
      console.log("left swipe");
    } else if (Math.abs(xDiff) > this.threshold && xDiff < 0) {
      console.log("right swipe");
    }
    /* reset values */
    this.xDown = null;
  }

  addEvents() {
    document.addEventListener("mousedown", this.handleMouseStart.bind(this), false);
    document.addEventListener("mouseup", this.handleMouseUp.bind(this), false);
    document.addEventListener("touchstart", this.handleTouchStart.bind(this), false);
    document.addEventListener("touchmove", this.handleTouchMove.bind(this), false);
  }
}
