import { backgroundColorGreyPage } from "../../scss/variables/_colors.module.scss";
import TypingText from "../TypingText";
import Chat from "./Chat.js";
import History from "./History.js";
import DiscussionTabs from "./DiscussionTabs.js";
import fetcher from "../utils/fetcher.js";
import { getsessionID } from "../User";
import { asyncAnim } from "../utils/anim.js";
import typeByWord from "../utils/typeByWord.js";
import getStyleElement from "../utils/getStyleElement.js";
import { URL_DELETE_STATUS } from "./constants.js";

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
    this.tabs = null;

    this.currentAnswerContainer = null;

    this.isAutoScrollActive = true;

    this.Chat = new Chat({
      discussionContainer: this.discussionContainer,
      addAIText: this.addAIText.bind(this),
      initImages: this.initImages.bind(this),
      addImages: this.addImages.bind(this),
      addSources: this.addSources.bind(this),
      addURL: this.addURL.bind(this),
      disableInput: this.disableInput.bind(this),
      enableInput: this.enableInput.bind(this),
      emitter: emitter,
      user: this.user,
    });

    this.history = new History({
      getTaskResultUI: this.Chat.getUI.bind(this.Chat),
      emitter: this.emitter,
    });

    this.addListeners();

    this.debug = import.meta.env.VITE_DEBUG === "true";
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
  //     let divOffset = 0;
  //     let currentElement = element;
  //     while (currentElement && this.discussionContainer.contains(currentElement)) {
  //       divOffset += currentElement.offsetTop;
  //       currentElement = currentElement.offsetParent;
  //     }
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
    // this.scrollToBottom();
    this.AIContainer = document.createElement("div");
    this.AIContainer.classList.add("discussion__ai");
    this.discussionContainer.appendChild(this.AIContainer);
    // this.scrollToBottom();

    this.typingText = new TypingText({
      text: "",
      container: this.AIContainer,
      backgroundColor: backgroundColorGreyPage,
      marginLeft: 16,
    });

    this.typingText.fadeIn();
    this.typingText.displayTextSkeleton();
    this.Chat.callsubmit(text, imgs, this.AIContainer);
  }

  resetStatuses() {
    this.typingStatus = null;
    this.lastStatus = null;
    this.currentTopStatus = null;
  }

  addUserElement({ text, imgs, debug = false } = {}) {
    this.makePreviousElementsScrollUp();

    if (imgs && imgs.length > 0) {
      const userContainer = document.createElement("div");
      userContainer.classList.add("discussion__user");
      this.discussionContainer.appendChild(userContainer);

      if (!this.tabs) {
        this.tabs = new DiscussionTabs({
          container: userContainer,
          emitter: this.emitter,
          removeStatus: this.removeStatus,
          scrollToBottom: this.scrollToBottom,
        });
      } else {
        this.tabs.container = userContainer;
      }

      this.addImages({ imgSrcs: imgs.map((img) => img.src) });
    }

    this.userContainer = document.createElement("div");
    this.userContainer.classList.add("discussion__user");
    var userContainerspan = document.createElement("span");
    userContainerspan.classList.add("discussion__userspan");
    userContainerspan.innerHTML = text.replace(/\n/g, "<br>");
    this.userContainer.appendChild(userContainerspan);
    // this.userContainer.innerHTML = text.replace(/\n/g, "<br>");

    this.discussionContainer.appendChild(this.userContainer);

    // this.scrollToBottom();
    this.disableInput();
    if (debug) {
      setTimeout(() => {
        this.addAIText({
          text: "Hello test Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo pariatur sapiente, aliquam velit consectetur soluta esse cupiditate alias illo deleniti earum vel! Consequuntur ipsam quisquam nemo voluptatem id molestiae, reprehenderit illum natus omnis nobis porro sit sint veniam earum sapiente dolorem eum non deserunt! Saepe nostrum reprehenderit modi voluptatem corporis culpa accusantium. Maxime fuga, aliquam laboriosam culpa ipsum, minus officiis quasi aperiam ratione, vel beatae. Repellat, iusto placeat? Architecto sequi nam ullam numquam odio. Soluta dolore quas vel quaerat doloribus, vitae explicabo assumenda sunt fugiat consequatur illo, ipsa nam quia sit! Praesentium aliquid animi ex libero necessitatibus modi voluptas! Consequatur?",
          container: this.userContainer,
          targetlang: "en",
        });
      }, 1000);
      return;
    }
    if (imgs && imgs.length > 0) this.getAiAnswer({ text, imgs });
    else this.getAiAnswer({ text });
  }

  async animateProgressBar(currProgress, nextProgress, duration = 500) {
    if (!this.progressBar) return;
    this.statusContainer?.classList.remove("hidden");

    await asyncAnim(
      this.progressBar,
      [{ transform: `scaleX(${currProgress / 100})` }, { transform: `scaleX(${nextProgress / 100})` }],
      {
        duration: duration,
        fill: "forwards",
        ease: "ease-out",
      }
    );
  }

  async endStatusAnimation() {
    await this.animateProgressBar(this.currentProgress, 100, 200);
    this.statusContainer?.classList.add("hidden");
    this.currentProgress = 0;
    this.nextProgress = 0;
    this.centralFinished = false;
  }

  async addStatus({ text, textEl, container }) {
    const topStatus = getTopStatus(text);

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

      container.appendChild(this.statusContainer);
      this.statusContainer.appendChild(this.topStatus);
      this.statusContainer.appendChild(this.progressBarContainer);
      this.progressBarContainer.appendChild(this.progressBar);
    } else {
      // Update status
      this.statusContainer.removeChild(this.lastStatus);
    }
    this.lastStatus = textEl;

    if (topStatus && (topStatus !== this.currentTopStatus || !this.currentTopStatus)) {
      this.updateTopStatus({ status: text, topStatus, container: this.topStatus });
      this.currentTopStatus = topStatus;
    }

    this.statusContainer.appendChild(textEl);
  }

  async updateTopStatus({ topStatus }) {
    if (!this.typingStatus) {
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
    this.statusContainer.style.display = "none";
    this.resetStatuses();
  }

  async addAIText({ text, container, targetlang, type = null } = {}) {
    let textContainer = container.querySelector(".text__container");

    if (!textContainer) {
      textContainer = document.createElement("div");
      textContainer.className = "text__container";
      container.appendChild(textContainer);
    }

    // if (!this.tabs) {
    //   this.tabs = new DiscussionTabs({
    //     container: container,
    //     emitter: this.emitter,
    //     removeStatus: this.removeStatus,
    //     scrollToBottom: this.scrollToBottom,
    //   });
    // }

    if (container !== this.currentAnswerContainer) {
      this.currentAnswerContainer = container;
      this.tabs = new DiscussionTabs({
        container: container,
        emitter: this.emitter,
        removeStatus: this.removeStatus,
        scrollToBottom: this.scrollToBottom,
      });
    }

    this.typingText?.fadeOut();
    this.emitter.emit("addAIText", text, targetlang);

    const textEl = document.createElement("span");

    // if (type === "status") {
    //   textEl.className = "AIstatus";
    //   this.addStatus({ text, textEl, container : textContainer });
    //   this.statusContainer.appendChild(textEl);
    //   return typeByWord(textEl, text);
    // } else if (this.lastStatus) {
    //   this.removeStatus({ container: textContainer });
    // }
    textContainer.appendChild(textEl);

    // text = text.replace(/<br\/?>\s*/g, "\n");
    // if (type !== "status") this.scrollToBottom();
    if (type === "images") return;
    return typeByWord(textEl, text);
  }

  addURL({ text, label, url, container }) {
    // this.scrollToBottom();
    this.makePreviousElementsScrollUp();

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
    // this.scrollToBottom();
  }

  initImages() {
    this.tabs?.addTab("Images");
  }

  addImages({ imgSrcs = [], container } = {}) {
    this.tabs?.initImages(imgSrcs);
    this.typingStatus = null;
    // container?.appendChild(this.topStatus);
  }

  addSources(sourcesData) {
    this.tabs?.addTab("Sources");
    this.tabs?.initSources(sourcesData);
  }

  // Scroll
  scrollToBottom() {
    // If overflow remove the height from history
    // if (this.discussionContainer.scrollHeight > this.discussionContainer.clientHeight) {
    //   this.discussionContainer.style.height = "unset";
    // }
    // window.scrollTo({
    //   top: document.body.scrollHeight,
    //   behavior: "smooth",
    // });
  }

  makePreviousElementsScrollUp({ isSmooth = true } = {}) {
    const paddingTop = parseInt(getStyleElement(this.discussionContainer, "padding-top"));
    this.discussionContainer.style.paddingBottom = `calc(100vh - ${paddingTop}px)`;

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: isSmooth ? "smooth" : "auto",
    });
    // setTimeout(() => {
    //   this.isAutoScrollActive = true;
    // }, 1000);
  }

  async onScrollTop() {
    const { container } = await this.history.getHistory({ uuid: this.uuid });
    this.discussionContainer.prepend(container);
    document.body.scrollTop = document.documentElement.scrollTop = container.offsetHeight;
  }

  onChangeHeightDiscussionContainer() {
    const scrollY = window.scrollY;
    const scrollView = scrollY + window.innerHeight * 0.8;
    const containerHeight = this.discussionContainer.clientHeight - window.innerHeight;
    const isOverflow = containerHeight > scrollView;
    if (isOverflow && scrollY > 0 && this.isAutoScrollActive) {
      // Scroll to bottom
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  onUserContainerAppend(mutationsList) {
    for (const mutation of mutationsList) {
      const container = mutation.addedNodes[0];
      if (container.classList.contains("discussion__user")) {
        // Wait for window scroll
        setTimeout(() => {
          this.removeUnuusedBottomScroll();
        }, 2000);
      }
    }
  }
  removeUnuusedBottomScroll() {
    const scrollY = window.scrollY + window.innerHeight;
    const pageHeight = document.body.scrollHeight;
    const scrollDistance = pageHeight - scrollY;
    if (scrollDistance <= 0) return;
    const paddingTop = parseInt(getStyleElement(this.discussionContainer, "padding-top"));
    this.discussionContainer.style.paddingBottom = `calc(100vh - ${scrollDistance + paddingTop}px)`;
    document.body.scrollTop = document.documentElement.scrollTop = document.body.scrollHeight;
    this.isAutoScrollActive = true;
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

    if (localStorage.getItem("language") && localStorage.getItem("language") != "") {
      this.Chat.sourcelang = localStorage.getItem("language");
      if (this.Chat.sourcelang != "ad") {
        this.Chat.autodetect = false;
      }
    }
    if (q && q != "") {
      //   this.getAiAnswer({ text: "" });
    }

    if (sessionID && sessionID != "") {
      this.toPageGrey();
      this.Chat.sessionID = sessionID;
      this.Chat.deploy_ID = deploy_ID;
      //   this.getAiAnswer({ text: "" });
    } else {
      // this.toPageGrey();
      var usr = await this.user;
      if (usr) {
        let data = await getsessionID(usr);
        this.Chat.sessionID = data.SessionID;
        this.Chat.deploy_ID = data.deploy_id;
        // this.getAiAnswer({ text: "" });
      }
    }
    this.uuid = this.Chat.deploy_ID;

    await this.updateHstory({ uuid: this.uuid });
    this.emitter.emit("taskManager:isHistorySet", true);
    this.getAiAnswer({ text: "" });
  }

  async updateHstory({ uuid }) {
    return new Promise(async (resolve, reject) => {
      const { container } = await this.history.getHistory({ uuid });
      this.discussionContainer.appendChild(container);
      this.makePreviousElementsScrollUp({ isSmooth: false });
      setTimeout(() => {
        this.removeUnuusedBottomScroll();
      }, 1000);
      resolve();
    });
  }

  // Taks
  async onCreatedTask(task, textAI) {
    if (this.debug) {
      this.userContainer = document.createElement("div");
      this.userContainer.classList.add("discussion__user");
      var userContainerspan = document.createElement("span");
      userContainerspan.classList.add("discussion__userspan");
      userContainerspan.innerHTML = "bonjour";
      this.userContainer.appendChild(userContainerspan);
      // this.userContainer.innerHTML = "bonjour";
      this.discussionContainer.appendChild(this.userContainer);

      this.AIContainer = document.createElement("div");
      this.AIContainer.classList.add("discussion__ai");
      this.discussionContainer.appendChild(this.AIContainer);
    }

    if (!this.history.isSet || this.history.isFetching) return;
    if (!this.userContainer) {
      this.userContainer = document.createElement("div");
      this.userContainer.classList.add("discussion__user");
      this.discussionContainer.appendChild(this.userContainer);
    }
    await this.addAIText({ text: textAI, container: this.AIContainer });
    this.userContainer.classList.add("discussion__user--task-created");
    this.AIContainer.classList.add("discussion__ai--task-created");
    this.userContainer.setAttribute("taskKey", task.key);
    this.AIContainer.setAttribute("taskKey", task.key);
  }

  onUserAnswerTask(text, task) {
    this.Chat.submituserreply(text, task.workflowID);
  }

  onStatusUpdate(taskKey, status) {
    // if (status.type === TASK_STATUSES.COMPLETED) {
    //   const userContainer = this.discussionContainer.querySelector(`.discussion__user[taskKey="${taskKey}"]`);
    //   const AIContainer = this.discussionContainer.querySelector(`.discussion__ai[taskKey="${taskKey}"]`);
    //   userContainer.classList.remove("discussion__user--task-created");
    //   AIContainer.classList.remove("discussion__ai--task-created");
    // }
  }

  async onRemoveTask(taskKey) {
    // Post delete task
    const params = {
      micro_thread_id: taskKey,
      uuid: this.uuid,
    };

    const result = await fetcher({
      url: URL_DELETE_STATUS,
      params,
      method: "DELETE",
    });
    // Remove elements
    const userContainer = this.discussionContainer.querySelector(`.discussion__user[taskKey="${taskKey}"]`);
    const AIContainer = this.discussionContainer.querySelector(`.discussion__ai[taskKey="${taskKey}"]`);
    userContainer.remove();
    AIContainer.remove();
  }

  async viewTaskResults(task, resultsContainer) {
    if (!resultsContainer) return;
    const userContainer = this.discussionContainer.querySelector(`.discussion__user[taskKey="${task.key}"]`);
    const AIContainer = this.discussionContainer.querySelector(`.discussion__ai[taskKey="${task.key}"]`);
    if (userContainer) userContainer.style.display = "none";
    if (AIContainer) AIContainer.style.display = "none";

    // Reput user question
    this.userContainer = document.createElement("div");
    this.userContainer.classList.add("discussion__user");
    var userContainerspan = document.createElement("span");
    userContainerspan.classList.add("discussion__userspan");
    userContainerspan.innerHTML = task.name;
    this.userContainer.appendChild(userContainerspan);
    // this.userContainer.innerHTML = task.name;

    // Add AI results
    this.AIContainer = document.createElement("div");
    this.AIContainer.classList.add("discussion__ai");
    this.AIContainer.appendChild(resultsContainer);

    this.discussionContainer.appendChild(this.userContainer);
    this.discussionContainer.appendChild(this.AIContainer);

    // Update task to viewed
    const response = await this.history.postViewTask({
      uuid: this.uuid,
      micro_thread_id: task.key,
      session_id: this.Chat.sessionID,
    });

    // scroll to this.userContainer
    const margin = 75;
    window.scrollTo({
      top: this.userContainer.offsetTop - margin,
      behavior: "smooth",
    });

    // await this.addAIText({ text: result, container: this.AIContainer });
  }

  addListeners() {
    window.addEventListener("load", this.onLoad());

    // Check if the user is scrolling

    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY + window.innerHeight;
      // TODO remove it
      const pageHeight = document.body.scrollHeight;
      const scrollDistance = pageHeight - scrollY;
      if (scrollDistance > 200) {
        this.isAutoScrollActive = false;
      }

      if (window.scrollY === 0) this.onScrollTop();
    });

    this.emitter.on("centralFinished", () => {
      this.centralFinished = true;
      this.endStatusAnimation();
    });

    this.emitter.on("paEnd", async () => {
      await this.endStatusAnimation();
      this.removeStatus({ container: this.discussionContainer });
      this.tabs?.displayDefaultTab();
      this.tabs?.showSourcesTab();
      this.tabs = null;
    });

    this.emitter.on("taskManager:createTask", (task, textAI) => this.onCreatedTask(task, textAI));
    this.emitter.on("taskManager:updateStatus", (taskKey, status) => this.onStatusUpdate(taskKey, status));
    this.emitter.on("taskManager:inputSubmit", (text, task) => this.onUserAnswerTask(text, task));
    this.emitter.on("taskManager:deleteTask", (taskKey) => this.onRemoveTask(taskKey));
    this.emitter.on("taskManager:viewResults", (task, resultsContainer) =>
      this.viewTaskResults(task, resultsContainer)
    );

    window.addEventListener("load", this.onLoad.bind(this));

    const resizeObserver = new ResizeObserver(this.onChangeHeightDiscussionContainer.bind(this));
    resizeObserver.observe(this.discussionContainer);

    const observer = new MutationObserver((mutationsList) => {
      this.onUserContainerAppend(mutationsList);
    });
    observer.observe(this.discussionContainer, { childList: true });
  }
}
