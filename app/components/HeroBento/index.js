import gsap, { Power3 } from "gsap";
import HeroBentoAnimations from "./HeroBentoAnimations";
import HeroBentoItems from "./HeroBentoItems";
import HeroBentoNavigation from "./HeroBentoNavigation";

const itemTypes = {
  SQUARE: { label: "square-item", value: 1 },
  HIGH: { label: "high-item", value: 2 },
  WIDE: { label: "wide-item", value: 2 },
};

let bentoItems = [
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
    name: "tagline-item",
    type: itemTypes.SQUARE,
  },
  {
    name: "tagline-item",
    type: itemTypes.SQUARE,
  },
  {
    name: "entertainment-item",
    type: itemTypes.SQUARE,
  },
  {
    name: "entertainment-item",
    type: itemTypes.SQUARE,
  },
];

class HeroBento {
  constructor({ user, emitter }) {
    this.user = user;
    this.emitter = emitter;

    // States
    this.debug = import.meta.env.VITE_DEBUG === "true";
    this.currentBreakpoint = this.getBreakpoint();
    this.currentSlider = 0;
    this.isDisplayed = true;
    this.isDragging = false;
    this.startX = 0;
    this.scrollLeft = 0;

    // Dom Elements
    this.container = document.querySelector(".heroBentoGrid__container");
    this.name = this.container.querySelector(".name");
    this.slider = this.container.querySelector(".heroBentoGrid__slider");
    this.indicatorsContainer = this.container.querySelector(".heroBentoGrid__indicators");
    this.bentoGrids = [];
    this.indicators = [];

    // Init
    this.navigation = new HeroBentoNavigation(this);
    this.init();
    this.addEventListeners();

    this.anims = new HeroBentoAnimations();

    if (this.debug) {
      this.hideBentoGrids();
    }
  }

  init() {
    this.setName();
    this.populateBentoGrids();
  }

  // Set the user name
  setName() {
    this.name.textContent = this.user?.name || "Guest";
  }

  // Handle dynamic breakpoint changes
  getBreakpoint() {
    const width = window.innerWidth;
    let breakpoint = "desktop";
    if (width <= 640) breakpoint = "mobile";
    return breakpoint;
  }

  getMaxValue() {
    const breakpointValues = {
      mobile: 4,
      tablet: 6,
      desktop: 8,
    };
    return breakpointValues[this.currentBreakpoint] || 8;
  }

  getItemsOrder() {
    if (this.currentBreakpoint === "mobile") {
      return [
        {
          name: "multitasking-item",
          type: itemTypes.WIDE,
        },
        {
          name: "entertainment-item",
          type: itemTypes.SQUARE,
        },
        {
          name: "tagline-item",
          type: itemTypes.SQUARE,
        },
        {
          name: "talk-item",
          type: itemTypes.HIGH,
        },
        {
          name: "tagline-item",
          type: itemTypes.SQUARE,
        },
        {
          name: "tagline-item",
          type: itemTypes.SQUARE,
        },

        {
          name: "entertainment-item",
          type: itemTypes.SQUARE,
        },

        {
          name: "travel-item",
          type: itemTypes.WIDE,
        },
      ];
    } else {
      return bentoItems; // else return the default order
    }
  }

  resetIndicators() {
    this.indicators.forEach((indicator) => indicator.remove());
    this.indicators = [];
  }

  resetBentoGrids() {
    this.slider.innerHTML = "";
    this.observer.disconnect();
    this.resetIndicators();
    this.bentoGrids = [];
  }

  // Handle the bento grids generation
  populateBentoGrids() {
    let currentGrid = this.createNewGrid();
    const maxValue = this.getMaxValue(); // Define your maximum grid value
    let currentValue = 0;

    const items = this.getItemsOrder();

    for (const item of items) {
      const itemValue = item.type.value;
      // If adding the item exceeds the maxValue, finalize the current grid
      if (currentValue + itemValue > maxValue) {
        currentGrid = this.createNewGrid(); // Start a new grid
        currentValue = 0; // Reset the current value
      }

      // Add the item to the grid and update the current value
      const bentoItem = new HeroBentoItems(item);
      currentGrid.appendChild(bentoItem);

      currentValue += itemValue;
    }

    // Append the final grid to the container if it has any items
    if (currentGrid.children.length > 0) {
      this.slider.prepend(currentGrid);
    }

    this.generateIndicators();
    this.observeBentoItems();
  }

  observeBentoItems() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.setCurrentSlider(Array.from(this.bentoGrids).indexOf(entry.target));
          }
        });
      },
      { threshold: 0.5 }
    );

    this.bentoGrids.forEach((item) => this.observer.observe(item));
  }

  createNewGrid() {
    const grid = document.createElement("div");
    grid.className = "heroBentoGrid__grid";
    grid.style.order = this.bentoGrids.length;
    this.bentoGrids.push(grid);
    this.slider.appendChild(grid);
    return grid;
  }

  // Animate the bento grid
  async hideBentoGrids() {
    this.isDisplayed = false;
    await this.anims.hideBentoGridsAnim(this.container);
    this.destroy();
  }

  destroy() {
    this.container.remove();
  }

  // Handle navigation between slides
  generateIndicators() {
    this.bentoGrids?.forEach((_, index) => {
      const indicator = document.createElement("span");
      indicator.className = `indicator ${index === this.currentSlider ? "active" : ""}`;
      indicator.dataset.slide = index;
      this.indicators.push(indicator);
      this.indicatorsContainer.appendChild(indicator);
    });
  }

  updateIndicators(activeIndex) {
    this.indicators.forEach((indicator, index) => {
      // Toggle the active class on the indicator
      indicator.classList.toggle("active", index === activeIndex);
    });
  }

  setCurrentSlider(index) {
    this.currentSlider = index;
    this.updateIndicators(index);
  }

  handleResize() {
    const newBreakpoint = this.getBreakpoint();
    if (newBreakpoint !== this.currentBreakpoint) {
      this.currentBreakpoint = newBreakpoint;
      this.resetBentoGrids();
      this.populateBentoGrids();
    }
  }

  addEventListeners() {
    // Resize event
    window.addEventListener("resize", this.handleResize.bind(this));

    // Slider Dragging events
    this.slider.addEventListener("mousedown", this.navigation.startDragging.bind(this.navigation));
    this.slider.addEventListener("mouseup", this.navigation.stopDragging.bind(this.navigation));
    this.slider.addEventListener("mousemove", this.navigation.moveSlider.bind(this.navigation));
    this.slider.addEventListener("mouseleave", this.navigation.stopDragging.bind(this.navigation));

    this.emitter.on("pre-text-animation", () => {
      if (!this.isDisplayed) return;
      this.hideBentoGrids();
    });
  }
}

export default HeroBento;
