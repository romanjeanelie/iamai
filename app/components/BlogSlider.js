// TO DO :
// [X] add fade in/out for description;
// [X] make the mobile version;
// [X] generate the data from the initSlider function (looping through the slidesData);
// [X] play the video only when it's current slider;
// [X] fix the glitch when you scroll too fast;

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cascadingFadeInText } from "../Blog/BlogAnimations";
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
    this.isMobile = window.innerWidth < 640;

    // Global States
    this.isInView = false;
    this.currentSlide = 0;
    this.isProgrammaticScroll = false;
    this.totalSlides = this.slidesData.length;

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

    // Mobile dom elements
    this.slideMobileDescription = this.container.querySelector(".blogSlider__mobile-description");
    this.infoBtn = this.container.querySelector(".blogSlider__infoBtn");
    this.closeBtn = this.container.querySelector(".blogSlider__closeBtn");

    // functions
    this.initSlider();
    this.initSliderAnim();
    this.adjustMobilePadding();
    this.addListeners();
    this.observeSliderInView();
    this.initLazyLoad();
  }

  initSlider() {
    this.paginationTotal && (this.paginationTotal.textContent = this.totalSlides);
    this.paginationCurrent && (this.paginationCurrent.textContent = this.currentSlide + 1);

    this.gutterLeft = document.createElement("div");
    this.gutterLeft.classList.add("blogSlider__gutter-left", "blogSlider__gutter");
    this.slider.appendChild(this.gutterLeft);

    this.slidesData.forEach((slide, idx) => {
      const slideEl = document.createElement("div");
      slideEl.classList.add("blogSlider__slide");

      let staticDescription;

      if (this.differentMobileVersion) {
        staticDescription = document.createElement("p");
        staticDescription.classList.add("blogSlider__static-description");
        staticDescription.textContent = slide.description;
      }

      if (this.differentMobileVersion && idx == 0) {
        slideEl.classList.add("first-slide");
      }

      let mediaEl;
      if (slide.video) {
        slide.sound && slideEl.classList.add("video-container");
        mediaEl = document.createElement("video");
        mediaEl.controls = false;
        mediaEl.playsInline = true;
        mediaEl.preload = "auto";
        mediaEl.loop = true;
        mediaEl.setAttribute("webkit-playsinline", "");
        mediaEl.muted = true;
        if (slide.videoMobile && window.innerWidth < 560) {
          mediaEl.dataset.src = slide.videoMobile;
        } else {
          mediaEl.dataset.src = slide.video;
        }
      } else if (slide.image) {
        mediaEl = document.createElement("img");
        mediaEl.src = slide.image;
      }

      mediaEl.className = "blogSlider__mediaEl";
      slide.mobileFormat && slideEl.classList.add("mobile");
      mediaEl.addEventListener("click", function(){
        mediaEl.controls = true;
      });

      slideEl.appendChild(mediaEl);
      this.slides.push(slideEl);
      this.slider.appendChild(slideEl);
      if (staticDescription) this.slider.appendChild(staticDescription);
    });

    this.gutterRight = document.createElement("div");
    this.gutterRight.classList.add("blogSlider__gutter-right", "blogSlider__gutter");
    this.slider.appendChild(this.gutterRight);

    // hide the navbar when the slider is in view
    ScrollTrigger.create({
      trigger: this.container,
      start: "top top",
      end: "bottom top",
      onEnter: () => {
        if (this.isMobile) this.navBar.classList.add("hidden");
      },
      onEnterBack: () => {
        if (this.isMobile) this.navBar.classList.add("hidden");
      },
      onLeave: () => {
        this.navBar.classList.remove("hidden");
      },
      onLeaveBack: () => {
        this.navBar.classList.remove("hidden");
      },
    });

    this.updateUI();
  }

  initSliderAnim() {
    const footer = this.container.querySelector(".blogSlider__footer");
    cascadingFadeInText(this.slider, footer);
  }

  async updateUI() {
    // Disable buttons if we are at the first or last slide
    this.prevBtn.disabled = false;
    this.nextBtn.disabled = false;
    if (this.currentSlide === 0) {
      this.prevBtn.disabled = true;
    }
    if (this.currentSlide === this.totalSlides - 1) {
      this.nextBtn.disabled = true;
    }
    this.paginationCurrent.textContent = this.currentSlide + 1;
    // Add active class to the current slide (all the other slides are opaque)
    
    this.slides.forEach((slide) => {
      const video = slide.querySelector("video");
      if (slide === this.slides[this.currentSlide] && this.isInView) {
        slide.classList.add("active");
        // console.log("active");
        video?.play();
        if(video)
          video.controls = false;
        // video?.controls = false;
      } else {
        slide.classList.remove("active");
        video?.pause();
        if(video)
          video.controls = true;
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

  initLazyLoad() {
    const config = {
      rootMargin: "50%",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const mediaEl = entry.target.querySelector("video");
          if (mediaEl.dataset?.src) {
            mediaEl.src = mediaEl.dataset.src;
          }
        }
      });
    }, config);

    this.slides.forEach((slide) => {
      observer.observe(slide);
    });
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
      const scrollPos = slideRect.left + this.slider.scrollLeft - this.slider.getBoundingClientRect().left;
      const centeredPos = scrollPos - this.slider.offsetWidth / 2 + slideRect.width / 2;

      this.slider.scrollTo({
        left: centeredPos,
        behavior: "smooth",
      });
    }
  }

  handleScroll() {
    if (this.isProgrammaticScroll) return;
    const sliderRect = this.slider.getBoundingClientRect();

    // Calculate the center of the viewport based on the slider's dimensions and position
    const viewportCenter = sliderRect.left + sliderRect.width / 2; // Horizontal center

    let closestDistance = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < this.slides.length; i++) {
      // Get the dimensions and position of the current slide relative to the viewport
      const slideRect = this.slides[i].getBoundingClientRect();

      // Calculate the center of the current slide
      const slideCenter = slideRect.left + slideRect.width / 2; // Horizontal center

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
        video && (video.src = this.slidesData[idx].video);
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
      this.isMobile = window.innerWidth < 640;
    });

    this.slider.addEventListener("mousedown", (e) => this.startDrag(e));
    this.slider.addEventListener("mouseleave", () => this.stopDrag());
    this.slider.addEventListener("mouseup", () => this.stopDrag());
    this.slider.addEventListener("mousemove", (e) => this.drag(e));

    this.infoBtn?.addEventListener("click", () => this.toggleInfo());
    this.closeBtn?.addEventListener("click", () => this.toggleInfo());
  }
}
