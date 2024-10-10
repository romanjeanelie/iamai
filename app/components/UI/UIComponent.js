export default class UIComponent {
  constructor() {
    // States
    this.isClass = true;

    // DOM Elements
    this.mainContainer = document.createElement("div");
    this.resultDetailsContainer = document.createElement("div");
  }

  addAIText(text) {
    const answerContainer = document.createElement("div");
    answerContainer.innerHTML = text || "";
    this.mainContainer.appendChild(answerContainer);
  }

  getElement() {
    return this.mainContainer;
  }

  getResultsDetails() {
    return this.resultDetailsContainer;
  }
}
