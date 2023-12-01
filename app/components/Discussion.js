import TypingText from "../TypingText";
import { backgroundColorGreyPage } from "../../scss/variables/_colors.module.scss";
import typeText from "../utils/typeText";
import Chat from "./Chat.js";

// type();

export default class Discussion {
  constructor() {
    this.page = document.querySelector(".page-grey");
    this.mainEl = this.page.querySelector("main");
    this.inputText = this.page.querySelector(".input-text");
    this.discussionContainer = document.querySelector(".discussion__container");

    this.addUserElement = this.addUserElement.bind(this);

    this.Chat = new Chat({
      addAIText: this.addAIText.bind(this),
      disableInput: this.disableInput.bind(this),
      enableInput: this.enableInput.bind(this),
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
    this.Chat.callsubmit("", text, img, aiEl, this.typingText);
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
  async addAIText({ text, container }) {
    this.typingText.fadeOut();
    const textEl = document.createElement("p");
    text = text.replace(/<br\/?>\s*/g, "\n");
    container.appendChild(textEl);
    return typeText(textEl, text);

    this.scrollToBottom();
  }

  scrollToBottom() {
    this.mainEl.scrollTo({
      top: this.discussionContainer.scrollHeight,
      behavior: "smooth",
    });
  }

  addListeners() {
    const resizeObserver = new ResizeObserver(this.scrollToBottom.bind(this));

    resizeObserver.observe(this.discussionContainer);
  }
}
