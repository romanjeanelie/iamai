import sendToWispher from "../../utils/audio/sendToWhisper";
import float32ArrayToMp3Blob from "../../utils/audio/float32ArrayToMp3Blob";
import htmlToText from "../../utils/htmlToText";
import textToSpeech from "../../utils/textToSpeech";
import downloadAudio from "../../utils/audio/downloadAudio";
import PhoneAnimations from "./PhoneAnimations";
import playAudio from "../../utils/audio/playAudio";
import unlockAudio from "../../utils/audio/unlockAudio";
export default class Phone {
  constructor({ anims, pageEl, discussion, emitter }) {
    // Event
    this.unbindEvent = null;
    this.emitter = emitter;

    // DOM Elements
    this.pageEl = pageEl;
    this.discussion = discussion;
    this.phoneContainer = this.pageEl.querySelector(".phone__container");
    this.phoneBtn = this.pageEl.querySelector(".phone-btn");
    this.infoText = this.phoneContainer.querySelector(".phone__info.active");
    this.pauseBtn = this.phoneContainer.querySelector(".phone__pause");
    this.closeBtn = this.phoneContainer.querySelector(".phone__close");

    // Debug btns
    this.phoneDebugContainer = this.pageEl.querySelector(".phone__debug");
    this.btnToConnected = this.pageEl.querySelector("#btn-toConnected");
    this.btnToTalkToMe = this.pageEl.querySelector("#btn-toTalkToMe");
    this.btnToListening = this.pageEl.querySelector("#btn-toListening");
    this.btnFinishTalk = this.pageEl.querySelector("#btn-finishTalk");
    this.btnFinishProcessing = this.pageEl.querySelector("#btn-finishProcessing");

    this.anims = anims;

    this.isActive = false;
    // AI
    this.audioContext = null;
    this.currentAudioPlaying = null;
    this.currentIndexAudioAI = null;
    this.audioAI = null;
    this.audiosAI = [];
    this.isAITalking = false;
    this.isAIPaused = false;
    // Mic
    this.myvad = null;
    this.isListening = false;
    this.isMicMuted = false;
    this.micAccessConfirmed = false;

    // Anims
    this.phoneAnimations = new PhoneAnimations({
      pageEl: this.pageEl,
    });

    this.onClickOutside = {
      interrupt: false,
      resumeAI: false,
      unmuteMic: false,
    };

    this.addListeners();

    // Debug
    this.debug = false;

    if (this.debug) {
      this.phoneDebugContainer.classList.add("show");

      this.anims.toStartPhoneRecording();
      this.startConnecting();
    }
  }

  startConnecting() {
    this.phoneAnimations.toConnecting();
    console.log("connecting");
    this.phoneAnimations.newInfoText("connecting");
  }

  connected() {
    this.phoneAnimations.toConnected();
    this.phoneAnimations.newInfoText("connected");
    console.log("connected");
    if (this.debug) return;
    this.toTalkToMe();
  }

  leave() {
    console.log("leave");
    this.unbindEvent();
    this.unbindEvent = null;
    this.isActive = false;
    this.phoneAnimations.leave();
    this.stopRecording();
    this.stopAITalking();
  }

  toTalkToMe() {
    if (!this.isActive) return;
    console.log("Talk to me");
    if (!this.unbindEvent) {
      this.unbindEvent = this.emitter.on("addAITextTest", (html) => this.startAITalking(html));
    }
    this.phoneAnimations.toTalkToMe();
    this.phoneAnimations.newInfoText("Talk to me");
    if (this.myvad) this.myvad.start();
  }

  toListening() {
    if (!this.isListening) {
      this.phoneAnimations.toListening();
    }
    this.isListening = true;
    console.log("I'm listening");
    this.phoneAnimations.newInfoText("I'm listening");
  }

  async toProcessing(audio) {
    this.phoneAnimations.newInfoText("processing");
    this.phoneAnimations.toProcessing();
    this.myvad.pause();
    console.log("processing");

    const blob = float32ArrayToMp3Blob(audio, 16000);
    this.textRecorded = await sendToWispher(blob);
    this.discussion.addUserElement({ text: this.textRecorded });
  }

  onPlay() {
    this.isAITalking = true;
    this.onClickOutside.interrupt = true;
  }

  async startAITalking(html) {
    if (!this.isActive) return;
    if (!this.isAITalking) {
      this.phoneAnimations.newInfoText("Click to interrupt");
      this.phoneAnimations.toAITalking();
    }
    console.log("new AIAnswer");
    const audio = await textToSpeech(htmlToText(html));
    this.audiosAI.push(audio);

    if (this.currentIndexAudioAI === null) {
      console.log("First sound");
      this.currentIndexAudioAI = 0;
      this.currentAudioPlaying = await playAudio({
        audioUrl: this.audiosAI[this.currentIndexAudioAI].src,
        audioContext: this.audioContext,
        onPlay: this.onPlay.bind(this),
        onEnded: this.checkIfNextAudio.bind(this),
      });
    }

    this.audiosAI[this.currentIndexAudioAI].onplay = () => {};
  }

  async checkIfNextAudio() {
    if (!this.isActive) return;
    this.currentIndexAudioAI++;
    if (this.audiosAI[this.currentIndexAudioAI]) {
      console.log("Stil one sound");
      // this.audiosAI[this.currentIndexAudioAI].play();
      this.currentAudioPlaying = await playAudio({
        audioUrl: this.audiosAI[this.currentIndexAudioAI].src,
        audioContext: this.audioContext,
        onPlay: this.onPlay.bind(this),
        onEnded: this.checkIfNextAudio.bind(this),
      });
    } else {
      console.log("all sounds plaid");
      this.clearAIAudios();
      if (this.debug) return;
      this.toTalkToMe();
    }
  }

  clearAIAudios() {
    this.currentIndexAudioAI = null;
    this.audiosAI = [];
    this.isAITalking = false;
    this.onClickOutside.interrupt = false;
  }

  stopAITalking() {
    console.log("stop talking");
    this.currentAudioPlaying.stop();
    this.currentAudioPlaying = null;
    this.clearAIAudios();
  }

  interrupt() {
    this.stopAITalking();
    this.toTalkToMe();
  }

  async startRecording() {
    this.isActive = true;

    if (!this.micAccessConfirmed) {
      this.startConnecting();
    } else {
      this.toTalkToMe();
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
          this.toListening();
        },
        onSpeechEnd: (audio) => {
          this.toProcessing(audio);
          this.isListening = false;
        },
      });
    }

    if (this.debug) {
      this.myvad.pause();
      return;
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
    this.phoneAnimations.newInfoText("Click to resume");
    this.phoneAnimations.toPause("AI");
    this.pauseBtn.classList.add("active");

    this.onClickOutside.interrupt = false;
    this.onClickOutside.resumeAI = true;
    if (this.debug) return;
    this.audiosAI[this.currentIndexAudioAI].pause();
  }
  resumeAI() {
    this.isAIPaused = false;
    this.phoneAnimations.toResume("AI");
    this.pauseBtn.classList.remove("active");
    this.audiosAI[this.currentIndexAudioAI].play();

    this.onClickOutside.resumeAI = false;
  }

  muteMic() {
    this.isMicMuted = true;
    this.phoneAnimations.toPause("user");
    this.phoneAnimations.newInfoText("Click to resume");
    console.log("mute mic");
    this.pauseBtn.classList.add("active");

    this.onClickOutside.unmuteMic = true;
    if (this.debug) return;
    this.myvad.pause();
  }
  unmuteMic() {
    this.isMicMuted = false;
    console.log("unmute mic");
    this.phoneAnimations.toResume("user");
    this.phoneAnimations.newInfoText("Start talking");
    this.pauseBtn.classList.remove("active");

    this.onClickOutside.unmuteMic = false;
    if (this.debug) return;
    this.myvad.start();
  }

  addListeners() {
    // Open
    this.phoneBtn.addEventListener("click", async () => {
      this.audioContext = unlockAudio();
      this.anims.toStartPhoneRecording();
      if (this.debug) {
        this.startConnecting();
        return;
      }
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
        if (this.pauseBtn.contains(event.target) || this.closeBtn.contains(event.target)) return;
        if (this.onClickOutside.resumeAI) {
          this.resumeAI();
        }
        if (this.onClickOutside.unmuteMic) {
          this.unmuteMic();
        }
        if (this.onClickOutside.interrupt) {
          console.log("interrupt");
          this.interrupt();
        }
      },
      { capture: true }
    );

    // Tests
    this.btnToConnected.addEventListener("click", () => {
      this.connected();
    });
    this.btnToTalkToMe.addEventListener("click", () => {
      this.toTalkToMe();
    });
    this.btnToListening.addEventListener("click", () => {
      this.toListening();
    });
    this.btnFinishTalk.addEventListener("click", () => {
      this.toProcessing();
    });
    this.btnFinishProcessing.addEventListener("click", () => {
      this.isActive = true;
      this.startAITalking("Bonjour je suis un test");
    });
  }
}
