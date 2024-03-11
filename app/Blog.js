import BlogSlider from "./components/BlogSlider";
import gsap, { Power3 } from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import generateSlider from "./utils/generateSlider";

const slider1Data = [
  {
    id:1,
    video: '/videos/blog/Desktop_Zoom_In_ChatGPT.mp4',
    videoMobile: '/videos/blog/Mobile_Zoom_In_ChatGPT.mp4',
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
    video: '/placeholder/placeholder.mp4',
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
    h1: "Talk. Not Search.",
    h4: "CO*",
    h4Span: "/’co-star:/",
    p: "Makes information effortless with conversation. Get insightful answers, quick updates and news, all while CO* assists with your daily tasks – your trusted assistant.",
    sliderData: slider2Data
  },
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
    h1: "CO* get things done.<br/> Like a real assistant.",
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
    h1: "Powerhouse for Planning.<br/> Research and Execution.",
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
    h1: "The Multitasking Assistant.<br/> Always by Your Side.",
    p: "CO * is your tireless multitasker. It juggles tasks simultaneously, ensuring smooth and efficient completion.",
    sliderData : slider2Data
  },
]

// TO DO : 
// [X] adjust the size of the slider to the new design
// [X] add correct videos to the slider
// [X] handle the marquee;
// [] add correct logos for the marquee;
// [X] handle the videos (use mobile version when needed)

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
    const firstSlider = document.querySelector('.blogSlider__container');
    new BlogSlider({sliderData: slider1Data, container: firstSlider})

    if (!this.slidersSection) return
    data.forEach((data, idx) => {
      const isOdd = idx % 2 !== 0;
      generateSlider(data, isOdd, this.slidersSection)
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
        trigger: ".blog__blackBlock-content",
        start: "top top",
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