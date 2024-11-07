import { store } from "../store";
import HistoryElement from "./HistoryElement";
import HistoryFetcher from "./HistoryFetcher";

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
      new HistoryElement(element);
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
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 1) {
        this.updateHistory();
      }
    });
  }
}
