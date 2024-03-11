import BlogSlider from "./components/BlogSlider";
import gsap, { Power3 } from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

const slider1Data = [
  {
    id:1,
    video: '/videos/blog/Desktop_Zoom_In_ChatGPT.mp4',
    description: "ChatGPT in action.",
  }, 
  {
    id:2,
    image: '/images/blog/slider1-2.png',
    description: "The actual showtimes for Dune 2 at AMC Century City on Saturday March 9th.",
    mobileFormat: true,

  },
  {
    id:3,
    image: '/images/blog/slider1-3.png',
    description: "The actual showtimes for Dune 2 at AMC Century City on Saturday March 9th.",
    mobileFormat: true,

  }, 
];

const slider2Data = [
  {
    id:1,
    image: '/placeholder/placeholder.jpg',
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
  }, 
  {
    id:2,
    video: '/placeholder/placeholder.mp4',
    description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    mobileFormat: true,

  },
  {
    id:3,
    video: '/placeholder/placeholder.mp4',
    description: "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
  }, 
  {
    id:4,
    video: '/placeholder/placeholder.mp4',
    description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    mobileFormat: true,

  }, 
];

const data = [
  {
    h1: "Effortlessly Multilingual.",
    p: "Jump from English to French to German, and back again – even toss in some Mandarin or Hindi – CO* effortlessly keeps up within a single, flowing conversation.",
    sliderData : slider2Data
  },
  {
    h1: "CO* can see, speak and hear.",
    p: "CO* goes beyond text. It sees (images), hears (your voice), and speaks (respond naturally), providing a truly personalized and intuitive experience.",
    sliderData : slider2Data
  },
  {
    h1: "CO* get things done. Like a real assistant.",
    p: "Everyday Efficiency. CO*  takes the hassle out of your life and functions like a proactive assistant who coordinates seamlessly on your behalf.",
    sliderData : slider2Data
  },
  {
    h1: "Travel Whiz.",
    p: "CO* transforms the hassle of trip planning into a breeze, acting like a dedicated travel agent who understands your needs.",
    sliderData : slider2Data
  },
  {
    h1: "Entertainment. Your Way.",
    p: "CO* learns your tastes to deliver movie suggestions, reviews, and showtimes that fit your schedule. It can even book tickets for you.",
    sliderData : slider2Data
  },
  {
    h1: "Powerhouse for Planning. Research and Execution.",
    p: "It gathers information, synthesizes insights, and provides actionable summaries for efficient decision-making.",
    sliderData : slider2Data
  },
  {
    h1: "E-commerce Reinvented.",
    p: "Ultimate Price Sleuth. Forget scrolling through endless online stores. CO* is your tireless shopping assistant",
    sliderData : slider2Data
  },
  {
    h1: "Culinary Companion.",
    p: "CO* transforms your kitchen experience. It scans your fridge, offers recipe suggestions based on what you have identifies missing ingredients and suggests the best places to buy them.",
    sliderData : slider2Data
  },
  {
    h1: "The Multitasking Assistant. Always by Your Side.",
    p: "CO * is your tireless multitasker. It juggles tasks simultaneously, ensuring smooth and efficient completion.",
    sliderData : slider2Data
  },
]

// TO DO : 
// [X] adjust the size of the slider to the new design
// [] add correct videos to the slider
// [X] handle the marquee;
// [] add correct logos for the marquee;
// [] handle the videos (use mobile version when needed)
// [] 

gsap.registerPlugin(ScrollTrigger)

class Blog {
  constructor() {
    // States
    this.animation = null;

    // DOM Elements
    this.blogLottieAnimation = document.querySelector('.blogHero__lottieAnimation');
    this.blogMarquees = document.querySelectorAll('.blogMarquee__app-marquee');
    this.slidersSection = document.querySelector('.blogSliders__container');

    this.initSliders();
    this.initScrollAnim();
  }



  initSliders() {
    const slidersData = [slider1Data, slider2Data];
    const sliders = document.querySelectorAll('.blogSlider__container');
    sliders.forEach((slider, idx) => {
      new BlogSlider({sliderData: slidersData[0], container: slider})
    });

    if (!this.slidersSection) return

    data.forEach((data, idx) => {
      const isEven = idx % 2 === 0;
      const html = `
      <div class="blogSlider__section">
      <div class="blog__container">
        <div class="blogSlider__header">
          <h1 class="${isEven && 'centered'}" >${data.h1}</h2>
          <p class="${isEven && 'centered'}" >${data.p}</p>
        </div>
      </div>
  
      <div class="blogSlider__container sliderSection">
      <div class="blogSlider__slides-container">
      </div>
  
      <button class="blogSlider__exitFullscreen hidden">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M26.5 14.7C26.5 15.1418 26.1418 15.5 25.7 15.5L17.3001 15.5H17.3C16.8582 15.5 16.5 15.1418 16.5 14.7L16.5001 14.6874L16.5001 6.3C16.5001 5.85817 16.8583 5.5 17.3001 5.5C17.7419 5.5 18.1001 5.85817 18.1001 6.3L18.1001 12.7622L25.1073 5.75506C25.4197 5.44264 25.9262 5.44264 26.2386 5.75506C26.5511 6.06748 26.5511 6.57401 26.2386 6.88643L19.2251 13.9H25.7C26.1418 13.9 26.5 14.2582 26.5 14.7Z" fill="black"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 17.3C5.5 16.8582 5.85817 16.5 6.3 16.5H14.6999H14.7C15.1418 16.5 15.5 16.8582 15.5 17.3L15.4999 17.3126L15.4999 25.7C15.4999 26.1418 15.1417 26.5 14.6999 26.5C14.2581 26.5 13.8999 26.1418 13.8999 25.7L13.8999 19.2376L6.89254 26.245C6.58012 26.5574 6.07359 26.5574 5.76117 26.245C5.44875 25.9325 5.44875 25.426 5.76117 25.1136L12.7748 18.1L6.3 18.1C5.85817 18.1 5.5 17.7418 5.5 17.3Z" fill="black"/>
        </svg>
      </button>
  
      <button class="blog__cta blogSlider__mobileCTA"> 
        Watch the Videos
      </button>
    
      <div class="blogSlider__footer"> 
        <p class="blogSlider__slide-description">
        </p>
  
        <div class="blogSlider__navigation">
          <button class="blogSlider__button prev">
            <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 1L1 8.5L8.5 16" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
  
          <p class="blogSlider__pagination">
            <span class="blogSlider__pagination-current">1</span> of <span class="blogSlider__pagination-total">6</span>
          </p>
  
          <button class="blogSlider__button next">
            <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 1L9 8.5L1.5 16" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
  
        <button class="blogSlider__infoBtn">
          <img src="/icons/info-icon.svg" alt="Info">
        </button>
      </div>
  
      <div class="blogSlider__mobile-description hidden">
        <button class="blogSlider__closeBtn">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="1.13184" width="1.6" height="17.6" rx="0.8" transform="rotate(-45 0 1.13184)" fill="white"/>
            <rect y="12.4453" width="17.6" height="1.6" rx="0.8" transform="rotate(-45 0 12.4453)" fill="white"/>
          </svg>
        </button>
        <p>     
          {{!-- here is the description for mobile - added by js on BlogSlider --}}
        </p>
      </div>
    </div>
      `

      this.slidersSection.innerHTML += html;
    })

    const newSliders = this.slidersSection.querySelectorAll('.blogSlider__container.sliderSection')
    newSliders.forEach((slide, idx) => {
      new BlogSlider({sliderData: data[idx].sliderData, container: slide})
    })


  }

  initScrollAnim(){
    const blackBlockFooter = document.querySelector(".blog__blackBlock-footer");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: blackBlockFooter,
        start: "top 50%",
        toggleActions: "play none play reverse",

      }
    })

    tl.fromTo(blackBlockFooter,{
      y: 25, 
      opacity:0 
    }, {
      y: 0, 
      opacity:1,
      ease: Power3.easeIn,
      duration: 1.5
    })
  }
}

new Blog();