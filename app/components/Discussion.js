import TypingText from "../TypingText";
import { backgroundColorGreyPage } from "../../scss/variables/_colors.module.scss";
import typeText from "../utils/typeText";
import Chat from "./Chat.js";
import EventEmitter from "../utils/EventEmitter.js";
import isMobile from "../utils/isMobile.js";

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = (error) => reject(error);
    img.src = src;
  });
}

async function loadImages(srcs) {
  const successfulSrcs = [];
  const errors = [];

  await Promise.all(
    srcs.map((src) =>
      loadImage(src)
        .then(() => successfulSrcs.push(src))
        .catch((error) => {
          errors.push({ src, error });
          console.log("Error loading image:", error);
        })
    )
  );

  return successfulSrcs;
}

const topStatusText = ["finding", "checking", "searching", "analyzing", "scanning", "finalizing", "processing"];
const defaultTopStatus = "searching";
function getTopStatus(text) {
  for (let status of topStatusText) {
    if (text.toLowerCase().includes(status)) {
      return status;
    }
  }
  return defaultTopStatus;
}
export default class Discussion {
  constructor({ toPageGrey, emitter }) {
    this.emitter = emitter;
    this.toPageGrey = toPageGrey;

    this.pageEl = document.querySelector(".page-grey");
    this.inputContainer = this.pageEl.querySelector("div.input__container.grey");
    this.inputText = this.pageEl.querySelector(".input-text");
    this.discussionContainer = document.querySelector(".discussion__container");

    this.addUserElement = this.addUserElement.bind(this);

    this.currentTopStatus = null;
    this.lastStatus = null;

    this.Chat = new Chat({
      discussionContainer: this.discussionContainer,
      addAIText: this.addAIText.bind(this),
      addAIImages: this.addAIImages.bind(this),
      addURL: this.addURL.bind(this),
      disableInput: this.disableInput.bind(this),
      enableInput: this.enableInput.bind(this),
      emitter: emitter,
    });

    this.addListeners();

    // DEBUG
    // const tempContainer = document.createElement("div");
    // tempContainer.classList.add("discussion__ai");
    // this.discussionContainer.appendChild(tempContainer);
    // this.addURL({
    //   text: "mois...",
    //   label: "I'm searching filghthts...",
    //   container: tempContainer,
    //   url: "https://www.google.com",
    // });
    // tempContainer2.textContent =
    //   "I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts..." +
    //   "I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts..." +
    //   "I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts..." +
    //   "I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...I'm searching filghts...";
    // this.addAIImages({
    //   srcs: [
    //     "https://picsum.photos/400/300",
    //     "https://picsum.photos/200/300",
    //     "https://picsum.photos/200/300",
    //     "https://picsum.photos/200/300",
    //     "https://picsum.photos/200/300",
    //   ],
    //   container: tempContainer,
    // });
    // tempContainer.addEventListener("click", () => {
    //   this.scrollToDiv(tempContainer);
    // });
  }

  //   scrollToDiv(element) {
  //     const divOffset = element.offsetTop;
  //     console.log({ divOffset });
  //     this.discussionContainer.scrollTo({
  //       top: divOffset,
  //       behavior: "smooth",
  //     });
  //   }
  disableInput() {
    this.inputText.disabled = true;
    const childNodes = this.inputContainer.getElementsByTagName("*");
    for (var node of childNodes) {
      node.disabled = true;
    }
  }
  enableInput() {
    this.inputText.disabled = false;
    const childNodes = this.inputContainer.getElementsByTagName("*");
    for (var node of childNodes) {
      node.disabled = false;
    }
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
    this.Chat.callsubmit(text, img, aiEl);
  }

  addUserElement({ text, img, debug = false } = {}) {
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
    if (debug) {
      setTimeout(() => {
        this.addAIText({
          text: "Hello test Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo pariatur sapiente, aliquam velit consectetur soluta esse cupiditate alias illo deleniti earum vel! Consequuntur ipsam quisquam nemo voluptatem id molestiae, reprehenderit illum natus omnis nobis porro sit sint veniam earum sapiente dolorem eum non deserunt! Saepe nostrum reprehenderit modi voluptatem corporis culpa accusantium. Maxime fuga, aliquam laboriosam culpa ipsum, minus officiis quasi aperiam ratione, vel beatae. Repellat, iusto placeat? Architecto sequi nam ullam numquam odio. Soluta dolore quas vel quaerat doloribus, vitae explicabo assumenda sunt fugiat consequatur illo, ipsa nam quia sit! Praesentium aliquid animi ex libero necessitatibus modi voluptas! Consequatur?",
          container: userEl,
        });
      }, 1000);
      return;
    }
    this.getAiAnswer({ text, img });
  }

  async updateTopStatus({ status, container }) {
    if (!this.typingStatus) {
      this.typingStatus = new TypingText({
        text: status,
        container: this.topStatus,
        backgroundColor: backgroundColorGreyPage,
      });
      this.typingStatus.blink();
      this.typingStatus.writing();
      this.typingStatus.blink();
    } else {
      await this.typingStatus.reverse();
      this.typingStatus.blink();
      this.typingStatus.updateText(status);
      await this.typingStatus.writing();
      this.typingStatus.blink();
    }
  }

  async addStatus({ text, textEl, container }) {
    const newStatus = getTopStatus(text);

    if (!this.lastStatus) {
      // Init status
      this.topStatus = document.createElement("div");
      this.topStatus.className = "top-status";
      container.appendChild(this.topStatus);
    } else {
      // Update status
      container.removeChild(this.lastStatus);
    }

    if (newStatus && (newStatus !== this.currentTopStatus || !this.currentTopStatus)) {
      this.updateTopStatus({ status: newStatus, container: this.topStatus });
      this.currentTopStatus = newStatus;
    }

    container.appendChild(textEl);
    this.lastStatus = textEl;
  }

  removeStatus({ container }) {
    container.removeChild(this.topStatus);
    container.removeChild(this.lastStatus);
    this.typingStatus = null;
    this.lastStatus = null;
    this.currentTopStatus = null;
  }

  async addAIText({ text, container, type = null } = {}) {
    this.emitter.emit("addAIText", text);
    this.typingText?.fadeOut();
    const textEl = document.createElement("span");

    if (type === "status") {
      textEl.className = "AIstatus";
      this.addStatus({ text, textEl, container });
    } else if (this.lastStatus) {
      this.removeStatus({ container });
    }

    container.appendChild(textEl);
    text = text.replace(/<br\/?>\s*/g, "\n");
    this.scrollToBottom();
    return await typeText(textEl, text);
  }

  addURL({ text, label, url, container }) {
    const linkEl = document.createElement("a");
    linkEl.href = url;
    linkEl.target = "_blank";
    linkEl.textContent = label;

    if (text) {
      const textEL = document.createElement("span");
      textEL.classList.add("text-beforeLink");
      textEL.textContent = text;

      container.appendChild(textEL);
    }
    container.appendChild(linkEl);
    this.scrollToBottom();
  }

  openSlider(imgs, currentIndex) {
    this.emitter.emit("slider:open", { imgs, currentIndex });
  }

  async addAIImages({ container, srcs = [] } = {}) {
    if (srcs.length === 0) return;

    const imagesContainer = document.createElement("div");
    imagesContainer.className = "images__container";

    const successfulSrcs = await loadImages(srcs);

    const imgs = successfulSrcs.map((src) => {
      const img = document.createElement("img");
      img.src = src;
      imagesContainer.appendChild(img);
      return img;
    });

    this.attachClickEvent(imgs);

    container.appendChild(imagesContainer);
    this.scrollToBottom();
  }

  attachClickEvent(imgs) {
    imgs.forEach((img, i) => {
      img.addEventListener("click", () => {
        this.openSlider(imgs, i);
      });
    });
  }

  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve(true); // Image loaded successfully
      };

      img.onerror = () => {
        reject(false); // Error loading image
      };

      img.src = url;
    });
  }

  scrollToBottom() {
    // Go to bottom of the page

    this.discussionContainer.scrollTo({
      top: this.discussionContainer.scrollHeight,
      behavior: "smooth",
    });
  }

  async onLoad() {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var q = urlParams.get("q");
    const sessionID = urlParams.get("session_id");
    const deploy_ID = urlParams.get("deploy_id");

    if (urlParams.get("location") && urlParams.get("location") != "") {
      this.Chat.location = urlParams.get("location");
    }
    if (urlParams.get("lang") && urlParams.get("lang") != "") {
      this.Chat.sourcelang = urlParams.get("lang");
      if (this.Chat.sourcelang == "ad") this.Chat.sourcelang = "";
      this.Chat.autodetect = true;
    }
    if (q && q != "") {
      this.getAiAnswer({ text: "" });
    }
    if (sessionID && sessionID != "") {
      this.toPageGrey();
      this.Chat.sessionID = sessionID;
      this.Chat.deploy_ID = deploy_ID;
      this.getAiAnswer({ text: "" });
    }
  }

  addListeners() {
    window.addEventListener("load", this.onLoad());
    // window.addEventListener("load", this.onLoad.bind(this));
    const resizeObserver = new ResizeObserver(this.scrollToBottom.bind(this));

    resizeObserver.observe(this.discussionContainer);
  }
}
