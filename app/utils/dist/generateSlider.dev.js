"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateSlider = generateSlider;
exports.generateSliderHeader = generateSliderHeader;

function generateSlider(container) {
  var html = "\n    <div class=\"blogSlider__slides-container no-scrollbar\">\n    </div>\n\n    <div class=\"blogSlider__footer\"> \n      <p class=\"blogSlider__slide-description\">\n      </p>\n\n      <div class=\"blogSlider__navigation\">\n        <button class=\"blogSlider__button prev\">\n          <svg width=\"10\" height=\"17\" viewBox=\"0 0 10 17\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n            <path d=\"M8.5 1L1 8.5L8.5 16\" stroke=\"black\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n          </svg>\n        </button>\n\n        <p class=\"blogSlider__pagination\">\n          <span class=\"blogSlider__pagination-current\">1</span> of <span class=\"blogSlider__pagination-total\">6</span>\n        </p>\n\n        <button class=\"blogSlider__button next\">\n          <svg width=\"10\" height=\"17\" viewBox=\"0 0 10 17\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n            <path d=\"M1.5 1L9 8.5L1.5 16\" stroke=\"black\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n          </svg>\n        </button>\n      </div>\n\n      <button class=\"blogSlider__infoBtn\">\n        <img src=\"/icons/info-icon.svg\" alt=\"Info\">\n      </button>\n    </div>\n\n    <div class=\"blogSlider__mobile-description hidden\">\n      <button class=\"blogSlider__closeBtn\">\n        <svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n          <rect y=\"1.13184\" width=\"1.6\" height=\"17.6\" rx=\"0.8\" transform=\"rotate(-45 0 1.13184)\" fill=\"white\"/>\n          <rect y=\"12.4453\" width=\"17.6\" height=\"1.6\" rx=\"0.8\" transform=\"rotate(-45 0 12.4453)\" fill=\"white\"/>\n        </svg>\n      </button>\n      <p></p>\n    </div>\n  ";
  container.innerHTML += html;
}

function generateSliderHeader(data, isOdd, container) {
  if (data.h1 === "The Multitasking Assistant.<br/> Always by Your Side.") isOdd = false;
  var html = "\n    <div class=\"blogSlider__section\">\n      <div class=\"blog__container\">\n        <div class=\"blogSlider__header\">\n          <h1 class=\"".concat(isOdd && "centered", "\" >").concat(data.h1, "</h1>\n          ").concat(data.h4 ? "<h4>".concat(data.h4, " <span> ").concat(data.h4Span, " </span></h4>") : "", "\n          <p class=\"").concat(isOdd && "centered", "\" >").concat(data.p, "</p>\n        </div>\n      </div>\n\n      <div class=\"blogSlider__container sliderSection\">\n\n      </div>\n    </div>\n  ");
  container.innerHTML += html;
}