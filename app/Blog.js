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

    this.initLottieAnim();
    this.initSliders();
    this.initScrollAnim();
  }

  initLottieAnim(){
    // this.animation = lottie.loadAnimation({
    //   container: this.blogLottieAnimation,
    //   renderer: 'svg',
    //   loop: true,
    //   autoplay: false,
    //   path: '../animations/asterism_to_asterisk_black.json'
    // });

    // this.animation.play();
  }

  initSliders() {
    const slidersData = [slider1Data, slider2Data];
    const sliders = document.querySelectorAll('.blogSlider__container');
    sliders.forEach((slider, idx) => {
      new BlogSlider({sliderData: slidersData[idx], container: slider})
    });
  }

  initScrollAnim(){
    const blackBlockFooter = document.querySelector(".blog__blackBlock-footer");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: blackBlockFooter,
        start: "top 75%",
      }
    })

    tl.fromTo(blackBlockFooter,{
      y: 25, 
      opacity:0 
    }, {
      y: 0, 
      opacity:1,
      ease: Power3.easeOut,
      duration: 2
    })
  }
}

new Blog();