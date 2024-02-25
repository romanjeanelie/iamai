export default class BlogSlider{
  constructor({sliderData, container}){
    this.slidesData = sliderData;
    this.container = container;

    // States 
    this.prevSlide = 0;
    this.currentSlide = 0;
    this.totalSlides = this.slidesData.length;

    // DOM elements
    this.prevBtn = this.container.querySelector('.blogSlider__button.prev');
    this.nextBtn = this.container.querySelector('.blogSlider__button.next');
    this.paginationTotal = this.container.querySelector('.blogSlider__pagination-total');
    this.paginationCurrent = this.container.querySelector('.blogSlider__pagination-current');
    this.slider = this.container.querySelector('.blogSlider__slides-container');
    this.slides = this.container.querySelectorAll('.blogSlider__slide');
    this.slideDescription = this.container.querySelector('.blogSlider__slide-description');

    // functions
    this.initSlider();
    this.addListeners();
  }

  initSlider(){
    this.paginationTotal.textContent = this.totalSlides;
    this.paginationCurrent.textContent = this.currentSlide + 1;
    this.updateUI();
  }

  goToPrevSlide(){
    if (this.currentSlide === 0) return;
    this.prevSlide = this.currentSlide;
    this.currentSlide--;
    this.goTo({ index: this.currentSlide });
  }

  goToNextSlide(){
    if (this.currentSlide === this.totalSlides - 1) return;
    this.prevSlide = this.currentSlide;
    this.currentSlide++;
    this.goTo({ index: this.currentSlide });
  }

  goTo({ index } = {}) {
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

  updateUI(){
    if (this.currentSlide === 0){
      this.prevBtn.disabled = true;
    } else if (this.currentSlide === this.totalSlides - 1){
      this.nextBtn.disabled = true;
    } else {
      this.prevBtn.disabled = false;
      this.nextBtn.disabled = false;
    }

    this.paginationCurrent.textContent = this.currentSlide + 1;
    this.slideDescription.textContent = this.slidesData[this.currentSlide].description; 
    this.slides.forEach((slide) => {
      slide === this.slides[this.currentSlide] 
      ? slide.classList.add('active') 
      : slide.classList.remove('active');
    })
  }

  handleScroll(){
    let index = 0;
    let totalWidth = 0;
    const viewportCenter = this.slider.scrollLeft + this.slider.offsetWidth / 2;
  
    // Find the slide whose center is closest to the viewport center
    for (const slide of this.slides) {
      totalWidth += slide.offsetWidth;
      const nextSlideCenter = totalWidth + (this.slides[index + 1]?.offsetWidth || 0) / 2;
      if (nextSlideCenter > viewportCenter) {
        break;
      }
      index++;
    }
  
    // Update currentSlide if it has changed
    if (index !== this.currentSlide) {
      this.prevSlide = this.currentSlide;
      this.currentSlide = index;
      this.updateUI();
    }
  }
  

  addListeners(){
    this.prevBtn.addEventListener('click', () => this.goToPrevSlide());
    this.nextBtn.addEventListener('click', () => this.goToNextSlide());
    this.slider.addEventListener('scroll' , () => this.handleScroll())
  }
}