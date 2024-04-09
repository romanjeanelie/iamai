import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import BlogSlider from "../components/BlogSlider";

import { generateSliderHeader } from "../utils/generateSlider";

import { heroData, slider1Data, data } from "./BlogData";
import {
  blackBlockAnimation,
  cascadingFadeInText,
  footerAnimation,
  gradientAnimation,
  heroAnimation,
  slidesUp,
  staircaseAnimation,
} from "./BlogAnimations";

// TO DO
// [X] block the video when scroll past it
// [X] add the unmute/mute button to the video
// [X] push the tryCoStart Button after the clock video
// [] hide the tryCoStar button when on highlight video + any of the sliders
// [] add a mute / unmute btn to the videos
// [] link it to them all
// [] compress the too large size videos
// [] upload them to cloudinary
// [] manage all the videos in the blog page

gsap.registerPlugin(ScrollTrigger);

class Blog {
  constructor() {
    // States
    this.animation = null;
    this.isMobile = window.innerWidth < 820;

    // DOM Elements
    this.navbar = document.querySelector("nav");
    this.heroContainer = document.querySelector(".blogHero__container");
    this.blogLottieAnimation = document.querySelector(".blogHero__lottieAnimation");
    this.blogMarquees = document.querySelectorAll(".blogMarquee__app-marquee");
    this.slidersSection = document.querySelector(".blogSliders__container");
    this.preloader = document.querySelector(".blog__preload");
    this.blogAssistantSection = document.querySelector(".blog__assistantVideo-container");
    this.unmuteBtn = document.querySelector(".blog__assistantVideo-muteBtn");

    this.initHeroSections();
    this.pinNavbar();
    this.initSliders();
    this.initAssistantVideoAnim();
    this.initScrollAnims();
    this.playStaticVideosWhenOnScreen();
    this.initUnmuteBtns();
    this.addEvents();

    ScrollTrigger.refresh();

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

  toggleNavbar() {
    this.navbar.classList.toggle("hidden");
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

  initAssistantVideoAnim() {
    const title = this.blogAssistantSection.querySelector("h1");
    const videos = this.blogAssistantSection.querySelectorAll("video");
    const videoDesktop = this.blogAssistantSection.querySelector(".desktop-video");
    const videoMobile = this.blogAssistantSection.querySelector(".mobile-video");

    const pauseVideo = () => {
      videoDesktop.pause();
      videoMobile.pause();
    };

    const playVideo = () => {
      videoDesktop.play();
      videoMobile.play();
    };

    gsap.set(title, { opacity: 0, y: 20 });
    gsap.set(videos, { opacity: 0.5 });

    ScrollTrigger.create({
      trigger: this.blogAssistantSection,
      top: "top top",
      end: "bottom center",
      pin: true,
    });

    ScrollTrigger.create({
      trigger: this.blogAssistantSection,
      top: "top 5%",
      end: "bottom+=50% top",
      onEnter: () => {
        this.toggleNavbar();
      },
      onEnterBack: () => {
        this.toggleNavbar();
        playVideo();
      },
      onLeave: () => {
        this.toggleNavbar();
        pauseVideo();
      },
      onLeaveBack: () => {
        this.toggleNavbar();
      },
    });

    // title animation
    gsap.fromTo(
      title,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: this.blogAssistantSection,
          start: "top 30%",
          end: "top 5%",
          toggleActions: "play none play reverse ",
          onLeave: () => {
            gsap.to(title, { opacity: 0, y: -20 });
            gsap.to(videos, { opacity: 1 });
            videoDesktop?.play();
            videoMobile?.play();
          },
          onEnterBack: () => {
            gsap.to(title, { opacity: 1, y: 0 });
            gsap.to(videos, { opacity: 0.5 });
            videoDesktop?.pause();
            videoMobile?.pause();
          },
        },
      }
    );

    // // handle the unmute button
    // this.unmuteBtn.addEventListener("click", () => {
    //   if (videoDesktop.muted) {
    //     videoDesktop.muted = this.isMobile ? true : false;
    //     videoMobile.muted = this.isMobile ? false : true;
    //     this.unmuteBtn.innerHTML = "Mute";
    //   } else {
    //     videoDesktop.muted = true;
    //     videoMobile.muted = true;
    //     this.unmuteBtn.innerHTML = "Unmute";
    //   }
    // });
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

  initUnmuteBtns() {
    // Select all the .video-container elements
    const videoContainers = document.querySelectorAll(".video-container");

    // Iterate over each .video-container
    videoContainers.forEach((container) => {
      // Create a button element
      const unmuteButton = document.createElement("button");
      unmuteButton.classList.add("blog__unmute-btn");

      // Create an image element
      const iconImg = document.createElement("img");
      iconImg.src = "/public/icons/unmute-icon.svg";
      iconImg.alt = "unmute icon";

      // Append the image to the button
      unmuteButton.appendChild(iconImg);

      // Get the video element within the container
      const video = container.querySelector("video");

      // Attach click event listener to the button
      unmuteButton.addEventListener("click", () => {
        // Toggle the mute state of the video
        video.muted = !video.muted;

        // Update button text based on mute state
        if (video.muted) {
          iconImg.src = "/public/icons/unmute-icon.svg";
          iconImg.alt = "unmute icon";
        } else {
          iconImg.src = "/public/icons/mute-icon.svg";
          iconImg.alt = "mute icon";
        }
      });

      // Append the button to the .video-container
      container.appendChild(unmuteButton);
    });
  }

  addEvents() {
    window.addEventListener("resize", () => {
      this.isMobile = window.innerWidth < 820;
    });
  }
}

new Blog();
