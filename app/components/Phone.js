import sendToWispher from "../utils/audio/sendToWhisper";
import float32ArrayToMp3Blob from "../utils/audio/float32ArrayToMp3Blob";
import htmlToText from "../utils/htmlToText";
import textToSpeech from "../utils/textToSpeech";
import downloadAudio from "../utils/audio/downloadAudio";

export default class Phone {
  constructor({ anims, pageEl, discussion }) {
    // DOM Elements
    this.discussion = discussion;
    this.pageEl = pageEl;
    this.phoneContainer = this.pageEl.querySelector(".phone__container");
    this.phoneBtn = this.pageEl.querySelector(".phone-btn");
    this.infoText = this.phoneContainer.querySelector(".phone__info");
    this.pauseBtn = this.phoneContainer.querySelector(".phone__pause");
    this.closeBtn = this.phoneContainer.querySelector(".phone__close");

    this.anims = anims;

    this.isActive = false;
    this.myvad = null;
    // AI
    this.currentIndexAudioAI = null;
    this.audioAI = null;
    this.audiosAI = [];
    this.isAITalking = false;
    this.isAIPaused = false;
    // Mic
    this.isMicMuted = false;
    this.micAccessConfirmed = false;

    this.onClickOutside = {
      resumeAI: false,
      unmuteMic: false,
    };

    this.addListeners();
  }

  startConnecting() {
    console.log("connecting");
    this.infoText.textContent = "connecting";
  }

  leave() {
    this.isActive = false;
    this.discussion.off("addAIText");

    this.stopRecording();
    this.stopAITalking();
  }

  connected() {
    console.log("connected");
    this.infoText.textContent = "connected";
    this.startListening();
  }

  startListening() {
    this.discussion.on("addAIText", (aiAnswer) => this.startAITalking(aiAnswer));
    console.log("Talk to me");
    this.infoText.textContent = "Talk to me";
    if (this.myvad) this.myvad.start();
  }

  startUserTalking() {
    console.log("I'm listening");
    this.infoText.textContent = "I'm listening";
  }

  async startProcessing(audio) {
    this.myvad.pause();
    console.log("processing");
    this.infoText.textContent = "processing";

    const blob = float32ArrayToMp3Blob(audio, 16000);
    this.textRecorded = await sendToWispher(blob);
    this.discussion.addUserElement({ text: this.textRecorded });
  }

  async startAITalking(html) {
    if (!this.isActive) return;
    console.log("new AIAnswer");
    const audio = await textToSpeech(htmlToText(html));
    this.audiosAI.push(audio);

    if (this.currentIndexAudioAI === null) {
      console.log("First sound");
      this.currentIndexAudioAI = 0;
      this.audiosAI[this.currentIndexAudioAI].play();
    }

    this.audiosAI[this.currentIndexAudioAI].onplay = () => {
      this.isAITalking = true;
      this.infoText.textContent = "Click to interrupt";
    };

    this.audiosAI[this.currentIndexAudioAI].onended = () => {
      this.currentIndexAudioAI++;
      if (this.audiosAI[this.currentIndexAudioAI]) {
        console.log("Stil one sound");
        this.audiosAI[this.currentIndexAudioAI].play();
      } else {
        console.log("all sounds plaid");
        this.currentIndexAudioAI = 0;
        this.isAITalking = false;
        this.startListening();
      }
    };
  }

  stopAITalking() {
    console.log("stop talking");
    this.audiosAI.forEach((audio) => {
      audio.pause();
    });
    this.audiosAI = [];
    this.currentIndexAudioAI = null;
    this.isAITalking = false;
  }

  async startRecording() {
    this.isActive = true;

    if (!this.micAccessConfirmed) {
      this.startConnecting();
    } else {
      this.startListening();
    }

    if (!this.myvad) {
      this.myvad = await vad.MicVAD.new({
        onFrameProcessed: (frame) => {
          if (!this.micAccessConfirmed) {
            this.micAccessConfirmed = true;
            this.connected();
          }
        },
        onSpeechStart: () => {
          this.startUserTalking();
        },
        onSpeechEnd: (audio) => {
          this.startProcessing(audio);
        },
      });
    }
    this.myvad.start();
  }

  stopRecording() {
    this.myvad.pause();
    this.myvad.stream.getTracks().forEach((track) => {
      track.stop();
    });
    this.myvad = null;
  }

  async onCompleteRecording(blob) {
    if (this.isRecordCanceled) return;

    this.textRecorded = await sendToWispher(blob);
    this.timeoutTranscripting = setTimeout(() => {
      this.onCompleteTranscripting();
    }, this.minTranscriptingTime);
  }

  pauseAI() {
    this.isAIPaused = true;
    this.pauseBtn.classList.add("active");
    this.audiosAI[this.currentIndexAudioAI].pause();
    this.infoText.textContent = "Click to resume";
    this.onClickOutside.resumeAI = true;
  }
  resumeAI() {
    this.isAIPaused = false;
    this.pauseBtn.classList.remove("active");
    this.audiosAI[this.currentIndexAudioAI].play();
    this.onClickOutside.resumeAI = false;
  }

  muteMic() {
    this.isMicMuted = true;
    console.log("mute mic");
    this.myvad.pause();
    this.pauseBtn.classList.add("active");
    this.infoText.textContent = "Click to resume";
    this.onClickOutside.unmuteMic = true;
  }
  unmuteMic() {
    this.isMicMuted = false;
    console.log("unmute mic");
    this.myvad.start();
    this.pauseBtn.classList.remove("active");
    this.infoText.textContent = "Start talking";
    this.onClickOutside.unmuteMic = false;
  }

  addListeners() {
    // Open
    this.phoneBtn.addEventListener("click", async () => {
      this.anims.toStartPhoneRecording();
      this.startRecording();
    });

    // Close
    this.closeBtn.addEventListener("click", async () => {
      this.anims.toStopPhoneRecording();
      this.leave();
    });

    // Pause
    this.pauseBtn.addEventListener("click", async () => {
      if (this.isAITalking) {
        if (!this.isAIPaused) {
          this.pauseAI();
        } else {
          this.resumeAI();
        }
      } else {
        if (!this.isMicMuted) {
          this.muteMic();
        } else {
          this.unmuteMic();
        }
      }
    });

    // Click outside
    this.pageEl.addEventListener(
      "click",
      (event) => {
        if (this.isSmallRecording) return;
        // TODO add close btn to expetion
        if (!this.pauseBtn.contains(event.target)) {
          if (this.onClickOutside.resumeAI) {
            this.resumeAI();
          }
          if (this.onClickOutside.unmuteMic) {
            this.unmuteMic();
          }
        }
      },
      { capture: true }
    );
  }
}
