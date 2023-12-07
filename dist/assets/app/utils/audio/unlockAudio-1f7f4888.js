function unlockAudio() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let buffer = audioContext.createBuffer(1, 1, 22050);
  let source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
  return audioContext;
}
export {
  unlockAudio as default
};
