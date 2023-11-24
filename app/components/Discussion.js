import TypingText from "../TypingText";
import { backgroundColorGreyPage } from "../../scss/variables/_colors.module.scss";

export default class Discussion {
  constructor() {
    this.page = document.querySelector(".page-grey");
    this.inputText = this.page.querySelector(".input-text");
    this.discussionContainer = document.querySelector(".discussion__container");

    this.addUserElement = this.addUserElement.bind(this);

    // TEMP
    this.tempAIAnswer = "AI answer";
    this.tempAIAnswerTiming = 1000;

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
    });

    this.typingText.blink();

    // TODO fetch answer AI
    console.log("TODO fetch answer AI");
    setTimeout(() => {
      this.typingText.fadeOut();
      this.addAIText({ text: this.tempAIAnswer, container: aiEl });
    }, this.tempAIAnswerTiming);
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
  addAIText({ text, container }) {
    const textEl = document.createElement("p");
    textEl.innerHTML = text.replace(/\n/g, "<br>");
    container.appendChild(textEl);

    this.scrollToBottom();
    this.enableInput();
  }

  scrollToBottom() {
    this.discussionContainer.scrollTo({
      top: this.discussionContainer.scrollHeight,
      behavior: "smooth",
    });
  }

  addListeners() {
    const resizeObserver = new ResizeObserver(this.scrollToBottom.bind(this));

    resizeObserver.observe(this.discussionContainer);
  }
}
