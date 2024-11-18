import { sendToWisphergroq } from "../../utils/audio/sendToWhisper";
import float32ArrayToMp3Blob from "../../utils/audio/float32ArrayToMp3Blob";
import htmlToText from "../../utils/htmlToText";
import textToSpeech from "../../utils/textToSpeech";
import VoiceConvAnimations from "./VoiceConvAnimations";

import unlockAudio from "../../utils/audio/unlockAudio";
import AudioPlayer from "../../utils/audio/AudioPlayer";
import audioFlights from "/sounds/debugFlights.mp3";
import Waves from "../Three/Waves";

export default class VoiceConv {
  constructor({ anims, pageEl, photos, discussion, emitter }) {
    // Event
    this.unbindEvent = null;
    this.emitter = emitter;
    this.photos = photos;

    // States
    this.isSceneDestroyed = true;
    this.isStartingConversation = false;

    // DOM Elements
    this.pageEl = pageEl;
    this.discussion = discussion;
    this.voiceConvContainer = this.pageEl.querySelector(".phone__container");
    this.voiceConvBtn = this.pageEl.querySelector(".phone-btn");
    this.infoText = this.voiceConvContainer.querySelector(".phone__info.active");
    this.pauseBtn = this.voiceConvContainer.querySelector(".phone__pause");
    this.closeBtn = this.voiceConvContainer.querySelector(".phone__close");

    // Debug btns
    this.voiceConvDebugContainer = this.pageEl.querySelector(".phone__debug");
    this.btnToConnected = this.pageEl.querySelector("#btn-toConnected");
    this.btnToTalkToMe = this.pageEl.querySelector("#btn-toTalkToMe");
    this.btnToListening = this.pageEl.querySelector("#btn-toListening");
    this.btnFinishTalk = this.pageEl.querySelector("#btn-finishTalk");
    this.btnFinishProcessing = this.pageEl.querySelector("#btn-finishProcessing");

    this.anims = anims;

    this.isActive = false;
    this.audioContext = null;

    // Sounds
    this.audioConnected = null;
    this.audioProcessing = null;
    // AI
    this.currentAudioAIPlaying = null;
    this.currentIndexAudioAI = null;
    this.currentIndexTextAI = null;
    this.audiosAI = [];

    this.isProcessing = false;
    this.isAITalking = false;
    this.isAIPaused = false;
    this.isStreamEnded = false;
    this.emitter.on("endStream", () => {
      this.isStreamEnded = true;
    });

    //stopwords
    this.sentencesData = null;
    this.sentencesconData = null;
    this.stopwords = true;

    // Mic
    this.isConnected = false;
    this.myvad = null;
    this.isListening = false;
    this.isMicMuted = false;
    this.micAccessConfirmed = false;

    // Anims
    this.waves = null;
    this.voiceConvAnimations = new VoiceConvAnimations({
      pageEl: this.pageEl,
    });

    this.onClickOutside = {
      interrupt: false,
      resumeAI: false,
      unmuteMic: false,
    };

    this.pauseResume = this.pauseResume.bind(this);

    this.addListeners();

    // Debug
    this.debug = import.meta.env.VITE_DEBUG === "true";
    this.debugIOSAnim = false;
    this.debugFlights = false;

    if (this.debug) {
      this.waves = new Waves();
      this.anims.toStartVoiceConv();
      this.startConnecting();
    }
  }

  startConnecting() {
    this.voiceConvAnimations.toConnecting();
    // console.log("connecting");
    this.voiceConvAnimations.newInfoText("connecting");
  }

  connected() {
    this.voiceConvAnimations.toConnected();
    this.voiceConvAnimations.newInfoText("connected");
    // console.log("connected");

    this.emitter.emit("phone:connected");
    if (this.debug) return;
    this.audioConnected = new AudioPlayer({
      audioUrl: "/sounds/connected.mp3",
      audioContext: this.audioContext,
    });
    this.audioConnected.playAudio();
    setTimeout(() => {
      this.isConnected = true;
      this.toTalkToMe();
    }, 1500);
  }

  leave() {
    // console.log("leave");
    this.audioProcessing?.stopAudio();
    if (this.unbindEvent) {
      this.unbindEvent();
      this.unbindEvent = null;
    }
    this.isStartingConversation = false;
    this.isActive = false;

    this.voiceConvAnimations.leave();
    this.stopRecording();
    this.stopAITalking();

    this.emitter.emit("phone:leave");
  }

  toTalkToMe() {
    if (!this.isActive) return;
    if (!this.unbindEvent) {
      this.unbindEvent = this.emitter.on("addAIText", (html, targetlang) => this.startAITalking(html, targetlang));
    }
    this.waves = new Waves();

    this.isStreamEnded = false;
    this.voiceConvAnimations.toTalkToMe();
    this.voiceConvAnimations.newInfoText("Talk to me");
    if (this.myvad) this.myvad.start();

    this.emitter.emit("phone:talkToMe");
  }

  toListening() {
    if (!this.isListening) {
      this.voiceConvAnimations.toListening();
    }
    this.isListening = true;
    // console.log("I'm listening");
    this.voiceConvAnimations.newInfoText("I'm listening");
    this.emitter.emit("phone:listening");
  }

  async toProcessing(audio) {
    if (!this.isActive) return;
    this.isProcessing = true;
    this.waves?.toggleBetweenIdleAndActive();
    this.voiceConvAnimations.newInfoText("processing");
    this.voiceConvAnimations.toProcessing();
    this.emitter.emit("phone:processing");
    if (this.debugIOSAnim) {
      this.discussion.addUserElement({ text: "Hi I am a test", debug: true });
      return;
    }
    this.myvad.pause();

    console.log("TOPROCCESSING");

    if (!audio) return;
    const blob = float32ArrayToMp3Blob(audio, 16000);
    if (this.discussion.Chat.autodetect) this.textRecorded = await sendToWisphergroq(blob);
    else this.textRecorded = await sendToWisphergroq(blob, this.discussion.Chat.sourcelang);

    this.discussion.addUserElement({ text: this.textRecorded, imgs: this.photos, isFromVideo: this.photos.length > 0 });

    //play the stopword
    this.processTextAndPlayAudio(this.textRecorded); // Call immediately
  }

  async processTextAndPlayAudio(textRecorded) {
    if (!this.isActive) return;
    try {
      if (!this.sentencesData) {
        const response = await fetch("stopwords.json");
        this.sentencesData = await response.json();
        const response2 = await fetch("stopwordscon.json");
        this.sentencesconData = await response2.json();
        // this.sentencesData = await fetch('stopwords.json').then(response => response.json());
        // this.sentencesconData = await fetch('stopwords.json').then(response => response.json());
      }

      const randomIndex = Math.floor(Math.random() * this.sentencesData.sentences.length);
      let stopText = this.sentencesData.sentences[randomIndex];
      let sourceLang = "en";

      if (!this.stopwords) {
        const randomIndex = Math.floor(Math.random() * this.sentencesconData.sentences.length);
        stopText = this.sentencesconData.sentences[randomIndex];
      }
      this.stopwords = false;

      const googletrresponse = await this.discussion.Chat.googletranslate(textRecorded, sourceLang, "");
      if (googletrresponse.data.translations[0].detectedSourceLanguage) {
        const detectedLang = googletrresponse.data.translations[0].detectedSourceLanguage;
        sourceLang = detectedLang === "und" ? "en" : detectedLang;
      }
      // console.log("here for stopText:", stopText);
      // console.log("here for sourceLang:", sourceLang);
      if (sourceLang !== "en") {
        console.log("here for stopText:", stopText);
        console.log("here for sourceLang:", sourceLang);

        const transResponse = await this.discussion.Chat.googletranslate(stopText, sourceLang, "en");
        stopText = transResponse.data.translations[0].translatedText;
      }
      // console.log(sourceLang);
      // console.log(stopText);

      const { audio: audioP, index } = await textToSpeech(stopText, sourceLang, 1);

      this.audioProcessing?.stopAudio();
      this.audioProcessing = new AudioPlayer({
        audioUrl: audioP?.src,
        audioContext: this.audioContext,
        // onPlay: this.onPlay.bind(this),
        onEnded: () => this.prepareNextStopWords(textRecorded),
      });

      try {
        this.audioProcessing.playAudio();
      } catch (err) {
        console.error("from audioProcessing", err);
      }
    } catch (error) {
      console.error("Error during processing:", error);
    }
  }

  async prepareNextStopWords(textRecorded) {
    if (!this.stopwords) {
      await new Promise((r) => setTimeout(r, 5000));
      if (!this.stopwords) this.processTextAndPlayAudio(textRecorded);
    }
  }

  onPlay() {
    if (!this.isAITalking) {
      this.isProcessing = false;
      this.voiceConvAnimations.newInfoText("Speak to interrupt");
      this.voiceConvAnimations.toAITalking();
      this.emitter.emit("phone:AITalking");
      if (this.myvad) this.myvad.start();
      this.emitter.emit("phone:talkToMe");
    }
    this.isAITalking = true;
    this.onClickOutside.interrupt = true;
  }

  async startAITalking(html, targetlang) {
    if (!this.isActive || this.isAIPaused) return;
    if (this.debug) {
      this.isAITalking = false;
      this.onPlay();
      return;
    }

    this.waves?.destroy();
    this.waves = null;

    this.currentIndexTextAI === null ? (this.currentIndexTextAI = 0) : this.currentIndexTextAI++;
    const { audio, index } = await textToSpeech(htmlToText(html), targetlang, this.currentIndexTextAI);
    this.audiosAI[index] = audio;

    if (this.currentIndexAudioAI === null && this.audiosAI[0] !== undefined) {
      this.audioProcessing?.stopAudio();
      if (!this.stopwords) {
        // clearInterval(this.timerId);
        this.stopwords = true;
      }

      this.currentIndexAudioAI = 0;
      this.currentAudioAIPlaying = new AudioPlayer({
        audioUrl: this.audiosAI[this.currentIndexAudioAI]?.src,
        audioContext: this.audioContext,
        onPlay: this.onPlay.bind(this),
        onEnded: this.checkIfNextAudio.bind(this),
      });
      try {
        this.currentAudioAIPlaying.playAudio();
      } catch (err) {
        console.error("from startAITalking", err);
      }
    }
  }

  async checkIfNextAudio() {
    if (!this.isActive) return;
    if (this.audiosAI[this.currentIndexAudioAI + 1]) {
      this.currentIndexAudioAI++;
      // console.log("Stil one sound");
      // this.audiosAI[this.currentIndexAudioAI].play();
      this.currentAudioAIPlaying = new AudioPlayer({
        audioUrl: this.audiosAI[this.currentIndexAudioAI]?.src,
        audioContext: this.audioContext,
        onPlay: this.onPlay.bind(this),
        onEnded: this.checkIfNextAudio.bind(this),
      });
      this.currentAudioAIPlaying.playAudio();
    } else {
      this.clearAIAudios();
      this.isAITalking = false;
      this.toTalkToMe();
    }
  }

  clearAIAudios() {
    this.currentIndexAudioAI = null;
    this.currentIndexTextAI = null;
    this.audiosAI = [];
    this.onClickOutside.interrupt = false;
  }

  stopAITalking() {
    // console.log("stop talking");
    this.currentAudioAIPlaying?.pauseAudio();
    this.currentAudioAIPlaying = null;
    this.isAITalking = false;
    this.clearAIAudios();
  }

  interrupt() {
    this.stopAITalking();
    this.toTalkToMe();
  }

  async startRecording() {
    if (this.isActive) return;
    this.isActive = true;

    if (!this.micAccessConfirmed) {
      this.startConnecting();
    } else {
      this.toTalkToMe();
    }

    if (!this.myvad) {
      try {
        this.myvad = await vad.MicVAD.new({
          positiveSpeechThreshold: 0.9,
          onFrameProcessed: (frame) => {
            if (!this.micAccessConfirmed) {
              this.micAccessConfirmed = true;
              this.connected();
            }
          },
          onSpeechStart: () => {
            // console.log("speech start");
            if (!this.isConnected) return;
            if (!this.waves) this.waves = new Waves();
            this.stopAITalking();
            this.toListening();
          },
          onSpeechEnd: (audio) => {
            if (this.debugFlights) return;
            this.isListening = false;
            this.toProcessing(audio);
          },
          // Time to wait before onSpeechEnd (10 frames * X seconds)
          redemptionFrames: 10 * 1.4,
        });
      } catch (err) {
        console.log(err);
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        // Safari specific error handling if microphone permission is not granted
        if (err.name === "NotAllowedError" && isSafari) {
          alert(
            "Safari requires microphone permission to use this feature.\n\n" +
              "Please check your Safari settings:\n" +
              "1. Click Safari > Settings > Websites\n" +
              "2. Find 'Microphone' in the left sidebar\n" +
              "3. Allow access for this website\n" +
              "4. Refresh the page"
          );
        } else if (isSafari && err.message.includes("WebAssembly SIMD is not supported in the current environment")) {
          // Safari 16.4 or newer is required for voice conversations
          alert("You need Safari 16.4 or newer to use voice conversations. Quick update and you're good to go!");
          this.stopRecording();
        }
      }
    }

    if (this.debugFlights) {
      setTimeout(() => {
        this.myvad.pause();
        const testAudio = new Audio();
        testAudio.src = audioFlights;
        this.toProcessing(testAudio);
      }, 2500);
    }

    if (this.debug) {
      this.myvad.pause();
      return;
    }
    this.myvad.start();
    // console.log("THE VAD IS STARTING !");
  }

  stopRecording() {
    this.myvad?.pause();
    this.myvad?.stream?.getTracks().forEach((track) => {
      track.stop();
    });
    this.myvad = null;
  }

  async onCompleteRecording(blob) {
    if (this.isRecordCanceled) return;
    if (this.discussion.Chat.autodetect) this.textRecorded = await sendToWisphergroq(blob);
    else this.textRecorded = await sendToWisphergroq(blob, this.discussion.Chat.sourcelang);

    this.timeoutTranscripting = setTimeout(() => {
      this.onCompleteTranscripting();
    }, this.minTranscriptingTime);
  }

  pauseAI() {
    this.isAIPaused = true;
    this.voiceConvAnimations.newInfoText("Click to resume");
    this.voiceConvAnimations.toPause("AI");
    this.pauseBtn.classList.add("active");
    this.emitter.emit("phone:pauseAI");

    this.onClickOutside.interrupt = false;
    this.onClickOutside.resumeAI = true;

    if (this.debug) return;
    this.currentAudioAIPlaying?.pauseAudio();
  }

  resumeAI() {
    this.isAIPaused = false;
    this.voiceConvAnimations.toResume("AI");
    this.pauseBtn.classList.remove("active");
    this.emitter.emit("phone:resumeAI");
    this.currentAudioAIPlaying?.resumeAudio();

    this.onClickOutside.resumeAI = false;
  }

  muteMic() {
    this.isMicMuted = true;
    this.voiceConvAnimations.toPause("user");
    this.voiceConvAnimations.newInfoText("Click to resume");
    // console.log("mute mic");
    this.emitter.emit("phone:muteMic");
    this.pauseBtn.classList.add("active");

    this.onClickOutside.unmuteMic = true;
    if (this.debug) return;
    this.myvad?.pause();
  }

  unmuteMic() {
    this.isMicMuted = false;
    // console.log("unmute mic");
    this.voiceConvAnimations.toResume("user");
    this.voiceConvAnimations.newInfoText("Start talking");
    this.pauseBtn.classList.remove("active");
    this.emitter.emit("phone:unmuteMic");

    this.onClickOutside.unmuteMic = false;
    if (this.debug) return;
    this.myvad.start();
  }

  pauseResume(isMicMuted = this.isMicMuted, isAITalking = this.isAITalking, isAIPaused = this.isAIPaused) {
    if (isAITalking) {
      if (!isAIPaused) {
        this.pauseAI();
      } else {
        this.resumeAI();
      }
    } else {
      if (!isMicMuted) {
        this.muteMic();
      } else {
        this.unmuteMic();
      }
    }
  }

  addListeners() {
    // Open
    this.voiceConvBtn.addEventListener("click", async () => {
      if (!this.isSceneDestroyed || this.isActive) return; // making sure to wait till the 3D scene is destroyed before creating a new one
      this.audioContext = unlockAudio();
      this.anims.toStartVoiceConv();
      this.startRecording();
    });

    this.emitter.on("input:displayVideoInput", () => {
      if (this.isActive) return;
      this.audioContext = unlockAudio();
      this.anims.toStartVoiceConv();
      this.startRecording();
    });

    // Close
    this.closeBtn.addEventListener("click", async () => {
      this.anims.toStopVoiceConv();
      this.stopRecording();
      this.stopAITalking();
      await this.waves?.destroy();

      this.waves = null;
      this.leave();
    });

    this.emitter.on("videoInput:leave", () => {
      this.anims.toStopVoiceConv();
      this.leave();
      this.discussion.Chat.VideoCallEnded();
    });

    this.emitter.on("videoInput:captureImage", (imageData) => {
      //call the part to send data
      // this.discussion.Chat.SendPHIImages(imageData);
    });

    // Pause
    this.pauseBtn?.addEventListener("click", async () => {
      this.pauseResume(this.isMicMuted, this.isAITalking, this.isProcessing);
    });

    this.emitter.on("videoInput:pause", (isMicMuted, isAITalking, isAIPaused) => {
      this.pauseResume(isMicMuted, isAITalking, isAIPaused);
    });

    // Click outside
    this.pageEl.addEventListener(
      "click",
      (event) => {
        if (this.debug) return;

        // TODO add close btn to expetion
        if (this.pauseBtn?.contains(event.target) || this.closeBtn?.contains(event.target)) return;
        if (this.onClickOutside.resumeAI) {
          this.resumeAI();
        }
        if (this.onClickOutside.unmuteMic) {
          this.unmuteMic();
        }
        if (this.onClickOutside.interrupt) {
          this.interrupt();
        }
      },
      { capture: true }
    );

    // Tests
    this.btnToConnected.addEventListener("click", () => {
      this.isActive = true;
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
      this.startAITalking("Bonjour je suis un test");
    });
  }
}
