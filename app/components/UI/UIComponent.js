// BaseUI.js
export default class UIComponent {
  constructor() {
    this.mainContainer = document.createElement("div");
    this.isClass = true;
  }

  addAIText(text) {
    const answerContainer = document.createElement("div");
    answerContainer.innerHTML = text || "";
    this.mainContainer.appendChild(answerContainer);
  }

  getElement() {
    return this.mainContainer;
  }
}
