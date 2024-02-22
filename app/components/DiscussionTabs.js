function getDomainAndFavicon(url) {
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  const favicon = `https://${domain}/favicon.ico`;
  return { domain, favicon };
}


export default class DiscussionTabs {
  constructor({container, removeStatus, scrollToBottom, emitter}){
    this.container = container;
    this.emitter = emitter;
    this.removeStatus = removeStatus;
    this.scrollToBottom = scrollToBottom;
      
    this.selectedTab = "Images";

    this.tabs = null;
    this.sources = null;
    this.imagesContainer = null;
  }

  updateTabs(addedTab) {
    if (this.tabs){
      this.addTab(addedTab)
    } else {
      this.initTabs(addedTab)
    }
  }

  initTabs(firstTab){
    console.log("from init : ", this.container)
    this.tabs = document.createElement("ul");
    this.tabs.classList.add("discussion__tab");
  
    this.container.appendChild(this.tabs);
    this.addTab(firstTab)
  } 

  addTab(tabName) {
    console.log("from add", this.tabs)
    const li = document.createElement("li");
    if (tabName === "Images") {
      li.style.order = 0;
    } else {
      li.style.order = 1;
    }
    if (tabName === this.selectedTab) li.classList.add("active");
    li.textContent = tabName;
  
    this.tabs.appendChild(li);
    this.handleTabClick(li);
  }

  handleTabClick(tab) {
    tab.addEventListener("click", () => {
      // Remove 'active' class from all tabs
      this.tabs.querySelectorAll('li').forEach(li => li.classList.remove('active'));
  
      // Add 'active' class to the clicked tab
      tab.classList.add('active');
  
      this.selectedTab = tab.textContent;
  
      if (this.selectedTab === "Sources") {
        this.sources.classList.remove("none");
        this.imagesContainer.classList.add("none");
      } else if (this.selectedTab === "Images") {
        this.sources.classList.add("none");
        this.imagesContainer.classList.remove("none");
      }
    });
  }

  initSources(sourcesData){
    this.sources = document.createElement("div");
    this.sources.className = "images__sources none";

    for (let source of sourcesData) {
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

    this.container.appendChild(this.sources);
  }

  async initImages(srcs){
    this.imagesContainer = document.createElement("div");
    this.imagesContainer.className = "images__container";

    const successfulSrcs = await this.loadImages(srcs);

    // right before adding the images we remove the skeletons
    const skeletonContainer = this.container.querySelector(".image-skeleton .typing__skeleton-container");
    skeletonContainer.classList.add("hidden"); 

    const imgs = successfulSrcs.map((src) => {
      const img = document.createElement("img");
      img.src = src;
      this.imagesContainer.appendChild(img);
      return img;
    });

    this.handleImgClick(imgs);
    this.removeStatus({ container: this.container });
    const aiStatus = this.container.querySelector(".AIstatus");
    if (aiStatus) aiStatus.remove();
    this.container.appendChild(this.imagesContainer);
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
}