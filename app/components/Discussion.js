import TypingText from "../TypingText";
import { backgroundColorGreyPage } from "../../scss/variables/_colors.module.scss";
import typeText from "../utils/typeText";
import Chat from "./Chat.js";
import EventEmitter from "../utils/EventEmitter.js";
import isMobile from "../utils/isMobile.js";

export default class Discussion {
  constructor({ toPageGrey, emitter }) {
    this.emitter = emitter;
    this.toPageGrey = toPageGrey;

    this.page = document.querySelector(".page-grey");
    this.mainEl = this.page.querySelector("main");
    this.inputText = this.page.querySelector(".input-text");
    this.discussionContainer = document.querySelector(".discussion__container");

    this.addUserElement = this.addUserElement.bind(this);

    this.lastStatus = null;

    this.Chat = new Chat({
      addAIText: this.addAIText.bind(this),
      disableInput: this.disableInput.bind(this),
      enableInput: this.enableInput.bind(this),
      emitter: emitter,
    });

    this.addListeners();
  }

  disableInput() {
    this.inputText.disabled = true;
  }
  enableInput() {
    this.inputText.disabled = false;
    this.inputText.focus();
  }
  getAiAnswer({ text, img }) {
    const aiEl = document.createElement("div");
    aiEl.classList.add("discussion__ai");
    this.discussionContainer.appendChild(aiEl);
    this.scrollToBottom();

    this.typingText = new TypingText({
      text: "",
      container: aiEl,
      backgroundColor: backgroundColorGreyPage,
      marginLeft: 16,
    });

    this.typingText.blink();
    this.Chat.callsubmit(text, img, aiEl);
  }

  addUserElement({ text, img }) {
    if (img) {
      const userEl = document.createElement("div");
      userEl.classList.add("discussion__user");
      userEl.appendChild(img);
      this.discussionContainer.appendChild(userEl);
    }

    const userEl = document.createElement("div");
    userEl.classList.add("discussion__user");
    userEl.innerHTML = text.replace(/\n/g, "<br>");

    this.discussionContainer.appendChild(userEl);

    this.scrollToBottom();
    this.disableInput();
    this.getAiAnswer({ text, img });
  }

  async addAIText({ text, container, type = null } = {}) {
    this.emitter.emit("addAITextTest", text);
    this.typingText.fadeOut();
    const textEl = document.createElement("span");

    if (type === "status") {
      container.innerHTML = "";
      //   console.log("/// Status :", text, container);
      this.lastStatus = textEl;
    } else if (this.lastStatus) {
      container.removeChild(this.lastStatus);
      //   console.log("/// replace last status text", this.lastStatus);
      this.lastStatus = null;
    }

    container.appendChild(textEl);
    text = text.replace(/<br\/?>\s*/g, "\n");
    if (isMobile()) {
      return (textEl.innerHTML = text);
    } else {
      text = text.replace(/<br\/?>\s*/g, "\n");
      return typeText(textEl, text);
    }
  }

  scrollToBottom() {
    this.mainEl.scrollTo({
      top: this.discussionContainer.scrollHeight,
      behavior: "smooth",
    });
  }

  async onLoad() {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var q = urlParams.get("q");
    const sessionID = urlParams.get("session_id");
    const deploy_ID = urlParams.get("deploy_id");

    // console.log(q);
    // console.log(this.Chat.sessionID);

    if (urlParams.get("location") && urlParams.get("location") != "") {
      this.Chat.location = urlParams.get("location");
    }
    if (urlParams.get("lang") && urlParams.get("lang") != "") {
      this.Chat.sourcelang = urlParams.get("lang");
      if (this.Chat.sourcelang == "ad") this.Chat.sourcelang = "";
      this.Chat.autodetect = true;
    }
    if (q && q != "") {
      this.getAiAnswer({ text: "" });
    }
    if (sessionID && sessionID != "") {
      this.toPageGrey();
      this.Chat.sessionID = sessionID;
      this.Chat.deploy_ID = deploy_ID;
      this.getAiAnswer({ text: "" });
    }
  }

  addListeners() {
    window.addEventListener("load", this.onLoad());
    // window.addEventListener("load", this.onLoad.bind(this));
    const resizeObserver = new ResizeObserver(this.scrollToBottom.bind(this));

    resizeObserver.observe(this.discussionContainer);
  }
}
