import { backgroundColorGreyPage } from "../../scss/variables/_colors.module.scss";
import TypingText from "../TypingText";
import Chat from "./Chat.js";
import History from "./History.js";
import DiscussionMedia from "./DiscussionMedia.js";
import fetcher from "../utils/fetcher.js";
import { getsessionID } from "../User";

import { URL_DELETE_STATUS } from "./constants.js";
import { gsap } from "gsap";
import fadeByWord from "../utils/fadeByWord.js";
import { flightSearchData, flightSearchResultsData } from "../../testData.js";

export default class Discussion {
  constructor({ toPageGrey, emitter, pageEl, user }) {
    this.emitter = emitter;
    this.toPageGrey = toPageGrey;
    this.user = user;
    this.pageEl = pageEl;

    // DOM Elements
    this.inputContainer = this.pageEl.querySelector("div.input__container");
    this.inputText = this.pageEl.querySelector(".input-text");
    this.discussionWrapper = document.querySelector(".discussion__wrapper");
    this.historyContainer = document.querySelector(".history__container");
    this.discussionContainer = document.querySelector(".discussion__container");

    // States
    this.currentProgress = 0;
    this.nextProgress = 0;

    this.isHistoryLoading = true;
    this.currentTopStatus = null;
    this.lastStatus = null;
    this.centralFinished = false;
    this.currentAnswerContainer = null;
    this.isAutoScrollActive = true;

    this.debug = import.meta.env.VITE_DEBUG === "true";
    this.layout_debug = import.meta.env.VITE_LAYOUT_DEBUG === "true";

    // Init Methods
    this.addUserElement = this.addUserElement.bind(this);

    this.Chat = new Chat({
      discussionContainer: this.discussionContainer,
      addAIText: this.addAIText.bind(this),
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
    // DEBUG
    if (this.debug) {
      // this.onCreatedTask();
      this.enableInput();
    }
  }

  // DEBUG
  showDebugButtons() {
    const debugContainer = document.createElement("div");
    debugContainer.className = "debug-container";

    const flightButton = document.createElement("button");
    flightButton.innerHTML = "Flight";
    flightButton.addEventListener("click", () => {
      const flightCards = this.Chat.getFlightUI(flightSearchData, flightSearchResultsData);
      const AIContainer = document.createElement("div");
      AIContainer.classList.add("discussion__ai");
      AIContainer.appendChild(flightCards);
      this.discussionContainer.appendChild(AIContainer);
    });
    debugContainer.appendChild(flightButton);
    document.body.appendChild(debugContainer);
  }

  // INPUT
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

  getAiAnswer({ text, imgs, isLiveMode = false }) {
    this.AIContainer = document.createElement("div");
    this.AIContainer.classList.add("discussion__ai");
    this.discussionContainer.appendChild(this.AIContainer);

    this.typingText = new TypingText({
      text: "",
      container: this.AIContainer,
      backgroundColor: backgroundColorGreyPage,
      marginLeft: 16,
    });

    this.emitter.emit("pre-text-animation");
    this.typingText.fadeIn();
    this.typingText.displayTextSkeleton();
    this.Chat.callsubmit(text, imgs, this.AIContainer, isLiveMode);
  }

  resetStatuses() {
    this.typingStatus = null;
    this.lastStatus = null;
    this.currentTopStatus = null;
  }

  moveChildrenToPrevContainer() {
    this.historyContainer.classList.add("hidden");
    const children = Array.from(this.discussionContainer.childNodes);

    children.forEach((child) => {
      this.historyContainer.appendChild(child);
    });
    this.scrollToBottom();

    // Wait for scroll finish
    setTimeout(() => {
      this.historyContainer.classList.remove("hidden");
    }, 1000);
  }

  async addUserElement({ text, imgs, debug = false, isFromVideo } = {}) {
    //reduced the duration to save time
    await gsap.to(this.discussionContainer, { duration: 0.0005, y: -40, opacity: 0, ease: "power2.inOut" });
    this.moveChildrenToPrevContainer();

    if (imgs?.length > 0 && !isFromVideo) {
      const userContainer = document.createElement("div");
      userContainer.classList.add("discussion__user");
      this.discussionContainer.appendChild(userContainer);

      this.media = new DiscussionMedia({
        container: userContainer,
        emitter: this.emitter,
      });

      this.media.addUserImages(imgs.map((img) => img.src));
    }

    this.userContainer = document.createElement("div");
    this.userContainer.classList.add("discussion__user");
    const userContainerspan = document.createElement("span");
    userContainerspan.classList.add("discussion__userspan");
    userContainerspan.innerHTML = text.replace(/\n/g, "<br>");
    this.userContainer.appendChild(userContainerspan);

    this.discussionContainer.appendChild(this.userContainer);

    //moves this to save time
    if (imgs && imgs.length > 0) {
      this.getAiAnswer({ text, imgs, isLiveMode: isFromVideo });
    } else this.getAiAnswer({ text });

    gsap.fromTo(
      this.discussionContainer,
      { y: 20, opacity: 0 },
      { duration: 0.5, delay: 0.2, y: 0, opacity: 1, ease: "power2.inOut" }
    );

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
  }

  async addAIText({ text, container, targetlang, type = null } = {}) {
    let textContainer = container.querySelector(".text__container");
    if (!textContainer) {
      textContainer = document.createElement("div");
      textContainer.className = "text__container";
      container.appendChild(textContainer);
    }

    if (container !== this.currentAnswerContainer) {
      this.currentAnswerContainer = container;
    }

    this.typingText?.fadeOut();
    this.emitter.emit("addAIText", text, targetlang);

    if (type === "images") return;
    return fadeByWord(textContainer, text, 100);
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
  }

  // Scroll
  scrollToBottom(isSmooth = true) {
    this.pageEl.scrollTo({
      top: this.pageEl.scrollHeight,
      behavior: isSmooth ? "smooth" : "auto",
    });
  }

  async onScrollTop() {
    console.log("ON SCROLL TOP");
    const { container } = await this.history.getHistory({ uuid: this.uuid, user: this.user });
    this.historyContainer.prepend(container);
    // only if there is more history to be added, we change the scrollTop value so the user stays at the same spot
    if (container.hasChildNodes()) {
      this.pageEl.scrollTop = document.documentElement.scrollTop = container.offsetHeight;
    }
  }

  async onLoad() {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var q = urlParams.get("q");
    let sessionID = urlParams.get("session_id");
    let deploy_ID = urlParams.get("deploy_id");
    this.Chat.autodetect = true;

    if (urlParams.get("location") && urlParams.get("location") != "") {
      this.Chat.location = urlParams.get("location");
    }

    if (localStorage.getItem("language") && localStorage.getItem("language") != "") {
      this.Chat.sourcelang = localStorage.getItem("language");
      if (this.Chat.sourcelang != "ad") {
        this.Chat.autodetect = false;
      }
    }

    if (sessionID && sessionID != "") {
      // this.toPageGrey();
      this.Chat.sessionID = sessionID;
      this.Chat.deploy_ID = deploy_ID;
    } else {
      var usr = await this.user;
      if (usr) {
        let data = await getsessionID(usr);
        this.Chat.sessionID = data.SessionID;
        this.Chat.deploy_ID = data.deploy_id;
      }
    }
    this.uuid = this.Chat.deploy_ID;

    if (this.debug) return;
    await this.updateHistory({ uuid: this.uuid, user: this.user });
    this.scrollToBottom(false);
    this.isHistoryLoading = false;
    this.emitter.emit("taskManager:isHistorySet", true);

    this.enableInput();
  }

  async updateHistory({ uuid, user }) {
    // hide the previous discussion container while it is loading to avoid scroll jumps
    this.historyContainer.style.display = "none";

    await new Promise(async (resolve, reject) => {
      const { container } = await this.history.getHistory({ uuid, user, size: 10 });
      this.historyContainer.appendChild(container);
      const imgs = this.historyContainer.querySelectorAll("img");
      let imgLoadedCount = 0;
      const totalImages = imgs.length;

      const showHistory = () => {
        this.historyContainer.style.display = "block";
        this.scrollToBottom(false);
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

  // Tasks
  async onCreatedTask(task, textAI) {
    if (this.debug) {
      this.userContainer = document.createElement("div");
      this.userContainer.classList.add("discussion__user");
      var userContainerspan = document.createElement("span");
      userContainerspan.classList.add("discussion__userspan");
      userContainerspan.innerHTML = "who's obama ?";
      this.userContainer.innerHTML = "bonjour";

      this.AIContainer = document.createElement("div");
      this.AIContainer.classList.add("discussion__ai");
      this.addAIText({
        text: "",
        container: this.AIContainer,
      });

      this.discussionContainer.appendChild(this.userContainer);
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
    this.userContainer.setAttribute("taskkey", task.key);
    this.AIContainer.setAttribute("taskkey", task.key);
  }

  onUserAnswerTask(text, task) {
    this.Chat.submituserreply(text, task.workflowID);
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
      idToken: await this.user.user.getIdToken(true),
      method: "DELETE",
    });

    // Remove elements
    const userContainer = this.discussionWrapper.querySelector(`.discussion__user[taskkey="${taskKey}"]`);
    const AIContainer = this.discussionWrapper.querySelector(`.discussion__ai[taskkey="${taskKey}"]`);

    userContainer.remove();
    AIContainer.remove();
  }

  checkIfPrevDiscussionContainerVisible() {
    let options = {
      rootMargin: "-96px",
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.historyContainer.classList.remove("hidden");
          this.historyContainer.classList.add("visible");
        } else {
          this.historyContainer.classList.remove("visible");
          this.historyContainer.classList.add("hidden");
        }
      });
    };

    let observer = new IntersectionObserver(observerCallback, options);
    observer.observe(this.historyContainer);
  }

  addListeners() {
    window.addEventListener("load", this.onLoad());

    this.pageEl.addEventListener("scroll", () => {
      if (this.isHistoryLoading) return;
      if (this.pageEl.scrollTop === 0) this.onScrollTop();
    });

    this.checkIfPrevDiscussionContainerVisible();

    this.emitter.on("centralFinished", () => {
      this.centralFinished = true;
    });

    this.emitter.on("taskManager:createTask", (task, textAI) => this.onCreatedTask(task, textAI));
    this.emitter.on("taskManager:inputSubmit", (text, task) => this.onUserAnswerTask(text, task));
    this.emitter.on("taskManager:deleteTask", (taskKey) => this.onRemoveTask(taskKey));
  }
}
