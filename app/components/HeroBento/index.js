import gsap, { Power3 } from "gsap";
import HeroBentoAnimations from "./HeroBentoAnimations";
import HeroBentoItems from "./HeroBentoItems";

const itemTypes = {
  SQUARE: { label: "square-item", value: 1 },
  HIGH: { label: "high-item", value: 2 },
  WIDE: { label: "wide-item", value: 2 },
};

const bentoItems = [
  {
    name: "tagline-item",
    type: itemTypes.SQUARE,
  },
  {
    name: "multitasking-item",
    type: itemTypes.WIDE,
  },
  {
    name: "talk-item",
    type: itemTypes.HIGH,
  },
  {
    name: "travel-item",
    type: itemTypes.WIDE,
  },
  {
    name: "entertainment-item",
    type: itemTypes.HIGH,
  },
];

class HeroBento {
  constructor({ user, emitter }) {
    this.user = user;
    this.emitter = emitter;

    // States
    this.debug = import.meta.env.VITE_DEBUG === "true";
    this.currentSlider = 0;
    this.isDisplayed = true;
    this.isDragging = false;
    this.startX = 0;
    this.scrollLeft = 0;

    // Dom Elements
    this.container = document.querySelector(".heroBentoGrid__container");
    this.name = this.container.querySelector(".name");
    this.slider = this.container.querySelector(".heroBentoGrid__slider");
    this.bentoGrids = [];
    this.indicators = this.container.querySelectorAll(".heroBentoGrid__indicators .indicator");

    // Init
    this.anims = new HeroBentoAnimations();
    this.setName();
    this.populateBentoGrid();
    this.observeBentoItems();
    this.addEventListeners();

    if (this.debug) {
      this.hideBento();
    }
  }

  setName() {
    this.name.textContent = this.user?.name || "Guest";
  }

  populateBentoGrid() {
    let currentGrid = document.createElement("div");
    currentGrid.className = "heroBentoGrid__grid";
    if (!this.bentoGrids.length) {
      this.bentoGrids?.push(currentGrid);
    }

    bentoItems.forEach((item, index) => {
      const bentoItem = new HeroBentoItems(item);
      currentGrid.appendChild(bentoItem);
    });

    this.slider.appendChild(currentGrid);
  }

  hideBento() {
    this.isDisplayed = false;
    gsap.to(this.container, {
      yPercent: -200,
      ease: Power3.easeOut,
      duration: 0.5,
      onComplete: this.destroy.bind(this),
    });
  }

  destroy() {
    this.container.remove();
  }

  observeBentoItems() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Get the index of the bento grid
            this.currentSlider = Array.from(this.bentoGrids).indexOf(entry.target);
            this.updateIndicators(this.currentSlider);
          }
        });
      },
      { threshold: 0.5 }
    );

    this.bentoGrids.forEach((item) => observer.observe(item));
  }

  updateIndicators(activeIndex) {
    this.indicators.forEach((indicator, index) => {
      // Toggle the active class on the indicator
      indicator.classList.toggle("active", index === activeIndex);
    });
  }

  startDragging(event) {
    this.isDragging = true;
    this.startX = event.pageX - this.slider.offsetLeft;
    this.scrollLeft = this.slider.scrollLeft;

    // Remove snap and adjust cursor style
    this.slider.classList.add("dragging");
  }

  moveSlider(event) {
    if (!this.isDragging) return;
    const x = event.pageX - this.slider.offsetLeft;
    const scroll = x - this.startX;
    this.slider.scrollLeft = this.scrollLeft - scroll;
  }

  stopDragging() {
    if (!this.isDragging) return;
    this.isDragging = false;
    gsap.to(this.slider, {
      scrollLeft: this.currentSlider * this.slider.offsetWidth,
      duration: 0.5,
      onComplete: () => {
        this.slider.classList.remove("dragging");
      },
    });
    // Add back snap and remove cursor style
    // this.slider.classList.remove("dragging");
  }

  addEventListeners() {
    this.slider.addEventListener("mousedown", this.startDragging.bind(this));

    this.slider.addEventListener("mouseup", this.stopDragging.bind(this));

    this.slider.addEventListener("mousemove", this.moveSlider.bind(this));

    this.slider.addEventListener("mouseleave", this.stopDragging.bind(this));

    this.emitter.on("pre-text-animation", () => {
      if (!this.isDisplayed) return;
      this.hideBento();
    });
  }
}

export default HeroBento;
