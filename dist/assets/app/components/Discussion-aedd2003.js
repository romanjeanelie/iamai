import TypingText from "../TypingText-05e288b5.js";
import { backgroundColorGreyPage } from "../../scss/variables/_colors.module.scss-f9d2d4d4.js";
import typeText from "../utils/typeText-a16d99d7.js";
import Chat from "./Chat-8434e108.js";
class Discussion {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.page = document.querySelector(".page-grey");
    this.mainEl = this.page.querySelector("main");
    this.inputText = this.page.querySelector(".input-text");
    this.discussionContainer = document.querySelector(".discussion__container");
    this.addUserElement = this.addUserElement.bind(this);
    this.Chat = new Chat({
      addAIText: this.addAIText.bind(this),
      disableInput: this.disableInput.bind(this),
      enableInput: this.enableInput.bind(this)
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
      marginLeft: 16
    });
    this.typingText.blink();
    this.Chat.callsubmit(text, img, aiEl);
  }
  addUserElement({ text, img }) {
    if (img) {
      const userEl2 = document.createElement("div");
      userEl2.classList.add("discussion__user");
      userEl2.appendChild(img);
      this.discussionContainer.appendChild(userEl2);
    }
    const userEl = document.createElement("div");
    userEl.classList.add("discussion__user");
    userEl.innerHTML = text.replace(/\n/g, "<br>");
    this.discussionContainer.appendChild(userEl);
    this.scrollToBottom();
    this.disableInput();
    this.getAiAnswer({ text, img });
  }
  async addAIText({ text, container }) {
    this.typingText.fadeOut();
    const textEl = document.createElement("p");
    text = text.replace(/<br\/?>\s*/g, "\n");
    container.appendChild(textEl);
    return typeText(textEl, text);
  }
  scrollToBottom() {
    this.mainEl.scrollTo({
      top: this.discussionContainer.scrollHeight,
      behavior: "smooth"
    });
  }
  async onLoad() {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var q = urlParams.get("q");
    const sessionID = urlParams.get("session_id");
    console.log(q);
    console.log(this.Chat.sessionID);
    if (urlParams.get("location") && urlParams.get("location") != "") {
      this.Chat.location = urlParams.get("location");
    }
    if (urlParams.get("lang") && urlParams.get("lang") != "") {
      this.Chat.sourcelang = urlParams.get("lang");
      if (this.Chat.sourcelang == "ad")
        this.Chat.sourcelang = "";
      this.Chat.autodetect = true;
    }
    if (q && q != "") {
      this.getAiAnswer({ text: "" });
    }
    if (sessionID && sessionID != "") {
      this.callbacks.toPageGrey();
      this.Chat.sessionID = sessionID;
      this.getAiAnswer({ text: "" });
    }
  }
  addListeners() {
    window.addEventListener("load", this.onLoad.bind(this));
    const resizeObserver = new ResizeObserver(this.scrollToBottom.bind(this));
    resizeObserver.observe(this.discussionContainer);
  }
}
export {
  Discussion as default
};
