import TypingText from "../TypingText";
import { backgroundColorGreyPage } from "../../scss/variables/_colors.module.scss";

export default class Discussion {
  constructor() {
    this.page = document.querySelector(".page-grey");
    this.inputText = this.page.querySelector(".input-text");
    this.discussionContainer = document.querySelector(".discussion__container");
    this.addUserText = this.addUserText.bind(this);

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
  getAiAnswer() {
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

  addUserText({ text }) {
    const userEl = document.createElement("div");
    userEl.classList.add("discussion__user");
    userEl.innerHTML = text.replace(/\n/g, "<br>");
    this.discussionContainer.appendChild(userEl);

    this.scrollToBottom();
    this.disableInput();
    this.getAiAnswer(text);
  }
  addAIText({ text, container }) {
    const textEl = document.createElement("p");
    textEl.innerHTML = text.replace(/\n/g, "<br>");
    container.appendChild(textEl);

    this.scrollToBottom();
    this.enableInput();
  }

  scrollToBottom() {
    this.discussionContainer.scrollTop = this.discussionContainer.scrollHeight;
  }

  addListeners() {
    const resizeObserver = new ResizeObserver(this.scrollToBottom.bind(this));

    resizeObserver.observe(this.discussionContainer);
  }
}
