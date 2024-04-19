import anim from "../utils/anim";
import loadImages from "../utils/loadImages";

function getDomainAndFavicon(url) {
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  const favicon = `https://${domain}/favicon.ico`;
  return { domain, favicon };
}

export default class DiscussionMedia {
  constructor({ container, emitter }) {
    this.container = container;
    this.emitter = emitter;
    this.imagesSkeletons = [];

    this.init();
  }

  init() {
    this.topWrapper = document.createElement("div");
    this.topWrapper.className = "discussion__top-wrapper none";

    this.bottomWrapper = document.createElement("div");
    this.bottomWrapper.className = "discussion__bottom-wrapper none";

    this.container.prepend(this.topWrapper);
    this.container.appendChild(this.bottomWrapper);
  }

  addSources(sourcesData) {
    this.topWrapper.classList.remove("none");
    this.sourcesHeader = document.createElement("h3");
    this.sourcesHeader.className = "discussion__sources-header";
    this.sourcesHeader.innerText = "Sources";

    this.topWrapper.appendChild(this.sourcesHeader);

    this.sources = document.createElement("div");
    this.sources.className = "sources-container";

    for (let source of sourcesData) {
      if (!source) continue;
      const sourceEl = document.createElement("a");
      sourceEl.classList.add("sources-item");
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

    this.topWrapper.appendChild(this.sources);
  }

  async addImages(srcs) {
    this.bottomWrapper.classList.remove("none");

    this.imagesHeader = document.createElement("h3");
    this.imagesHeader.className = "discussion__images-header";
    this.imagesHeader.innerText = "Images";

    this.bottomWrapper.appendChild(this.imagesHeader);

    this.imagesContainer = document.createElement("div");
    this.imagesContainer.className = "discussion__images-container user-images";
    this.createImageSkeletons();
    const successfulSrcs = await loadImages(srcs);
    this.destroyImageSkeletons();

    const imgs = successfulSrcs.map((src) => {
      const img = document.createElement("img");
      img.src = src;
      this.imagesContainer.appendChild(img);
      return img;
    });

    this.handleImgClick(imgs);
    this.bottomWrapper.appendChild(this.imagesContainer);
  }

  async addUserImages(srcs) {
    this.topWrapper.classList.remove("none");
    const imagesContainer = document.createElement("div");
    imagesContainer.classList.add("discussion__images-container");

    const successfulSrcs = await loadImages(srcs);
    successfulSrcs.map((src) => {
      const img = document.createElement("img");
      img.src = src;
      imagesContainer.appendChild(img);
    });

    this.topWrapper.appendChild(imagesContainer);
  }

  handleImgClick(imgs) {
    imgs.forEach((img, i) => {
      img.addEventListener("click", () => {
        this.openSlider(imgs, i);
      });
    });
  }

  openSlider(imgs, currentIndex) {
    this.emitter.emit("slider:open", { imgs, currentIndex });
  }

  createImageSkeletons() {
    this.skeletonContainer = document.createElement("div");
    this.skeletonContainer.className = "image__skeleton-container";

    for (let i = 0; i < 8; i++) {
      let skeleton = document.createElement("div");
      skeleton.classList.add("image__skeleton-item");
      this.imagesSkeletons.push(skeleton);
    }

    this.imagesSkeletons.forEach((skeleton) => this.skeletonContainer.appendChild(skeleton));
    this.bottomWrapper.appendChild(this.skeletonContainer);

    this.imagesSkeletons.forEach((skeleton, idx) => {
      anim(skeleton, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], {
        duration: 500,
        delay: 50 * idx,
        fill: "forwards",
        ease: "ease-out",
      });
    });
  }

  destroyImageSkeletons() {
    this.imagesSkeletons.forEach((skeleton) => this.skeletonContainer.removeChild(skeleton));
  }
}