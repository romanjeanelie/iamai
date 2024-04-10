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
// [X] hide the tryCoStar button when on highlight video + any of the sliders
// [X] add a mute / unmute btn to the videos
// [X] link it to them all
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
        this.navbar.classList.add("hidden");
      },
      onEnterBack: () => {
        this.navbar.classList.add("hidden");
        playVideo();
      },
      onLeave: () => {
        this.navbar.classList.remove("hidden");
        pauseVideo();
      },
      onLeaveBack: () => {
        this.navbar.classList.remove("hidden");
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
      unmuteButton.classList = "blog__unmute-btn muted";

      // Create an image element
      const muteIcon = `
        <svg width="27" height="20" viewBox="0 0 27 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.8142 0.140373C13.3291 -0.0945108 12.7525 -0.0309582 12.3302 0.303514L5.8757 5.41101H1.4057C0.629305 5.41101 0 6.03998 0 6.81638V13.1835C0 13.9595 0.629305 14.5885 1.4057 14.5885H5.8757L12.3302 19.6963C12.5835 19.8965 12.8914 20 13.203 20C13.411 20 13.62 19.9528 13.8149 19.8595C14.3004 19.6246 14.6083 19.1325 14.6083 18.5943V1.40553C14.608 0.866645 14.2997 0.374601 13.8142 0.140373Z" fill="#959491"/>
          <path d="M26.5741 6.42936C26.0251 5.88032 25.1357 5.88032 24.5869 6.42936L23.004 8.01229L21.4211 6.42936C20.8721 5.88032 19.9813 5.88032 19.4333 6.42936C18.8842 6.97841 18.8842 7.86847 19.4333 8.41686L21.0159 9.99979L19.4329 11.5821C18.8846 12.1321 18.8846 13.0215 19.4329 13.5696C19.7075 13.8447 20.0678 13.982 20.4265 13.982C20.7869 13.982 21.1462 13.8444 21.4214 13.5696L23.0037 11.9873L24.586 13.5696C24.8605 13.8444 25.2208 13.9813 25.5796 13.9813C25.9399 13.9813 26.2993 13.8444 26.5738 13.5696C27.1228 13.0212 27.1228 12.1311 26.5738 11.5821L24.9912 9.99979L26.5741 8.41719C27.1235 7.86815 27.1235 6.97808 26.5741 6.42936Z" fill="#959491"/>
        </svg>
      `;

      const unmuteIcon = `
        <svg width="27" height="20" viewBox="0 0 27 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.8146 0.140373C13.3297 -0.0945108 12.7532 -0.0309582 12.3309 0.303514L5.87635 5.41101H1.4057C0.629632 5.41101 0 6.03998 0 6.81638V13.1835C0 13.9595 0.629632 14.5885 1.4057 14.5885H5.87602L12.3309 19.6963C12.5841 19.8965 12.8921 20 13.203 20C13.4116 20 13.62 19.9528 13.8146 19.8595C14.3007 19.6246 14.6086 19.1325 14.6086 18.5943V1.40553C14.608 0.866645 14.2997 0.374601 13.8146 0.140373Z" fill="black"/>
          <path d="M19.772 5.02384C19.223 4.4748 18.3329 4.4748 17.7848 5.02384C17.2358 5.57289 17.2358 6.46296 17.7848 7.01102C19.4323 8.65881 19.4323 11.3401 17.7848 12.9879C17.2358 13.5367 17.2358 14.4267 17.7848 14.9748C18.0587 15.25 18.419 15.3872 18.7784 15.3872C19.1388 15.3872 19.4975 15.25 19.772 14.9748C21.1017 13.6451 21.8335 11.879 21.8335 9.99932C21.8335 8.11992 21.1007 6.35256 19.772 5.02384Z" fill="black"/>
          <path d="M21.4289 1.37943C20.8805 1.92848 20.8805 2.81855 21.4289 3.36726C25.0861 7.02418 25.0861 12.9746 21.4289 16.6315C20.8805 17.1802 20.8805 18.0706 21.4289 18.6186C21.7034 18.8932 22.0631 19.0304 22.4225 19.0304C22.7828 19.0304 23.1422 18.8932 23.4167 18.6186C28.1694 13.8659 28.1694 6.13116 23.4167 1.37845C22.868 0.831043 21.9779 0.831043 21.4289 1.37943Z" fill="black"/>
        </svg>
      `;

      // Append the image to the button
      unmuteButton.innerHTML = muteIcon;

      // Get the video element within the container
      const video = container.querySelector("video");

      // Attach click event listener to the button
      unmuteButton.addEventListener("click", () => {
        // Toggle the mute state of the video
        video.muted = !video.muted;

        // Update button text based on mute state
        if (video.muted) {
          unmuteButton.classList.add("muted");
          unmuteButton.innerHTML = muteIcon;
        } else {
          unmuteButton.classList.remove("muted");
          unmuteButton.innerHTML = unmuteIcon;
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
