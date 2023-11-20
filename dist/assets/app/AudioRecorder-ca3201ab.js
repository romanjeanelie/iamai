class AudioRecorder {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.gumStream = null;
    this.recorder = null;
    this.input = null;
    this.audioContext = window.AudioContext || window.webkitAudioContext;
    this.encodingType = "mp3";
    this.audioContext = new this.audioContext();
  }
  startRecording() {
    const constraints = { audio: true, video: false };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      this.gumStream = stream;
      this.input = this.audioContext.createMediaStreamSource(stream);
      this.recorder = new WebAudioRecorder(this.input, {
        workerDir: "./libAudioRecorder/",
        encoding: this.encodingType,
        numChannels: 2,
        onEncoderLoading: (recorder, encoding) => {
        },
        onEncoderLoaded: (recorder, encoding) => {
        }
      });
      this.recorder.onComplete = (recorder, blob) => {
        console.log("Encoding complete");
        this.blob = blob;
        this.createDownloadLink(blob, recorder.encoding);
        this.callbacks.onComplete(blob);
      };
      this.recorder.setOptions({
        timeLimit: 120,
        encodeAfterRecord: true,
        ogg: { quality: 0.5 },
        mp3: { bitRate: 160 }
      });
      this.recorder.startRecording();
      console.log("Recording started");
    }).catch((err) => {
      console.log(err);
    });
  }
  onUpdate(callback) {
    function updateTime() {
      const sec = this.recorder.recordingTime() | 0;
      callback(sec);
    }
    this.timeInterval = window.setInterval(updateTime.bind(this), 200);
  }
  stopRecording() {
    this.gumStream.getAudioTracks()[0].stop();
    this.recorder.finishRecording();
    clearInterval(this.timeInterval);
    console.log("Recording stopped");
  }
  createDownloadLink(blob, encoding) {
    const audioUrl = URL.createObjectURL(blob);
    const au = document.createElement("audio");
    const audioLink = document.createElement("a");
    au.controls = true;
    au.src = audioUrl;
    audioLink.href = audioUrl;
    audioLink.download = (/* @__PURE__ */ new Date()).toISOString() + "." + encoding;
  }
}
export {
  AudioRecorder as default
};
