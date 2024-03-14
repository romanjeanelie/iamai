// TO DO :
// [X] add fade in/out for description;
// [X] make the mobile version;
// [X] generate the data from the initSlider function (looping through the slidesData);
// [X] play the video only when it's current slider;
// [X] fix the glitch when you scroll too fast;

import { asyncAnim } from "../utils/anim";
import { generateSlider } from "../utils/generateSlider";

export default class BlogSlider {
  constructor({ sliderData, container, differentMobileVersion }) {
    this.slidesData = sliderData;
    this.container = container;
    this.differentMobileVersion = differentMobileVersion;

    // create the html structure
    generateSlider(this.container);

    // States for grab events
    this.isDown = false;
    this.startX;
    this.scrollLeft;

    // Global States
    this.isInView = false;
    this.currentSlide = 0;
    this.isProgrammaticScroll = false;
    this.totalSlides = this.slidesData.length;
    this.isFullscreen = false;

    // DOM elements
    this.navBar = document.querySelector(".blogNav__container");
    this.prevBtn = this.container.querySelector(".blogSlider__button.prev");
    this.nextBtn = this.container.querySelector(".blogSlider__button.next");
    this.paginationTotal = this.container.querySelector(".blogSlider__pagination-total");
    this.paginationCurrent = this.container.querySelector(".blogSlider__pagination-current");

    this.slider = this.container.querySelector(".blogSlider__slides-container");
    this.slides = [];
    this.slideDescription = this.container.querySelector(".blogSlider__slide-description");
    this.slideNavigation = this.container.querySelector(".blogSlider__navigation");

    // mobile dom elements
    this.slideMobileDescription = this.container.querySelector(".blogSlider__mobile-description");
    this.infoBtn = this.container.querySelector(".blogSlider__infoBtn");
    this.closeBtn = this.container.querySelector(".blogSlider__closeBtn");
    this.openFullscreenBtn = this.container.querySelector(".blogSlider__mobileCTA");
    this.exitFullscreenBtn = this.container.querySelector(".blogSlider__exitFullscreen");

    // functions
    this.initSlider();
    this.adjustMobilePadding();
    this.addListeners();
    this.observeSliderInView();
  }

  initSlider() {
    this.paginationTotal && (this.paginationTotal.textContent = this.totalSlides);
    this.paginationCurrent && (this.paginationCurrent.textContent = this.currentSlide + 1);

    this.gutterLeft = document.createElement("div");
    this.gutterLeft.classList.add("blogSlider__gutter-left", "blogSlider__gutter");
    this.slider.appendChild(this.gutterLeft);

    this.slidesData.forEach((slide) => {
      const slideEl = document.createElement("div");
      slideEl.classList.add("blogSlider__slide");

      let staticDescription;

      if (this.differentMobileVersion) {
        staticDescription = document.createElement("p");
        staticDescription.classList.add("blogSlider__static-description");
        staticDescription.textContent = slide.description;
      }

      let mediaEl;
      if (slide.video) {
        mediaEl = document.createElement("video");
        mediaEl.controls = false;
        mediaEl.playsInline = true;
        mediaEl.loop = true;
        mediaEl.setAttribute("webkit-playsinline", "");
        mediaEl.muted = true;
        if (slide.videoMobile && window.innerWidth < 560) {
          mediaEl.src = slide.videoMobile;
        } else {
          mediaEl.src = slide.video;
        }
      } else if (slide.image) {
        mediaEl = document.createElement("img");
        mediaEl.src = slide.image;
      }

      mediaEl.className = "blogSlider__mediaEl";
      slide.mobileFormat && slideEl.classList.add("mobile");

      slideEl.appendChild(mediaEl);
      this.slides.push(slideEl);
      this.slider.appendChild(slideEl);
      if (staticDescription) this.slider.appendChild(staticDescription);
    });

    this.gutterRight = document.createElement("div");
    this.gutterRight.classList.add("blogSlider__gutter-right", "blogSlider__gutter");
    this.slider.appendChild(this.gutterRight);

    this.updateUI();
  }

  async updateUI() {
    // Disable buttons if we are at the first or last slide
    if (this.currentSlide === 0) {
      this.prevBtn.disabled = true;
    } else if (this.currentSlide === this.totalSlides - 1) {
      this.nextBtn.disabled = true;
    } else {
      this.prevBtn.disabled = false;
      this.nextBtn.disabled = false;
    }

    this.paginationCurrent.textContent = this.currentSlide + 1;
    // Add active class to the current slide (all the other slides are opaque)
    this.slides.forEach((slide) => {
      const video = slide.querySelector("video");
      if (slide === this.slides[this.currentSlide] && this.isInView) {
        slide.classList.add("active");
        video?.play();
      } else {
        slide.classList.remove("active");
        video?.pause();
      }
    });

    await asyncAnim(
      this.slideDescription,
      { opacity: [1, 0] },
      { duration: 300, easing: "ease-in-out", fill: "forwards" }
    );
    this.slideDescription.textContent = this.slidesData[this.currentSlide].description;
    this.slideMobileDescription.querySelector("p").textContent = this.slidesData[this.currentSlide].description;
    await asyncAnim(
      this.slideDescription,
      { opacity: [0, 1] },
      { duration: 300, easing: "ease-in-out", fill: "forwards" }
    );
  }

  toggleInfo() {
    this.slideMobileDescription.classList.toggle("hidden");
  }

  toggleFullScreen() {
    this.isFullscreen = !this.isFullscreen;
    this.navBar.classList.toggle("hidden");
    this.container.classList.toggle("fullscreen");
    this.openFullscreenBtn.classList.toggle("hidden");
    this.exitFullscreenBtn.classList.toggle("hidden");
  }

  observeSliderInView() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.isInView = true;
          this.updateUI();
        } else {
          this.isInView = false;
          this.updateUI();
        }
      });
    });
    observer.observe(this.container);
  }

  // ---- NAVIGATION -------
  // delta = -1 for previous slide, 1 for next slide
  async handleGoToSlide(delta) {
    const nextSlide = this.currentSlide + delta;
    if (nextSlide < 0 || nextSlide >= this.totalSlides) return;
    this.isProgrammaticScroll = true;
    this.currentSlide = nextSlide;
    this.goTo(this.currentSlide);
    await this.updateUI();
    this.isProgrammaticScroll = false;
    this.isUpdating = false;
  }

  goTo(index) {
    const slide = this.slides[index];
    if (slide) {
      const slideRect = slide.getBoundingClientRect();
      const scrollPos = this.isFullscreen
        ? slideRect.top + this.slider.scrollTop - this.slider.getBoundingClientRect().top
        : slideRect.left + this.slider.scrollLeft - this.slider.getBoundingClientRect().left;
      const centeredPos =
        scrollPos -
        this.slider[this.isFullscreen ? "offsetHeight" : "offsetWidth"] / 2 +
        slideRect[this.isFullscreen ? "height" : "width"] / 2;

      this.slider.scrollTo({
        [this.isFullscreen ? "top" : "left"]: centeredPos,
        behavior: "smooth",
      });
    }
  }

  handleScroll() {
    if (this.isProgrammaticScroll) return;
    const sliderRect = this.slider.getBoundingClientRect();

    // Calculate the center of the viewport based on the slider's dimensions and position
    const viewportCenter = this.isFullscreen
      ? sliderRect.top + sliderRect.height / 2 // Vertical center for fullscreen mode
      : sliderRect.left + sliderRect.width / 2; // Horizontal center for non-fullscreen mode

    let closestDistance = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < this.slides.length; i++) {
      // Get the dimensions and position of the current slide relative to the viewport
      const slideRect = this.slides[i].getBoundingClientRect();

      // Calculate the center of the current slide
      const slideCenter = this.isFullscreen
        ? slideRect.top + slideRect.height / 2 // Vertical center for fullscreen mode
        : slideRect.left + slideRect.width / 2; // Horizontal center for non-fullscreen mode

      // Calculate the distance between the center of the current slide and the viewport center
      const distance = Math.abs(slideCenter - viewportCenter);

      // Update the closest slide if the current slide is closer to the viewport center
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }

    // Update the current slide if it has changed and is within the bounds of the slide array
    if (closestIndex !== this.currentSlide && closestIndex < this.slides.length) {
      this.currentSlide = closestIndex;
      this.updateUI();
    }
  }

  // GRAB FUNCTIONS
  startDrag(e) {
    this.isDown = true;
    this.slider.classList.add("active");
    this.startX = e.pageX - this.slider.offsetLeft;
    this.scrollLeft = this.slider.scrollLeft;
  }

  stopDrag() {
    this.isDown = false;
    this.slider.classList.remove("active");
  }

  drag(e) {
    if (!this.isDown) return;
    e.preventDefault();
    const x = e.pageX - this.slider.offsetLeft;
    const walk = (x - this.startX) * 3; //scroll-fast
    this.slider.scrollLeft = this.scrollLeft - walk;
  }

  handleVideoSrcOnResize() {
    this.slides.forEach((slide, idx) => {
      const video = slide.querySelector("video");
      if (this.slidesData[idx].videoMobile && window.innerWidth < 560) {
        video.src = this.slidesData[idx].videoMobile;
      } else {
        video.src = this.slidesData[idx].video;
      }
    });
  }

  adjustMobilePadding() {
    // Adjust padding for the first slide
    if (this.slidesData[0].mobileFormat) {
      const firstSlide = this.slides[0];
      const padding = window.innerWidth < 560 ? 0 : (window.innerWidth - firstSlide.offsetWidth) / 2;
      this.gutterLeft.style.width = `${padding}px`;
    }
    // Adjust padding for the last slide
    if (this.slidesData[this.totalSlides - 1].mobileFormat) {
      const lastSlide = this.slides[this.totalSlides - 1];
      const padding = window.innerWidth < 560 ? 0 : (window.innerWidth - lastSlide.offsetWidth) / 2;
      this.gutterRight.style.paddingRight = `${padding}px`;
    }
  }

  addListeners() {
    this.prevBtn?.addEventListener("click", () => this.handleGoToSlide(-1));
    this.nextBtn?.addEventListener("click", () => this.handleGoToSlide(1));
    this.slider.addEventListener("scroll", () => this.handleScroll());
    window.addEventListener("resize", (e) => {
      this.adjustMobilePadding();
      this.handleVideoSrcOnResize();
      if (window.innerWidth > 560) {
        this.isFullscreen && this.toggleFullScreen();
      }
    });

    this.slider.addEventListener("mousedown", (e) => this.startDrag(e));
    this.slider.addEventListener("mouseleave", () => this.stopDrag());
    this.slider.addEventListener("mouseup", () => this.stopDrag());
    this.slider.addEventListener("mousemove", (e) => this.drag(e));

    this.infoBtn?.addEventListener("click", () => this.toggleInfo());
    this.closeBtn?.addEventListener("click", () => this.toggleInfo());
    this.openFullscreenBtn?.addEventListener("click", () => this.toggleFullScreen());
    this.exitFullscreenBtn?.addEventListener("click", () => this.toggleFullScreen());
  }
}
