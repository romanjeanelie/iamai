import getMarked from "../../utils/getMarked";
import { store } from "../store";
import HistoryFetcher from "./HistoryFetcher";
import DiscussionMedia from "../DiscussionMedia";

const md = getMarked();
const isEmpty = (obj) => Object.keys(obj).length === 0;

export default class History {
  constructor({ emitter }) {
    this.emitter = emitter;

    // DOM Elements
    this.historyContainer = document.querySelector(".history__container");

    this.fetcher = new HistoryFetcher({ emitter: this.emitter });

    this.addListeners();
  }

  createUIElements(data) {
    data.forEach((element) => {
      if (element.user.length > 0) {
        const userContainer = document.createElement("div");
        userContainer.classList.add("discussion__user");
        var userContainerspan = document.createElement("span");
        userContainerspan.classList.add("discussion__userspan");
        // const userTextMarkdowned = md.renderInline(element.user);
        userContainerspan.innerHTML = element.user;
        userContainer.appendChild(userContainerspan);
        this.historyContainer.appendChild(userContainer);

        // 1st way to figure out if an img comes from the video input - the length
        // const isImgsComingFromVideo = element.images.user_images?.length > 40000;

        // 2nd way to figure out if an img comes from the video input - the presence of 'data:image/png;base64,'
        const isImgsComingFromVideo = element.images.user_images?.includes("data:image/png;base64,");

        if (!isEmpty(element.images) && !isImgsComingFromVideo) {
          const media = new DiscussionMedia({
            container: userContainer,
            emitter: this.emitter,
          });
          if (element.images.user_images) media?.addUserImages(JSON.parse(element.images.user_images));
          this.historyContainer.appendChild(userContainer);
        }
      }

      if (element.assistant.length > 0) {
        const AIContainer = document.createElement("div");
        AIContainer.classList.add("discussion__ai");

        // Need to stringify
        const string = JSON.stringify(element.assistant);

        // Remove leading and trailing quotes
        const textWithoutQuotes = string.slice(1, -1);

        // Replace \n with <br>
        const assistantText = textWithoutQuotes.replace(/\\n/g, "<br>");

        // Render the markdown
        const assistantTextMardowned = md.parse(assistantText);

        AIContainer.innerHTML = assistantTextMardowned;
        this.historyContainer.appendChild(AIContainer);

        if (!isEmpty(element.sources) || !isEmpty(element.images)) {
          const media = new DiscussionMedia({
            container: AIContainer,
            emitter: this.emitter,
          });
          if (element.images.images) {
            media.initImages();
            media?.addImages(JSON.parse(element.images.images).slice(0, 8));
          }
          if (element.sources.sources) {
            media?.addSources(JSON.parse(element.sources.sources));
          }

          this.historyContainer.appendChild(AIContainer);
        }
      }
    });
    return this.historyContainer;
  }

  async updateHistory(isFirstLoad) {
    // hide the previous discussion container while it is loading to avoid scroll jumps
    if (isFirstLoad) this.historyContainer.style.display = "none";

    await new Promise(async (resolve) => {
      const chatId = store.get("chatId");
      const user = store.get("user");

      const data = await this.fetcher.getHistory({ uuid: chatId, user, size: 10 });

      this.createUIElements(data);

      const imgs = this.historyContainer.querySelectorAll("img");
      let imgLoadedCount = 0;
      const totalImages = imgs.length;

      const showHistory = () => {
        this.historyContainer.style.display = "block";
      };

      const handleImageLoad = () => {
        imgLoadedCount++;

        if (imgLoadedCount === totalImages) {
          showHistory();
          resolve();
        }
      };

      if (imgs.length) {
        imgs.forEach((img) => {
          img.addEventListener("load", handleImageLoad);
          img.addEventListener("error", handleImageLoad); // Treat errors as loaded to ensure resolution
        });
      } else {
        showHistory();
        resolve();
      }
    });
  }

  addListeners() {
    this.historyContainer.addEventListener("scroll", (e) => {
      if (e.target.scrollTop === 0) {
        this.updateHistory();
      }
    });
  }
}
