import sendToWispher from "../../utils/audio/sendToWhisper";
import float32ArrayToMp3Blob from "../../utils/audio/float32ArrayToMp3Blob";
import htmlToText from "../../utils/htmlToText";
import textToSpeech from "../../utils/textToSpeech";
import PhoneAnimations from "./PhoneAnimations";

import unlockAudio from "../../utils/audio/unlockAudio";
import AudioPlayer from "../../utils/audio/AudioPlayer";
import audioFlights from "/sounds/debugFlights.mp3";

export default class Phone {
  constructor({ anims, pageEl, photos, discussion, emitter }) {
    // Event
    this.unbindEvent = null;
    this.emitter = emitter;
    this.photos = photos;

    // DOM Elements
    this.pageEl = pageEl;
    this.discussion = discussion;
    this.phoneContainer = this.pageEl.querySelector(".phone__container");
    this.phoneBtns = this.pageEl.querySelectorAll(".phone-btn");
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
    this.phoneAnimations = new PhoneAnimations({
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
    this.debug = false;
    this.debugIOSAnim = false;
    this.debugFlights = false;

    if (this.debug) {
      console.log("debug mode");
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
    console.log("leave");
    this.audioProcessing?.stopAudio();
    if (this.unbindEvent) {
      this.unbindEvent();
      this.unbindEvent = null;
    }
    this.isActive = false;

    this.phoneAnimations.leave();
    this.stopRecording();
    this.stopAITalking();
    this.emitter.emit("phone:leave");
  }

  toTalkToMe() {
    if (!this.isActive) return;
    if (!this.unbindEvent) {
      this.unbindEvent = this.emitter.on("addAIText", (html, targetlang) => this.startAITalking(html, targetlang));
    }
    this.isStreamEnded = false;
    this.phoneAnimations.toTalkToMe();
    this.phoneAnimations.newInfoText("Talk to me");
    if (this.myvad) this.myvad.start();

    this.emitter.emit("phone:talkToMe");
  }

  toListening() {
    if (!this.isListening) {
      this.phoneAnimations.toListening();
    }
    this.isListening = true;
    console.log("I'm listening");
    this.phoneAnimations.newInfoText("I'm listening");
    this.emitter.emit("phone:listening");
  }

  async toProcessing(audio) {
    console.log("toProcessing");
    if (!this.isActive) return;

    this.isProcessing = true;
    this.phoneAnimations.newInfoText("processing");
    this.phoneAnimations.toProcessing();
    console.log("processing");
    this.emitter.emit("phone:processing");
    if (this.debugIOSAnim) {
      this.discussion.addUserElement({ text: "Hi I am a test", debug: true });
      return;
    }
    this.myvad.pause();

    // this.audioProcessing = new AudioPlayer({
    //   audioUrl: "/sounds/processing.mp3",
    //   audioContext: this.audioContext,
    //   loop: true,
    // });
    // this.audioProcessing.playAudio();

    if (!audio) return;
    const blob = float32ArrayToMp3Blob(audio, 16000);
    if (this.discussion.Chat.autodetect) this.textRecorded = await sendToWispher(blob);
    else this.textRecorded = await sendToWispher(blob, this.discussion.Chat.sourcelang);

    this.discussion.addUserElement({ text: this.textRecorded, imgs: this.photos, isFromVideo: this.photos.length > 0 });

    //play the stopword
    // await this.processTextAndPlayAudio();
    this.processTextAndPlayAudio(this.textRecorded); // Call immediately
    // this.timerId = setInterval(() => this.processTextAndPlayAudio(this.textRecorded, true), 5000); // Call every 5 seconds
  }

  async processTextAndPlayAudio(textRecorded) {
    try {
      if (!this.sentencesData) {
        console.log("here for stopwords");
        const response = await fetch("stopwords.json");
        this.sentencesData = await response.json();
        console.log("here for stopwords:", this.sentencesData);
        const response2 = await fetch("stopwordscon.json");
        this.sentencesconData = await response2.json();
        console.log("here for stopwords:", this.sentencesconData);
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
      console.log("here for stopText:", stopText);
      console.log("here for this.textRecorded:", textRecorded);

      const googletrresponse = await this.discussion.Chat.googletranslate(textRecorded, "en", "");
      console.log("here for response:", googletrresponse);
      if (googletrresponse.data.translations[0].detectedSourceLanguage) {
        sourceLang = googletrresponse.data.translations[0].detectedSourceLanguage;
      }
      console.log("here for stopText:", stopText);
      console.log("here for sourceLang:", sourceLang);
      if (sourceLang !== "en") {
        const transResponse = await this.discussion.Chat.googletranslate(stopText, sourceLang, "en");
        stopText = transResponse.data.translations[0].translatedText;
      }
      console.log(sourceLang);
      console.log(stopText);

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
      this.phoneAnimations.newInfoText("Speak to interrupt");
      this.phoneAnimations.toAITalking();
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

    this.currentIndexTextAI === null ? (this.currentIndexTextAI = 0) : this.currentIndexTextAI++;
    const { audio, index } = await textToSpeech(htmlToText(html), targetlang, this.currentIndexTextAI);
    // console.log(audio)
    // console.log(audio?.src)
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
      console.log("Stil one sound");
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
      if (this.isStreamEnded) {
        console.log("all sounds played", this.isStreamEnded);
        // if (this.debug) return;
        this.toTalkToMe();
      } else {
        this.toProcessing();
      }
    }
  }

  clearAIAudios() {
    this.currentIndexAudioAI = null;
    this.currentIndexTextAI = null;
    this.audiosAI = [];
    this.onClickOutside.interrupt = false;
  }

  stopAITalking() {
    console.log("stop talking");
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
            console.log("speech start");
            if (!this.isConnected) return;
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
        console.log("error in vad");
        console.log(err);
      }
    }

    if (this.debugFlights) {
      setTimeout(() => {
        this.myvad.pause();
        const testAudio = new Audio();
        testAudio.src = audioFlights;
        this.toProcessing(testAudio);
        return;
      }, 2500);
    }

    if (this.debug) {
      this.myvad.pause();
      return;
    }
    this.myvad.start();
    console.log("THE VAD IS STARTING !");
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
    if (this.discussion.Chat.autodetect) this.textRecorded = await sendToWispher(blob);
    else this.textRecorded = await sendToWispher(blob, this.discussion.Chat.sourcelang);

    this.timeoutTranscripting = setTimeout(() => {
      this.onCompleteTranscripting();
    }, this.minTranscriptingTime);
  }

  pauseAI() {
    this.isAIPaused = true;
    this.phoneAnimations.newInfoText("Click to resume");
    this.phoneAnimations.toPause("AI");
    this.pauseBtn.classList.add("active");
    this.emitter.emit("phone:pauseAI");

    this.onClickOutside.interrupt = false;
    this.onClickOutside.resumeAI = true;

    if (this.debug) return;
    this.currentAudioAIPlaying?.pauseAudio();
  }

  resumeAI() {
    this.isAIPaused = false;
    this.phoneAnimations.toResume("AI");
    this.pauseBtn.classList.remove("active");
    this.emitter.emit("phone:resumeAI");
    this.currentAudioAIPlaying?.resumeAudio();

    this.onClickOutside.resumeAI = false;
  }

  muteMic() {
    this.isMicMuted = true;
    this.phoneAnimations.toPause("user");
    this.phoneAnimations.newInfoText("Click to resume");
    console.log("mute mic");
    this.emitter.emit("phone:muteMic");
    this.pauseBtn.classList.add("active");

    this.onClickOutside.unmuteMic = true;
    if (this.debug) return;
    this.myvad?.pause();
  }

  unmuteMic() {
    this.isMicMuted = false;
    console.log("unmute mic");
    this.phoneAnimations.toResume("user");
    this.phoneAnimations.newInfoText("Start talking");
    this.pauseBtn.classList.remove("active");
    this.emitter.emit("phone:unmuteMic");

    this.onClickOutside.unmuteMic = false;
    if (this.debug) return;
    this.myvad.start();
  }

  pauseResume(
    isMicMuted = this.isMicMuted,
    isAITalking = this.isAITalking,
    // isProcessing = this.isProcessing,
    isAIPaused = this.isAIPaused
  ) {
    console.log("pause initiated");
    if (isAITalking) {
      console.log("ai talking");
      if (!isAIPaused) {
        console.log("ai not paused");
        this.pauseAI();
      } else {
        console.log("ai paused");
        this.resumeAI();
      }
    } else {
      if (!isMicMuted) {
        console.log("mic not muted");
        this.muteMic();
      } else {
        console.log("mic muted");
        this.unmuteMic();
      }
    }
  }

  addListeners() {
    // Open
    this.phoneBtns.forEach((phoneBtn) => {
      phoneBtn.addEventListener("click", async () => {
        this.audioContext = unlockAudio();
        this.anims.toStartPhoneRecording();
        this.startRecording();
      });
    });

    this.emitter.on("input:displayVideoInput", () => {
      this.audioContext = unlockAudio();
      this.anims.toStartPhoneRecording();
      this.startRecording();
    });

    // Close
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", async () => {
        this.anims.toStopPhoneRecording();
        this.leave();
      });
    }

    this.emitter.on("videoInput:leave", () => {
      this.anims.toStopPhoneRecording();
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
