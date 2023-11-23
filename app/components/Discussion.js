export default class Discussion {
  constructor() {
    this.discussionContainer = document.querySelector(".discussion__container");
    this.addUserText = this.addUserText.bind(this);

    this.addListeners();
  }

  getAiAnswer() {
    const aiEl = document.createElement("div");
    aiEl.classList.add("discussion__ai");
    aiEl.innerHTML = text.replace(/\n/g, "<br>"); // Replace newline characters with <br>
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("AI answer");
      }, 2000);
    });
  }

  async addUserText({ type, text }) {
    if (type === "user") {
      const userEl = document.createElement("div");
      userEl.classList.add("discussion__user");
      userEl.innerHTML = text.replace(/\n/g, "<br>"); // Replace newline characters with <br>
      this.discussionContainer.appendChild(userEl);
      this.scrollToBottom();

      await this.getAiAnswer(text);
    }
  }
  addAiAnswer(text) {
    const aiEl = document.createElement("div");
    aiEl.classList.add("discussion__ai");
    aiEl.innerHTML = text.replace(/\n/g, "<br>"); // Replace newline characters with <br>
    this.discussionContainer.appendChild(aiEl);
  }

  scrollToBottom() {
    this.discussionContainer.scrollTop = this.discussionContainer.scrollHeight;
  }

  addListeners() {
    const resizeObserver = new ResizeObserver(this.scrollToBottom.bind(this));

    resizeObserver.observe(this.discussionContainer);
  }
}
