"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = unlockAudio;

function unlockAudio() {
  try {
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var buffer = audioContext.createBuffer(1, 1, 22050);
    var source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
    return audioContext;
  } catch (error) {
    console.error("Error unlocking audio context", error);
  }
}