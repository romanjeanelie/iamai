import gsap from "gsap";

export default class HeroBentoNavigation {
  constructor(parent) {
    this.parent = parent;
    this.isDragging = false;
    this.startX = 0;
    this.scrollLeft = 0;
  }

  startDragging(event) {
    this.isDragging = true;
    this.startX = event.pageX - this.parent.slider.offsetLeft;
    this.scrollLeft = this.parent.slider.scrollLeft;
    this.parent.slider.classList.add("dragging");
  }

  moveSlider(event) {
    if (!this.isDragging) return;
    const x = event.pageX - this.parent.slider.offsetLeft;
    const scroll = x - this.startX;
    this.parent.slider.scrollLeft = this.scrollLeft - scroll;
  }

  stopDragging() {
    if (!this.isDragging) return;
    this.isDragging = false;
    gsap.to(this.parent.slider, {
      scrollLeft: this.parent.currentSlider * this.parent.slider.offsetWidth,
      duration: 0.2,
      onComplete: () => {
        this.parent.slider.classList.remove("dragging");
      },
    });
  }
}
