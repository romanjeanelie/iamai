import { backgroundColorGreyPage } from "../../scss/variables/_colors.module.scss";
import TypingText from "../TypingText";
import Chat from "./Chat.js";
import DiscussionImages from "./DiscussionImages.js"

import { getsessionID } from "../User";
import { asyncAnim } from "../utils/anim.js";
import typeByWord from "../utils/typeByWord.js";

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

const wordPool = ["images", "photos", "pictures"]; 
function detectImageSearch(text){
  return wordPool.some(word => {
    if (text.toLowerCase().includes(word)) {
      return true
    }
    return false
  })
}

export default class Discussion {
  constructor({ toPageGrey, emitter, user }) {
    this.emitter = emitter;
    this.toPageGrey = toPageGrey;
    this.user = user;
    this.pageEl = document.querySelector(".page-grey");
    this.inputContainer = this.pageEl.querySelector("div.input__container.grey");
    this.inputText = this.pageEl.querySelector(".input-text");
    this.discussionContainer = document.querySelector(".discussion__container");

    this.addUserElement = this.addUserElement.bind(this);
    this.currentProgress = 0;
    this.nextProgress = 0;

    this.currentTopStatus = null;
    this.lastStatus = null;
    this.centralFinished = false;

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
    // const tempContainer = document.createElement("div");
    // tempContainer.classList.add("discussion__ai");
    // this.discussionContainer.appendChild(tempContainer);
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
    console.log("disable input")
    this.inputText.disabled = true;
    const childNodes = this.inputContainer.getElementsByTagName("*");
    for (var node of childNodes) {
      node.disabled = true;
    }
  }

  enableInput() {
    console.log("enable input")
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

    this.typingText.fadeIn();
    this.typingText.displayTextSkeleton();
    this.Chat.callsubmit(text, imgs, aiEl);
  }

  resetStatuses() {
    this.typingStatus = null;
    this.lastStatus = null;
    this.currentTopStatus = null;
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

  async animateProgressBar(currProgress, nextProgress, duration = 500) {
    await asyncAnim(this.progressBar, [
      { transform: `scaleX(${currProgress/100})` },
      { transform: `scaleX(${nextProgress/100})` },
    ], {
      duration: duration,
      fill: "forwards",
      ease: "ease-out",
    })
  }

  async endStatusAnimation(){
    await this.animateProgressBar(this.currentProgress, 100, 200);
    this.statusContainer.classList.add("hidden");
    this.lastStatus.classList.add("hidden");
    
    this.currentProgress = 0;
    this.nextProgress = 0;
    this.centralFinished = false;
  }

  async addStatus({ text, textEl, container }) {
    const topStatus = getTopStatus(text);
    const isImageSearch = detectImageSearch(text);
    console.log("----------------- add status -----------------")
    
    if (!this.lastStatus) {
      // Init status
      this.statusContainer = document.createElement("div");
      this.statusContainer.className = "status-container";
      this.topStatus = document.createElement("div");
      this.topStatus.className = "top-status";
      this.progressBarContainer = document.createElement("div");
      this.progressBarContainer.className = "progress-bar-container";
      this.progressBar = document.createElement("div");
      this.progressBar.className = "progress-bar";

      if (isImageSearch){
        this.images = new DiscussionImages({
          container: container,
          removeStatus: this.removeStatus,
          scrollToBottom: this.scrollToBottom,
          openSlider: this.openSlider,
        });
         
        this.images.initTabs();

        this.topStatus.style.marginTop= "0px"
        this.topStatus.style.height= "0px"
        this.topStatus.classList.add("image-skeleton")
        this.typingStatus = new TypingText({
          text: "",
          container: this.topStatus,
          backgroundColor: backgroundColorGreyPage,
        })

        this.typingStatus.fadeIn();
        this.typingStatus.displayImageSkeleton();
        container.appendChild(this.topStatus);
        return null;
      }

      container.appendChild(this.statusContainer);
      this.statusContainer.appendChild(this.topStatus);
      this.statusContainer.appendChild(this.progressBarContainer);
      this.progressBarContainer.appendChild(this.progressBar);
    } else {
      // Update status
      container.removeChild(this.lastStatus);
    }

    if (topStatus && (topStatus !== this.currentTopStatus || !this.currentTopStatus)) {
      this.updateTopStatus({ status : text, topStatus, container: this.topStatus });
      this.currentTopStatus = topStatus;
    }

    this.statusContainer.appendChild(textEl);
    this.lastStatus = textEl;
  }

  async updateTopStatus({ topStatus }) {
    console.log("--------- update top status ---------")

    if (!this.typingStatus) {
      console.log("if !this.typingStatus inside updateTopStatus : ", topStatus)
      this.typingStatus = new TypingText({
        text: topStatus,
        container: this.topStatus,
        backgroundColor: backgroundColorGreyPage,
      });
      this.typingStatus.fadeIn();
      this.typingStatus.writing();
    } else {
      await this.typingStatus.reverse();
      this.typingStatus.fadeIn();
      this.typingStatus.updateText(topStatus);
      await this.typingStatus.writing();
      this.typingStatus.fadeIn();
    }

    this.currentProgress = this.nextProgress;
    const remainingProgress = 100 - this.currentProgress;
    const portionOfRemainProgress = Math.ceil(remainingProgress / 5);
    this.nextProgress += this.currentProgress <= 60 ? 20 : portionOfRemainProgress;

    this.animateProgressBar(this.currentProgress, this.nextProgress);
  }

  async removeStatus({ container }) {
    if (!this.lastStatus) return;
    console.log("CONTAINER FROM REMOVE STATUS : ", container)
    console.log("LAST STATUS FROM REMOVE STATUS : " ,this.lastStatus)
    container.removeChild(this.statusContainer);
    container.removeChild(this.lastStatus);
    this.resetStatuses();
  }

  async addAIText({ text, container, targetlang, type = null } = {}) {    
    const isImageSearch = detectImageSearch(text);
    this.typingText?.fadeOut();
    this.emitter.emit("addAIText", text, targetlang);
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

    if (isImageSearch) return
    return new Promise(resolve => {
      // Delay the start of the typing after the skeletons fade out
      setTimeout(async () => {
        resolve(await typeByWord(textEl, text));
      }, 300);
    });  
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

    // right before adding the images we remove the skeletons
    const skeletonContainer = container.querySelector(".image-skeleton .typing__skeleton-container");
    skeletonContainer.classList.add("hidden"); 
    
    this.images.initSources(this.Chat.Sources);
    this.images.initImages(srcs, this.removeStatus, this.scrollToBottom);
    this.typingStatus = null;
  }

  attachClickEvent(imgs) {
    imgs.forEach((img, i) => {
      img.addEventListener("click", () => {
        this.openSlider(imgs, i);
      });
    });
  }



  scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }

  async onLoad() {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var q = urlParams.get("q");
    let sessionID = urlParams.get("session_id");
    let deploy_ID = urlParams.get("deploy_id");
    this.Chat.autodetect = true;

    // if (!sessionID){
    //   this.Chat.sessionID = sessionID
    // }
    // if (!deploy_ID){
    //   this.Chat.deploy_ID = deploy_ID
    // }
    
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
      // this.toPageGrey();
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

    this.emitter.on("centralFinished", () => {
      this.centralFinished = true
      this.endStatusAnimation()
    })
    // window.addEventListener("load", this.onLoad.bind(this));
    const resizeObserver = new ResizeObserver(this.scrollToBottom.bind(this));
    resizeObserver.observe(this.discussionContainer);
  }
}