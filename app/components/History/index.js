import { store } from "../store";
import HistoryFetcher from "./HistoryFetcher";

export default class History {
  constructor({ emitter }) {
    this.emitter = emitter;

    // DOM Elements
    this.historyContainer = document.querySelector(".history__container");

    this.fetcher = new HistoryFetcher({ emitter: this.emitter });

    this.addListeners();
  }

  async updateHistory() {
    // hide the previous discussion container while it is loading to avoid scroll jumps
    this.historyContainer.style.display = "none";

    await new Promise(async (resolve) => {
      const chatId = store.get("chatId");
      const user = store.get("user");

      const { container } = await this.fetcher.getHistory({ uuid: chatId, user, size: 10 });
      this.historyContainer.appendChild(container);
      const imgs = this.historyContainer.querySelectorAll("img");
      let imgLoadedCount = 0;
      const totalImages = imgs.length;

      const showHistory = () => {
        this.historyContainer.style.display = "block";
        // this.scrollToBottom(false);
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
      console.log("scrolling");
    });
  }
}
