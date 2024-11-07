import getMarked from "../../utils/getMarked";
import DiscussionMedia from "../DiscussionMedia";

const md = getMarked();
const isEmpty = (obj) => Object.keys(obj).length === 0;

export default class HistoryElement {
  constructor(data) {
    this.data = data;

    // States

    // DOM Elements
    this.historyContainer = document.querySelector(".history__container");
    this.elementWrapper = null;
    this.userContainer = null;
    this.assistantContainer = null;

    // Init Methods
    this.createUI();
  }

  createUI() {
    if (this.data.user.length === 0 || this.data.assistant.length === 0) return;

    const userContainer = document.createElement("div");
    userContainer.classList.add("discussion__user");
    var userContainerspan = document.createElement("span");
    userContainerspan.classList.add("discussion__userspan");
    // const userTextMarkdowned = md.renderInline(element.user);
    userContainerspan.innerHTML = this.data.user;
    userContainer.appendChild(userContainerspan);
    this.historyContainer.appendChild(userContainer);

    // 1st way to figure out if an img comes from the video input - the length
    // const isImgsComingFromVideo = element.images.user_images?.length > 40000;

    // 2nd way to figure out if an img comes from the video input - the presence of 'data:image/png;base64,'
    const isImgsComingFromVideo = this.data.images.user_images?.includes("data:image/png;base64,");

    if (!isEmpty(this.data.images) && !isImgsComingFromVideo) {
      const media = new DiscussionMedia({
        container: userContainer,
        emitter: this.emitter,
      });
      if (this.data.images.user_images) media?.addUserImages(JSON.parse(this.data.images.user_images));
      this.historyContainer.appendChild(userContainer);
    }

    const AIContainer = document.createElement("div");
    AIContainer.classList.add("discussion__ai");

    // Need to stringify
    const string = JSON.stringify(this.data.assistant);

    // Remove leading and trailing quotes
    const textWithoutQuotes = string.slice(1, -1);

    // Replace \n with <br>
    const assistantText = textWithoutQuotes.replace(/\\n/g, "<br>");

    // Render the markdown
    const assistantTextMardowned = md.parse(assistantText);

    AIContainer.innerHTML = assistantTextMardowned;
    this.historyContainer.appendChild(AIContainer);

    if (!isEmpty(this.data.sources) || !isEmpty(this.data.images)) {
      const media = new DiscussionMedia({
        container: AIContainer,
        emitter: this.emitter,
      });
      if (this.data.images.images) {
        media.initImages();
        media?.addImages(JSON.parse(this.data.images.images).slice(0, 8));
      }
      if (this.data.sources.sources) {
        media?.addSources(JSON.parse(this.data.sources.sources));
      }

      this.historyContainer.appendChild(AIContainer);
    }
  }
}
