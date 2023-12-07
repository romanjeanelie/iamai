async function playAudio({ audioUrl, audioContext, onPlay, onEnded }) {
  if (!audioContext) {
    console.warn("AudioContext is not initialized.");
    return;
  }
  let response = await fetch(audioUrl);
  let arrayBuffer = await response.arrayBuffer();
  let audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  let source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  if (typeof onPlay === "function") {
    onPlay();
  }
  source.onended = function() {
    if (typeof onEnded === "function") {
      onEnded();
    }
  };
  source.start(0);
  return source;
}
export {
  playAudio as default
};
