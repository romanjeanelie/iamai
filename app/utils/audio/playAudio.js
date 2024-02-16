export default async function playAudio({ audioUrl, audioContext, onPlay, onEnded }) {
  if (!audioContext) {
    console.warn("AudioContext is not initialized.");
    return;
  }

  let response = await fetch(audioUrl);
  if (!response.ok) {
    console.error(`Network response was not ok for url: ${audioUrl}`);
    return;
  }

  let arrayBuffer = await response.arrayBuffer();
  try {
    let audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    let source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    // Call the onPlay callback function
    if (typeof onPlay === "function") {
      onPlay();
    }

    // Set the onended event handler
    source.onended = function () {
      if (typeof onEnded === "function") {
        onEnded();
      }
    };

    source.start(0);
    return source;
  } catch (err) {
    console.error(`Failed to decode audio data for url: ${audioUrl}`, err);
  }
}
