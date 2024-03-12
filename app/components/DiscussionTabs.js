import anim from "../utils/anim";

function getDomainAndFavicon(url) {
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  const favicon = `https://${domain}/favicon.ico`;
  return { domain, favicon };
}

export default class DiscussionTabs {
  constructor({ container, removeStatus, scrollToBottom, emitter }) {
    this.container = container;
    this.emitter = emitter;
    this.removeStatus = removeStatus;
    this.scrollToBottom = scrollToBottom;

    this.selectedTab = "";
    this.tabsHeaderContainer = null;
    this.tabsContentContainer = null;

    this.tabs = [];
    this.imagesSkeletons = [];
    this.sources = null;
    this.imagesContainer = null;

    this.init();
  }

  init() {
    if (this.tabsHeaderContainer || this.tabsContentContainer) return;
    this.tabsHeaderContainer = document.createElement("ul");
    this.tabsHeaderContainer.className = "discussion__tabs-header hidden";
    this.tabsContentContainer = document.createElement("div");
    this.tabsContentContainer.className = "discussion__tabs-content hidden";

    this.container.appendChild(this.tabsHeaderContainer);
    this.container.appendChild(this.tabsContentContainer);
  }

  addTab(tabName) {
    const li = document.createElement("li");
    li.className = tabName;
    if (tabName === "Images") {
      li.style.order = 0;
    } else {
      li.style.order = 1;
    }

    li.textContent = tabName;

    this.tabs.push(tabName);

    this.tabsHeaderContainer.appendChild(li);
    if (tabName === "Images") {
      this.createImageSkeletons(li);
    }
    this.handleTabClick(li);
  }

  handleTabClick(tab) {
    tab.addEventListener("click", () => {
      this.updateTabUi(tab);
    });
  }

  updateTabUi(tab) {
    if (!tab) return;

    if (this.selectedTab === tab.textContent) {
      // If the clicked tab is already the selected tab, remove 'active'
      tab.classList.remove("active");
      this.selectedTab = ""; // Reset selectedTab
    } else {
      // If the clicked tab is not the selected tab, make it active
      this.tabsHeaderContainer.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
      tab.classList.add("active");
      this.selectedTab = tab.textContent;
    }

    // displaying, or not, the section based on the selected tab
    if (this.selectedTab === "Sources") {
      this.sources?.classList.remove("none");
      this.imagesContainer?.classList.add("none");
    } else if (this.selectedTab === "Images") {
      this.sources?.classList.add("none");
      this.imagesContainer?.classList.remove("none");
    } else if (this.selectedTab === "") {
      !this.sources?.classList.contains("none") && this.sources?.classList.add("none");
      !this.imagesContainer?.classList.contains("none") && this.imagesContainer?.classList.add("none");
    }
  }

  displayDefaultTab() {
    // by default if there are images, we display the images tab
    const hasImages = this.tabs.some((tab) => tab === "Images");
    if (hasImages) {
      const defaultTab = this.tabsHeaderContainer.querySelector(".Images");
      this.updateTabUi(defaultTab);
    } else {
      // if there are no images, we display the first tab available
      const defaultTab = this.tabsHeaderContainer.querySelector(`.${this.tabs[0]}`);
      this.updateTabUi(defaultTab);
    }
  }

  showTabs() {
    this.tabsHeaderContainer.classList.remove("hidden");
    this.tabsContentContainer.classList.remove("hidden");
  }

  initSources(sourcesData) {
    this.sources = document.createElement("div");
    this.sources.className = "images__sources none";

    for (let source of sourcesData) {
      if (!source) continue;
      const sourceEl = document.createElement("a");
      sourceEl.classList.add("source");
      sourceEl.href = source;
      sourceEl.target = "_blank";

      const { domain, favicon } = getDomainAndFavicon(source);

      const faviconEl = document.createElement("img");
      faviconEl.src = favicon;
      sourceEl.appendChild(faviconEl);

      const sourceText = document.createElement("span");
      sourceText.textContent = domain;
      sourceEl.appendChild(sourceText);
      this.sources.appendChild(sourceEl);
    }

    this.tabsContentContainer.appendChild(this.sources);
  }

  async initImages(srcs) {
    this.imagesContainer = document.createElement("div");
    this.imagesContainer.className = "images__container";

    const successfulSrcs = await this.loadImages(srcs);

    this.imagesSkeletons.forEach((skeleton) => this.skeletonContainer.removeChild(skeleton));

    const imgs = successfulSrcs.map((src) => {
      const img = document.createElement("img");
      img.src = src;
      this.imagesContainer.appendChild(img);
      return img;
    });

    this.handleImgClick(imgs);
    // // this.removeStatus({ container: this.container });
    // if (aiStatus) this.container.remove(aiStatus);
    this.tabsContentContainer.appendChild(this.imagesContainer);
    this.scrollToBottom();
  }

  handleImgClick(imgs) {
    imgs.forEach((img, i) => {
      img.addEventListener("click", () => {
        this.openSlider(imgs, i);
      });
    });
  }

  openSlider(imgs, currentIndex) {
    console.log("---- in open slider ----");
    this.emitter.emit("slider:open", { imgs, currentIndex });
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = (error) => reject(error);
      img.src = src;
    });
  }

  async loadImages(srcs) {
    const successfulSrcs = [];
    const errors = [];

    await Promise.all(
      srcs.map((src) =>
        this.loadImage(src)
          .then(() => successfulSrcs.push(src))
          .catch((error) => {
            errors.push({ src, error });
            console.log("Error loading image:", error);
          })
      )
    );

    return successfulSrcs;
  }

  createImageSkeletons() {
    this.skeletonContainer = document.createElement("div");
    this.skeletonContainer.className = "typing__skeleton-container skeleton__image";

    for (let i = 0; i < 4; i++) {
      let skeleton = document.createElement("div");
      skeleton.classList.add("typing__skeleton");
      this.imagesSkeletons.push(skeleton);
    }

    this.imagesSkeletons.forEach((skeleton) => this.skeletonContainer.appendChild(skeleton));
    this.tabsHeaderContainer.appendChild(this.skeletonContainer);

    this.imagesSkeletons.forEach((skeleton, idx) => {
      anim(skeleton, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], {
        duration: 500,
        delay: 50 * idx,
        fill: "forwards",
        ease: "ease-out",
      });
    });
  }
}
