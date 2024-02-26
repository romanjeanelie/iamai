// TO DO : 
// [X] add fade in/out for description;
// [] make the mobile version;
// [] generate the data from the initSlider function (looping through the slidesData);
// [] fix the glitch when you scroll too fast;


import { asyncAnim } from "../utils/anim";

export default class BlogSlider{
  constructor({sliderData, container}){
    this.slidesData = sliderData;
    this.container = container;

    // States 
    this.currentSlide = 0;
    this.isProgrammaticScroll = false;
    this.totalSlides = this.slidesData.length;

    // DOM elements
    this.prevBtn = this.container.querySelector('.blogSlider__button.prev');
    this.nextBtn = this.container.querySelector('.blogSlider__button.next');
    this.paginationTotal = this.container.querySelector('.blogSlider__pagination-total');
    this.paginationCurrent = this.container.querySelector('.blogSlider__pagination-current');
    this.slider = this.container.querySelector('.blogSlider__slides-container');
    this.slides = this.container.querySelectorAll('.blogSlider__slide');
    this.slideDescription = this.container.querySelector('.blogSlider__slide-description');

    // mobile dom elements
    this.slideMobileDescription = this.container.querySelector('.blogSlider__mobile-description');
    this.infoBtn = this.container.querySelector('.blogSlider__infoBtn');
    this.closeBtn = this.container.querySelector('.blogSlider__closeBtn');

    // functions
    this.initSlider();
    this.addListeners();
  }

  initSlider(){
    this.paginationTotal.textContent = this.totalSlides;
    this.paginationCurrent.textContent = this.currentSlide + 1;
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
      slide === this.slides[this.currentSlide] 
      ? slide.classList.add('active') 
      : slide.classList.remove('active');
    })

    await asyncAnim(
      this.slideDescription, 
      { opacity: [1, 0] }, 
      { duration: 300, easing: 'ease-in-out', fill: 'forwards' }
    );
    this.slideDescription.textContent = this.slidesData[this.currentSlide].description; 
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
      console.log(index)
      this.currentSlide = index;
      this.updateUI();
    }
  }

  toggleInfo(){
    this.slideMobileDescription.classList.toggle('hidden');
  }

  addListeners(){
    this.prevBtn.addEventListener('click', () => this.handleGoToSlide(-1));
    this.nextBtn.addEventListener('click', () => this.handleGoToSlide(1));
    this.slider.addEventListener('scroll' , () => this.handleScroll())

    this.infoBtn.addEventListener('click', () => this.toggleInfo());
    this.closeBtn.addEventListener('click', () => this.toggleInfo());
  }
}