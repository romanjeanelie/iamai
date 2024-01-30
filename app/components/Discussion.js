import TypingText from "../TypingText";
import { backgroundColorGreyPage } from "../../scss/variables/_colors.module.scss";
import typeText from "../utils/typeText";
import Chat from "./Chat.js";
import { getsessionID } from "../User";
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
  constructor({ toPageGrey, emitter, user }) {
    this.emitter = emitter;
    this.toPageGrey = toPageGrey;
    this.user = user;
    console.log("Discussion user", this.user);
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
      addImages: this.addImages.bind(this),
      addURL: this.addURL.bind(this),
      disableInput: this.disableInput.bind(this),
      enableInput: this.enableInput.bind(this),
      emitter: emitter,
      user: this.user,
    });

    this.addListeners();

    // DEBUG
    const tempContainer = document.createElement("div");
    tempContainer.classList.add("discussion__ai");
    this.discussionContainer.appendChild(tempContainer);
    // Scroll to div
    // const moviesCards = document.querySelectorAll(".movies-card");
    // const movieDetails = document.querySelector("#movie-details");
    // moviesCards.forEach((movieCard) => {
    //   movieCard.addEventListener("click", () => {
    //     this.scrollToDiv(movieDetails);
    //   });
    // });
    // Link
    // this.addURL({
    //   text: "mois...",
    //   label: "I'm searching filghthts...",
    //   container: tempContainer,
    //   url: "https://www.google.com",
    // });

    // Images
    // this.addImages({
    //   srcs: ["https://picsum.photos/300/500"],
    //   container: tempContainer,
    // });
  }

  //   scrollToDiv(element) {
  //     console.log("scroll to", element);
  //     let divOffset = 0;
  //     let currentElement = element;
  //     while (currentElement && this.discussionContainer.contains(currentElement)) {
  //       divOffset += currentElement.offsetTop;
  //       currentElement = currentElement.offsetParent;
  //     }
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
  getAiAnswer({ text, imgs }) {
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
    this.Chat.callsubmit(text, imgs, aiEl);
  }

  addUserElement({ text, imgs, debug = false } = {}) {
    if (imgs && imgs.length > 0) {
      const userEl = document.createElement("div");
      userEl.classList.add("discussion__user");
      this.discussionContainer.appendChild(userEl);
      this.addImages({ container: userEl, srcs: imgs.map((img) => img.src) });
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
          targetlang: "en",
        });
      }, 1000);
      return;
    }
    if (imgs && imgs.length > 0) this.getAiAnswer({ text, imgs });
    else this.getAiAnswer({ text });
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
    if (!this.lastStatus) return;
    container.removeChild(this.topStatus);
    container.removeChild(this.lastStatus);
    this.typingStatus = null;
    this.lastStatus = null;
    this.currentTopStatus = null;
  }

  async addAIText({ text, container, targetlang, type = null } = {}) {
    this.emitter.emit("addAIText", text, targetlang);
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
    this.typingText?.fadeOut();
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

  async addImages({ container, srcs = [] } = {}) {
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
    this.removeStatus({ container });
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
      if (this.Chat.sourcelang == "ad") {
        this.Chat.sourcelang = "";
        this.Chat.autodetect = true;
      }
    }
    if (q && q != "") {
      this.getAiAnswer({ text: "" });
    }
    if (sessionID && sessionID != "") {
      this.toPageGrey();
      this.Chat.sessionID = sessionID;
      this.Chat.deploy_ID = deploy_ID;
      this.getAiAnswer({ text: "" });
    } else {
      this.toPageGrey();
      var usr = await this.user;
      if (usr) {
        let data = await getsessionID(usr);
        this.Chat.sessionID = data.SessionID;
        this.Chat.deploy_ID = data.deploy_id;
        this.getAiAnswer({ text: "" });
      }
    }
  }

  addListeners() {
    window.addEventListener("load", this.onLoad());
    // window.addEventListener("load", this.onLoad.bind(this));
    const resizeObserver = new ResizeObserver(this.scrollToBottom.bind(this));

    resizeObserver.observe(this.discussionContainer);
  }
}