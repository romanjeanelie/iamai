export default class AudioPlayer {
  constructor({ audioContext, audioUrl, onPlay, onEnded, loop = false }) {
    this.audioContext = audioContext;
    this.audioUrl = audioUrl;
    this.onPlay = onPlay;
    this.onEnded = onEnded;
    this.loop = loop;
    this.currentAudioPlaying = null;
    this.startTime = 0;
    this.startOffset = 0;
    this.isPaused = false;
  }

  async playAudio() {
    try {
      let response = await fetch(this.audioUrl).catch(err => console.error("from playAudio :", err));
      if (response.url.includes("undefined")){
        throw new Error("URL is undefined");
      }
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      let arrayBuffer = await response.arrayBuffer();
      let audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

  
      this.currentAudioPlaying = this.audioContext.createBufferSource();
      this.currentAudioPlaying.buffer = audioBuffer;
      this.currentAudioPlaying.connect(this.audioContext.destination);
      this.currentAudioPlaying.loop = this.loop;
      this.startTime = this.audioContext.currentTime;
      this.currentAudioPlaying.start(0, this.startOffset % audioBuffer.duration);
  
      if (typeof this.onPlay === "function") {
        this.onPlay();
      }
  
      this.currentAudioPlaying.onended = () => {
        if (typeof this.onEnded === "function") {
          if (this.isPaused) return;
          this.onEnded();
        }
      };
    } catch (err) {
      console.error("error from play audio : ", err);
      if (typeof this.onEnded === "function") {
        if (this.isPaused) return;
        this.onEnded();
      }
    }
  }

  pauseAudio() {
    this.isPaused = true;
    if (this.currentAudioPlaying) {
      console.log("pause");
      this.currentAudioPlaying.stop();
      // Measure how much time passed since the last pause.
      this.startOffset += this.audioContext.currentTime - this.startTime;
      this.currentAudioPlaying = null;
    }
  }

  resumeAudio() {
    this.isPaused = false;
    this.playAudio();
  }

  stopAudio() {
    if (!this.currentAudioPlaying) return;
    this.currentAudioPlaying.stop();
    this.currentAudioPlaying = null;
  }
}
