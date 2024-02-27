// TO DO : 
// [X] add fade in/out for description;
// [X] make the mobile version;
// [X] generate the data from the initSlider function (looping through the slidesData);
// [X] play the video only when it's current slider;
// [] fix the glitch when you scroll too fast;


import { asyncAnim } from "../utils/anim";

export default class BlogSlider{
  constructor({sliderData, container}){
    this.slidesData = sliderData;
    this.container = container;

    // States for grab events 
    this.isDown = false;
    this.startX;
    this.scrollLeft;

    // Global States
    this.currentSlide = 0;
    this.isProgrammaticScroll = false;
    this.totalSlides = this.slidesData.length;
    this.isFullscreen = false;

    // DOM elements
    this.navBar = document.querySelector('.blogNav__container');
    this.prevBtn = this.container.querySelector('.blogSlider__button.prev');
    this.nextBtn = this.container.querySelector('.blogSlider__button.next');
    this.paginationTotal = this.container.querySelector('.blogSlider__pagination-total');
    this.paginationCurrent = this.container.querySelector('.blogSlider__pagination-current');

    this.slider = this.container.querySelector('.blogSlider__slides-container');
    this.slides = [];
    this.slideDescription = this.container.querySelector('.blogSlider__slide-description');
    this.slideNavigation = this.container.querySelector('.blogSlider__navigation'); 

    // mobile dom elements
    this.slideMobileDescription = this.container.querySelector('.blogSlider__mobile-description');
    this.infoBtn = this.container.querySelector('.blogSlider__infoBtn');
    this.closeBtn = this.container.querySelector('.blogSlider__closeBtn');
    this.openFullscreenBtn = this.container.querySelector('.blogSlider__mobileCTA');
    this.exitFullscreenBtn = this.container.querySelector('.blogSlider__exitFullscreen');

    // functions
    this.initSlider();
    this.addListeners();
  }

  initSlider(){
    this.paginationTotal.textContent = this.totalSlides;
    this.paginationCurrent.textContent = this.currentSlide + 1;

    this.slidesData.forEach((slide) => {
      const slideEl = document.createElement('div');
      slideEl.classList.add('blogSlider__slide');
      const video = document.createElement('video');
      video.classList.add('blogSlider__video');
      slide.mobileFormat && slideEl.classList.add('mobile');
      video.src = slide.video;
      video.loop = true;
      video.muted = true;

      slideEl.appendChild(video);
      this.slides.push(slideEl);
      this.slider.appendChild(slideEl);
    })

    this.updateUI();
  }

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
      const scrollLeft = slideRect.left + this.slider.scrollLeft - this.slider.getBoundingClientRect().left;
      const centeredLeft = scrollLeft - this.slider.offsetWidth / 2 + slideRect.width / 2;

      this.slider.scrollTo({
        left: centeredLeft,
        behavior: 'smooth'
      });
    }
  }

  async updateUI(){
    // Disable buttons if we are at the first or last slide
    if (this.currentSlide === 0){
      this.prevBtn.disabled = true;
    } else if (this.currentSlide === this.totalSlides - 1){
      this.nextBtn.disabled = true;
    } else {
      this.prevBtn.disabled = false;
      this.nextBtn.disabled = false;
    }

    this.paginationCurrent.textContent = this.currentSlide + 1;
    // Add active class to the current slide (all the other slides are opaque)
    this.slides.forEach((slide) => {
      if (slide === this.slides[this.currentSlide]){
        slide.classList.add('active') 
        slide.querySelector('video').play();
      } else {
        slide.classList.remove('active');
        slide.querySelector('video').pause();
      }
    })

    await asyncAnim(
      this.slideDescription, 
      { opacity: [1, 0] }, 
      { duration: 300, easing: 'ease-in-out', fill: 'forwards' }
    );
    this.slideDescription.textContent = this.slidesData[this.currentSlide].description; 
    this.slideMobileDescription.querySelector('p').textContent = this.slidesData[this.currentSlide].description;
    await asyncAnim(
      this.slideDescription, 
      { opacity: [0, 1] }, 
      { duration: 300, easing: 'ease-in-out', fill: 'forwards' }
    );
  }

  handleScroll(){
    if (this.isProgrammaticScroll) return;
    let index = 0;
    let totalWidth = 0;
    const viewportCenter = this.slider.scrollLeft + this.slider.offsetWidth / 2;
  
    // Find the slide whose center is closest to the viewport center
    for (const slide of this.slides) {
      // Add the width of the current slide to the total width
      totalWidth += slide.offsetWidth;
      // Calculate the center of the next slide by adding half of its width to the total width
      const nextSlideCenter = totalWidth + (this.slides[index + 1]?.offsetWidth || 0) / 2;
      // If the center of the next slide is beyond the viewport center, break the loop
      if (nextSlideCenter > viewportCenter) {
        break;
      }
      // Increment the index to move to the next slide
      index++;
    }
  
    // Update currentSlide if it has changed
    if (index !== this.currentSlide) {
      this.currentSlide = index;
      this.updateUI();
    }
  }

  toggleInfo(){
    this.slideMobileDescription.classList.toggle('hidden');
  }

  toggleFullScreen(){
    this.navBar.classList.toggle('hidden');
    this.container.classList.toggle('fullscreen');
    this.openFullscreenBtn.classList.toggle('hidden');
    this.exitFullscreenBtn.classList.toggle('hidden');
  }

  startDrag(e) {
    this.isDown = true;
    this.slider.classList.add('active');
    this.startX = e.pageX - this.slider.offsetLeft;
    this.scrollLeft = this.slider.scrollLeft;
  }

  stopDrag() {
    this.isDown = false;
    this.slider.classList.remove('active');
  }

  drag(e) {
    if(!this.isDown) return;
    e.preventDefault();
    const x = e.pageX - this.slider.offsetLeft;
    const walk = (x - this.startX) * 3; //scroll-fast
    this.slider.scrollLeft = this.scrollLeft - walk;
  }

  addListeners(){
    this.prevBtn.addEventListener('click', () => this.handleGoToSlide(-1));
    this.nextBtn.addEventListener('click', () => this.handleGoToSlide(1));
    this.slider.addEventListener('scroll' , () => this.handleScroll())

    this.slider.addEventListener('mousedown', (e) => this.startDrag(e));
    this.slider.addEventListener('mouseleave', () => this.stopDrag());
    this.slider.addEventListener('mouseup', () => this.stopDrag());
    this.slider.addEventListener('mousemove', (e) => this.drag(e));

    this.infoBtn.addEventListener('click', () => this.toggleInfo());
    this.closeBtn.addEventListener('click', () => this.toggleInfo());
    this.openFullscreenBtn?.addEventListener('click', () => this.toggleFullScreen());
    this.exitFullscreenBtn?.addEventListener('click', () => this.toggleFullScreen());
  }
}