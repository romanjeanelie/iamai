function getDomainAndFavicon(url) {
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  const favicon = `https://${domain}/favicon.ico`;
  return { domain, favicon };
}


export default class Images {
  constructor({container, removeStatus, scrollToBottom, openSlider}){
    this.container = container;
    this.removeStatus = removeStatus;
    this.scrollToBottom = scrollToBottom;
    this.openSlider = openSlider;
  }

  initTabs(){
    this.imageTabs = document.createElement("ul");
    this.imageTabs.classList.add("images-tab");

    this.container.appendChild(this.imageTabs);

    const tabs = ["Images", "Sources"];        
    tabs.forEach(tab => {
      const li = document.createElement("li");
      li.textContent = tab;
      this.imageTabs.appendChild(li);
    })
  } 

  initSources(sourcesData){
    const sources = document.createElement("div");
    sources.className = "images__sources none";

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
      sources.appendChild(sourceEl);
    }
    
    this.container.appendChild(sources);
  }

  async initImages(srcs){
    const imagesContainer = document.createElement("div");
    imagesContainer.className = "images__container";

    const successfulSrcs = await this.loadImages(srcs);

    const imgs = successfulSrcs.map((src) => {
      const img = document.createElement("img");
      img.src = src;
      imagesContainer.appendChild(img);
      return img;
    });

    this.attachClickEvent(imgs);
    this.removeStatus({ container: this.container });
    const aiStatus = this.container.querySelector(".AIstatus");
    if (aiStatus) aiStatus.remove();
    this.container.appendChild(imagesContainer);
    this.scrollToBottom();
  }

  attachClickEvent(imgs) {
    imgs.forEach((img, i) => {
      img.addEventListener("click", () => {
        this.openSlider(imgs, i);
      });
    });
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