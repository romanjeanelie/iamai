"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _BlogSlider = _interopRequireDefault(require("../components/BlogSlider"));

var _gsap = _interopRequireWildcard(require("gsap"));

var _ScrollTrigger = _interopRequireDefault(require("gsap/ScrollTrigger"));

var _generateSlider = require("../utils/generateSlider");

var _BlogAnimations = require("./BlogAnimations");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var slider1Data = [{
  id: 1,
  video: "https://player.vimeo.com/progressive_redirect/playback/924982744/rendition/720p/file.mp4?loc=external&signature=c55335972741066a22d9cd5365a00153e41eea2cd679367676a90ddd8361f504",
  videoMobile: "https://player.vimeo.com/progressive_redirect/playback/924982589/rendition/720p/file.mp4?loc=external&signature=bed79de08eaae0b9c19e2c8acf024a35be1f25b844ed618588086d8dc5434d2b",
  description: "ChatGPT in action."
}, {
  id: 2,
  image: "/images/blog/slider1-2.png",
  description: "The actual showtimes for Dune 2 at AMC Century City on Saturday March 9th.",
  mobileFormat: true
}, {
  id: 3,
  image: "/images/blog/slider1-3.png",
  description: "The actual showtimes for Dune 2 at AMC Century City on Saturday March 9th.",
  mobileFormat: true
}];
var slider2Data = [{
  id: 1,
  video: "https://dl.dropbox.com/s/gftbpl8lczyg9dvoirjjs/kreyda_alpha_0911-hevc-safari.mp4?rlkey=8v48lqnlbtbe3neg86p02c4p5&dl=0",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit."
}, {
  id: 2,
  video: "https://dl.dropbox.com/s/gftbpl8lczyg9dvoirjjs/kreyda_alpha_0911-hevc-safari.mp4?rlkey=8v48lqnlbtbe3neg86p02c4p5&dl=0",
  description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  mobileFormat: true
}, {
  id: 3,
  video: "https://dl.dropbox.com/s/gftbpl8lczyg9dvoirjjs/kreyda_alpha_0911-hevc-safari.mp4?rlkey=8v48lqnlbtbe3neg86p02c4p5&dl=0",
  description: "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
}];
var data = [{
  h1: "Talk. Not Search.",
  h4: "CO*",
  h4Span: "/’co-star:/",
  p: "Makes information effortless with conversation. Get insightful answers, quick updates and news, all while CO* assists with your daily tasks – your trusted assistant.",
  sliderData: slider2Data
}, {
  h1: "Effortlessly <br class='mobile-break'/> Multilingual.",
  p: "Jump from English to French to German, and back again – even toss in some Mandarin or Hindi – CO* effortlessly keeps up within a single, flowing conversation.",
  sliderData: slider2Data
}, {
  h1: "CO* can see, <br class='mobile-break'/> speak and hear.",
  p: "CO* goes beyond text. It sees (images), hears (your voice), and speaks (respond naturally), providing a truly personalized and intuitive experience.",
  sliderData: slider2Data
}, {
  h1: "CO* get things done.<br/> Like a real assistant.",
  p: "Everyday Efficiency. CO*  takes the hassle out of your life and functions like a proactive assistant who coordinates seamlessly on your behalf.",
  sliderData: slider2Data
}, {
  h1: "Travel Whiz.",
  p: "CO* transforms the hassle of trip planning into a breeze, acting like a dedicated travel agent who understands your needs.",
  sliderData: slider2Data
}, {
  h1: "Entertainment. <br class='mobile-break'/> Your Way.",
  p: "CO* learns your tastes to deliver movie suggestions, reviews, and showtimes that fit your schedule. It can even book tickets for you.",
  sliderData: slider2Data
}, {
  h1: "<span class='first-line'> Powerhouse for Planning.<br/> </span> Research and  <br class='mobile-break'/> Execution. ",
  p: "It gathers information, synthesizes insights, and provides actionable summaries for efficient decision-making.",
  sliderData: slider2Data
}, {
  h1: "E-commerce Reinvented.",
  p: "Ultimate Price Sleuth. Forget scrolling through endless online stores. CO* is your tireless shopping assistant",
  sliderData: slider2Data
}, {
  h1: "Culinary Companion.",
  p: "CO* transforms your kitchen experience. It scans your fridge, offers recipe suggestions based on what you have identifies missing ingredients and suggests the best places to buy them.",
  sliderData: slider2Data
}, {
  h1: "The Multitasking Assistant.<br class='desktop-break'/> Always <br class='mobile-break'/> by Your Side.",
  p: "CO * is your tireless multitasker. It juggles tasks simultaneously, ensuring smooth and efficient completion.",
  sliderData: slider2Data
}]; // TO DO :
// [X] adjust the size of the slider to the new design
// [X] add correct videos to the slider
// [X] handle the marquee;
// [X] add correct logos for the marquee;
// [X] handle the videos (use mobile version when needed)

_gsap["default"].registerPlugin(_ScrollTrigger["default"]);

var Blog =
/*#__PURE__*/
function () {
  function Blog() {
    _classCallCheck(this, Blog);

    // States
    this.animation = null; // DOM Elements

    this.blogLottieAnimation = document.querySelector(".blogHero__lottieAnimation");
    this.blogMarquees = document.querySelectorAll(".blogMarquee__app-marquee");
    this.slidersSection = document.querySelector(".blogSliders__container");
    this.initSliders();
    this.pinNavbar();
    this.initScrollAnims();
    this.playStaticVideosWhenOnScreen();
  }

  _createClass(Blog, [{
    key: "initSliders",
    value: function initSliders() {
      var _this = this;

      var firstSlider = document.querySelector(".blogSlider__container");
      new _BlogSlider["default"]({
        sliderData: slider1Data,
        container: firstSlider,
        differentMobileVersion: true
      });
      if (!this.slidersSection) return;
      data.forEach(function (data, idx) {
        var isOdd = idx % 2 !== 0;
        (0, _generateSlider.generateSliderHeader)(data, isOdd, _this.slidersSection);
      });
      var newSliders = this.slidersSection.querySelectorAll(".blogSlider__container.sliderSection");
      newSliders.forEach(function (slide, idx) {
        new _BlogSlider["default"]({
          sliderData: data[idx].sliderData,
          container: slide
        });
      });
    }
  }, {
    key: "pinNavbar",
    value: function pinNavbar() {
      _ScrollTrigger["default"].create({
        trigger: ".blogNav__container",
        endTrigger: ".blog__footer",
        start: "top top",
        pin: true,
        pinType: "fixed",
        pinSpacing: false,
        end: "top top"
      });
    }
  }, {
    key: "initScrollAnims",
    value: function initScrollAnims() {
      // ---- anim B : Cascading (staggered) Fade in text ----
      (0, _BlogAnimations.cascadingFadeInText)([".blogIntro__container p", ".blogIntro__container h3"]);
      (0, _BlogAnimations.cascadingFadeInText)([".blogMarquee__header", ".blogMarquee__app-marquees", ".blogMarquee__footer"]);
      (0, _BlogAnimations.cascadingFadeInText)(".blogCards__text");

      if (window.innerWidth < 640) {
        var blogVideos = document.querySelectorAll(".blogContent__video");
        blogVideos.forEach(function (video) {
          (0, _BlogAnimations.cascadingFadeInText)(video);
        });
        var blogVideoDescription = document.querySelectorAll(".blogContent__video-description");
        blogVideoDescription.forEach(function (description) {
          var descriptions = description.querySelectorAll("p");
          (0, _BlogAnimations.cascadingFadeInText)(descriptions);
        });
      } else {
        (0, _BlogAnimations.cascadingFadeInText)(".blogContent__video");
        (0, _BlogAnimations.cascadingFadeInText)(".blogContent__video-description");
      }

      (0, _BlogAnimations.cascadingFadeInText)([".blogContent__notChatGpt *"]);
      var sliderSections = document.querySelectorAll(".blogSlider__section");
      sliderSections.forEach(function (section) {
        var paragraph = section.querySelector("p");
        (0, _BlogAnimations.cascadingFadeInText)(paragraph);
      }); // // ---- anim C - Gradient text animation ----

      (0, _BlogAnimations.gradientAnimation)(); // ---- anim D - Black block Animation ----

      var bbIntroducing = document.querySelector(".blog__blackBlock-introducing");
      var bbLogo = document.querySelector(".blog__blackBlock-co");
      var bbFooter = document.querySelector(".blog__blackBlock-footer");
      (0, _BlogAnimations.blackBlockAnimation)(bbIntroducing, bbLogo, bbFooter); // ---- anim D : slides Up animations ----

      var pinkTitle = document.querySelector(".blog__pinkTitle-container h1");
      (0, _BlogAnimations.cascadingFadeInText)(pinkTitle);
      var footerTitle = document.querySelectorAll(".blogSliders__footer");
      footerTitle.forEach(function (title, idx) {
        if (idx === 0) {
          (0, _BlogAnimations.slidesUp)(title);
        } else {
          (0, _BlogAnimations.footerAnimation)(title);
        }
      }); // ---- anim E - Staircase Animation ----

      var blogCards = document.querySelectorAll(".blogCards__card");
      (0, _BlogAnimations.staircaseAnimation)(blogCards);
    }
  }, {
    key: "playStaticVideosWhenOnScreen",
    value: function playStaticVideosWhenOnScreen() {
      // I only target static videos because the sliders are already handled by the BlogSlider class
      var videos = document.querySelectorAll(".static-video"); // Create a callback function to be called when the observed video enters or exits the viewport

      var videoObserverCallback = function videoObserverCallback(entries) {
        entries.forEach(function (entry) {
          // If the observed video is intersecting with the viewport
          if (entry.isIntersecting) {
            // Start playing the video
            entry.target.play();
          } else {
            // Pause the video if it's not intersecting with the viewport
            entry.target.pause();
          }
        });
      }; // Create an Intersection Observer instance with the callback function


      var videoObserver = new IntersectionObserver(videoObserverCallback); // Observe each video element

      videos.forEach(function (video) {
        videoObserver.observe(video);
      });
    }
  }]);

  return Blog;
}();

new Blog();