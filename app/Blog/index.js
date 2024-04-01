import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import BlogSlider from "../components/BlogSlider";

import { generateSliderHeader } from "../utils/generateSlider";
import { preloadVideos } from "../utils/preloadVideos";

import {
  blackBlockAnimation,
  cascadingFadeInText,
  footerAnimation,
  gradientAnimation,
  heroAnimation,
  slidesUp,
  staircaseAnimation,
} from "./BlogAnimations";

const isMobile = window.innerWidth < 640;

const heroData = [
  "TLDR",
  "Introducing CO* <br /> World’s First <br /> Personal AI Assistant.",
  "Revolutionise how you <br /> get things done.",
  "CO* converses <br class='mobile-break' /> naturally and <br class='desktop-break' /> tackles real-world tasks like a <br class='desktop-break' /> human assistant.",
  "Get instant answers. <br /> Not search results. ",
  "Experience true multitasking.",
  "CO* effortlessly <br class='sm-mobile-break' /> juggles multiple <br class='desktop-break' /> conversations and <br class='sm-mobile-break' /> tasks <br class='desktop-break' /> maximising <br class='sm-mobile-break' />  your time <br class='desktop-break' /> and efficiency.",
  "CO* speaks over <br /> 100 languages <br class='sm-mobile-break' /> fluently.",
  "Powered by open-source <br class='desktop-break' /> innovation.",
  "Our expert fine-tuning <br class='sm-mobile-break' /> of LaMA <br class='desktop-break' /> 70B  <br class='sm-mobile-break' /> model has <br /> created a powerful <br /> Personal AI Assistant.",
  "With <br /> Advanced planning. Advanced <br class='desktop-break' /> reasoning. Task execution.",
  "CO* tackles <br class='sm-mobile-break' />  complex tasks. <br />  Breaks tasks down. Execute steps. <br /> Adapts on the fly <br class='sm-mobile-break' />  for <br class='desktop-break' /> successful completion.",
  "We all want more <br class='sm-mobile-break' />  time, less hassle.<br /> That's why we <br class='sm-mobile-break' />  created CO*",
  "Personal <br class='sm-mobile-break' />  AI Assistant <br class='sm-mobile-break' />  For Everyone.",
];

const slider1Data = [
  {
    id: 1,
    video:
      "https://player.vimeo.com/progressive_redirect/playback/924982744/rendition/720p/file.mp4?loc=external&signature=c55335972741066a22d9cd5365a00153e41eea2cd679367676a90ddd8361f504",
    videoMobile:
      "https://player.vimeo.com/progressive_redirect/playback/924982589/rendition/720p/file.mp4?loc=external&signature=bed79de08eaae0b9c19e2c8acf024a35be1f25b844ed618588086d8dc5434d2b",
    description: "ChatGPT in action.",
  },
  {
    id: 2,
    image: "/images/blog/slider1-2.png",
    description: "The actual showtimes for Dune 2 at AMC Century City on Saturday March 9th.",
    mobileFormat: true,
  },
  {
    id: 3,
    image: "/images/blog/slider1-3.png",
    description: "The actual showtimes for Dune 2 at AMC Century City on Saturday March 9th.",
    mobileFormat: true,
  },
];

const slider2Data = [
  {
    id: 1,
    video:
      "https://dl.dropbox.com/s/gftbpl8lczyg9dvoirjjs/kreyda_alpha_0911-hevc-safari.mp4?rlkey=8v48lqnlbtbe3neg86p02c4p5&dl=0",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
  },
  {
    id: 2,
    video:
      "https://dl.dropbox.com/s/gftbpl8lczyg9dvoirjjs/kreyda_alpha_0911-hevc-safari.mp4?rlkey=8v48lqnlbtbe3neg86p02c4p5&dl=0",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    mobileFormat: true,
  },
  {
    id: 3,
    video:
      "https://dl.dropbox.com/s/gftbpl8lczyg9dvoirjjs/kreyda_alpha_0911-hevc-safari.mp4?rlkey=8v48lqnlbtbe3neg86p02c4p5&dl=0",
    description:
      "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
  },
];

const data = [
  {
    h1: "Talk. Not Search.",
    h4: "CO*",
    h4Span: "/’co-star:/",
    p: "Makes information effortless with conversation. Get insightful answers, quick updates and news, all while CO* assists with your daily tasks – your trusted assistant.",
    sliderData: slider2Data,
  },
  {
    h1: "Effortlessly <br class='mobile-break'/> Multilingual.",
    p: "Jump from English to French to German, and back again – even toss in some Mandarin or Hindi – CO* effortlessly keeps up within a single, flowing conversation.",
    sliderData: slider2Data,
  },
  {
    h1: "CO* can see, <br class='mobile-break'/> speak and hear.",
    p: "CO* goes beyond text. It sees (images), hears (your voice), and speaks (respond naturally), providing a truly personalized and intuitive experience.",
    sliderData: slider2Data,
  },
  {
    h1: "CO* gets things done.<br/> Like a real assistant.",
    p: "Everyday Efficiency. CO*  takes the hassle out of your life and functions like a proactive assistant who coordinates seamlessly on your behalf.",
    sliderData: slider2Data,
  },
  {
    h1: "Travel Whiz.",
    p: "CO* transforms the hassle of trip planning into a breeze, acting like a dedicated travel agent who understands your needs.",
    sliderData: slider2Data,
  },
  {
    h1: "Entertainment. <br class='mobile-break'/> Your Way.",
    p: "CO* learns your tastes to deliver movie suggestions, reviews, and showtimes that fit your schedule. It can even book tickets for you.",
    sliderData: slider2Data,
  },
  {
    h1: "<span class='first-line'> Powerhouse for Planning.<br/> </span> Research and  <br class='mobile-break'/> Execution. ",
    p: "It gathers information, synthesizes insights, and provides actionable summaries for efficient decision-making.",
    sliderData: slider2Data,
  },
  {
    h1: "E-commerce Reinvented.",
    p: "Ultimate Price Sleuth. Forget scrolling through endless online stores. CO* is your tireless shopping assistant",
    sliderData: slider2Data,
  },
  {
    h1: "Culinary Companion.",
    p: "CO* transforms your kitchen experience. It scans your fridge, offers recipe suggestions based on what you have identifies missing ingredients and suggests the best places to buy them.",
    sliderData: slider2Data,
  },
  {
    h1: "The Multitasking Assistant.<br class='desktop-break'/> Always <br class='mobile-break'/> by Your Side.",
    p: "CO * is your tireless multitasker. It juggles tasks simultaneously, ensuring smooth and efficient completion.",
    sliderData: slider2Data,
  },
];

const videoData = [
  isMobile
    ? "https://player.vimeo.com/progressive_redirect/playback/924947253/rendition/540p/file.mp4?loc=external&signature=1ac3b9615414a3836482d3065790a9f4477d850995f5d7e54d32f81d2cec1a43"
    : "https://player.vimeo.com/progressive_redirect/playback/924947288/rendition/720p/file.mp4?loc=external&signature=ab23a22926dedd5ed226323655c0b85676d3a4856746fe10aef74fb1552eaafe",
  isMobile
    ? "https://player.vimeo.com/progressive_redirect/playback/924982717/rendition/480p/file.mp4?loc=external&signature=8619fc24410a36d101d0290fb232f644ae087db9bb47dd7f6673e85b92b4a633"
    : "https://player.vimeo.com/progressive_redirect/playback/924982649/rendition/360p/file.mp4?loc=external&signature=238d6fa86e19d03bb6b6a4ac9b4c92c64eb1ee769062b1b0d4435370d645e9f3",
  isMobile
    ? "https://player.vimeo.com/progressive_redirect/playback/924982682/rendition/480p/file.mp4?loc=external&signature=1aef2b4018851aa08562e87b014b6abd6fbdbebdef849a05edcf59f1b64db3f5"
    : "https://player.vimeo.com/progressive_redirect/playback/924982615/rendition/360p/file.mp4?loc=external&signature=ab8215600529b576ca8efa77be6acb4aa0ea78dcc8d2b11b17bfa0961caa68ca",
];

gsap.registerPlugin(ScrollTrigger);

class Blog {
  constructor() {
    // States
    this.animation = null;

    // DOM Elements
    this.heroContainer = document.querySelector(".blogHero__container");
    this.blogLottieAnimation = document.querySelector(".blogHero__lottieAnimation");
    this.blogMarquees = document.querySelectorAll(".blogMarquee__app-marquee");
    this.slidersSection = document.querySelector(".blogSliders__container");
    this.preloader = document.querySelector(".blog__preload");

    this.initHeroSections();
    this.pinNavbar();
    this.initSliders();
    this.initScrollAnims();
    this.playStaticVideosWhenOnScreen();

    // this.preloadStaticVideos();

    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      duration: 0,
    });

    this.preloader.style.display = "none";
  }

  initHeroSections() {
    heroData.forEach((data, idx) => {
      const firstItem = idx === 0;
      const isMobile = window.innerWidth < 640;

      // create the hero section
      const container = document.createElement("div");
      container.className = `blogHero__section ${firstItem && "first-section"}`;
      const text = document.createElement("h1");
      text.innerHTML = data;

      // append items
      container.appendChild(text);
      this.heroContainer.appendChild(container);
      heroAnimation(container, text, firstItem);
    });

    const pinSpacer = document.createElement("div");
    pinSpacer.style.height = "80vh";

    this.heroContainer.appendChild(pinSpacer);
  }

  initSliders() {
    const firstSlider = document.querySelector(".blogSlider__container");
    new BlogSlider({ sliderData: slider1Data, container: firstSlider, differentMobileVersion: true });

    if (!this.slidersSection) return;
    data.forEach((data, idx) => {
      const isOdd = idx % 2 !== 0;
      generateSliderHeader(data, isOdd, this.slidersSection);
    });

    const newSliders = this.slidersSection.querySelectorAll(".blogSlider__container.sliderSection");
    newSliders.forEach((slide, idx) => {
      new BlogSlider({ sliderData: data[idx].sliderData, container: slide });
    });
  }

  pinNavbar() {
    ScrollTrigger.create({
      trigger: ".blogNav__container",
      endTrigger: ".blog__footer",
      start: "top top",
      pin: true,
      pinType: "fixed",
      pinSpacing: false,
      end: "top top",
    });
  }

  initScrollAnims() {
    // ---- anim B : Cascading (staggered) Fade in text ----
    cascadingFadeInText([".blogIntro__container p", ".blogIntro__container h3"]);
    cascadingFadeInText([".blogMarquee__header", ".blogMarquee__app-marquees", ".blogMarquee__footer"]);
    cascadingFadeInText(".blogCards__text");

    if (window.innerWidth < 640) {
      const blogVideos = document.querySelectorAll(".blogContent__video");
      blogVideos.forEach((video) => {
        cascadingFadeInText(video);
      });
      const blogVideoDescription = document.querySelectorAll(".blogContent__video-description");
      blogVideoDescription.forEach((description) => {
        const descriptions = description.querySelectorAll("p");
        cascadingFadeInText(descriptions);
      });
    } else {
      cascadingFadeInText(".blogContent__video");
      cascadingFadeInText(".blogContent__video-description");
    }

    cascadingFadeInText([".blogContent__notChatGpt *"]);

    const sliderSections = document.querySelectorAll(".blogSlider__section");
    sliderSections.forEach((section) => {
      const paragraph = section.querySelector("p");
      cascadingFadeInText(paragraph);
    });

    // // ---- anim C - Gradient text animation ----
    gradientAnimation();

    // ---- anim D - Black block Animation ----
    const bbIntroducing = document.querySelector(".blog__blackBlock-introducing");
    const bbLogo = document.querySelector(".blog__blackBlock-co");
    const bbFooter = document.querySelector(".blog__blackBlock-footer");
    blackBlockAnimation(bbIntroducing, bbLogo, bbFooter);

    // ---- anim D : slides Up animations ----
    const pinkTitle = document.querySelector(".blog__pinkTitle-container h1");
    cascadingFadeInText(pinkTitle);
    const footerTitle = document.querySelectorAll(".blogSliders__footer");
    footerTitle.forEach((title, idx) => {
      if (idx === 0) {
        slidesUp(title);
      } else {
        footerAnimation(title);
      }
    });

    // ---- anim E - Staircase Animation ----
    const blogCards = document.querySelectorAll(".blogCards__card");
    staircaseAnimation(blogCards);
  }

  playStaticVideosWhenOnScreen() {
    // I only target static videos because the sliders are already handled by the BlogSlider class
    const videos = document.querySelectorAll(".static-video");
    // Create a callback function to be called when the observed video enters or exits the viewport
    const videoObserverCallback = (entries) => {
      entries.forEach((entry) => {
        // If the observed video is intersecting with the viewport
        if (entry.isIntersecting) {
          // Start playing the video
          entry.target.play();
        } else {
          // Pause the video if it's not intersecting with the viewport
          entry.target.pause();
        }
      });
    };

    // Create an Intersection Observer instance with the callback function
    const videoObserver = new IntersectionObserver(videoObserverCallback);

    // Observe each video element
    videos.forEach((video) => {
      videoObserver.observe(video);
    });
  }

  preloadStaticVideos() {
    preloadVideos(videoData, { onComplete: () => console.log("All videos preloaded") });
  }
}

new Blog();
