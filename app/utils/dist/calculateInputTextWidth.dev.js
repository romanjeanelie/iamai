"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateInputTextWidth = void 0;

var calculateInputTextWidth = function calculateInputTextWidth(input) {
  // Create a hidden div with the same styles as the textarea
  var hiddenDiv = document.createElement("div");
  hiddenDiv.style.position = "absolute";
  hiddenDiv.style.whiteSpace = "pre";
  hiddenDiv.style.visibility = "hidden";
  hiddenDiv.style.font = getComputedStyle(input).font;
  hiddenDiv.style.letterSpacing = getComputedStyle(input).letterSpacing;
  hiddenDiv.style.padding = getComputedStyle(input).padding; // Copy the text content

  hiddenDiv.textContent = input.value; // Append the hidden div to the body to calculate the width

  document.body.appendChild(hiddenDiv);
  var textWidth = hiddenDiv.clientWidth; // Remove the hidden div after calculation

  document.body.removeChild(hiddenDiv);
  return textWidth;
};

exports.calculateInputTextWidth = calculateInputTextWidth;