import getDomainAndFavicon from "../../utils/getDomainAndFavicon";
import UIComponent from "./UIComponent";

export class ProductUI extends UIComponent {
  constructor(productsData) {
    super();
    this.productsData = productsData;

    // DOM Elements
    this.stars = [];

    // Init Methods
    this.initUI();
  }

  countSources() {
    let sources = [];

    this.productsData.forEach((product) => {
      // Normalize the source string
      let normalizedSource = product.source.trim().toLowerCase();

      if (!sources.includes(normalizedSource)) {
        sources.push(normalizedSource);
      }
    });

    return sources.length;
  }

  formatPrice(price) {
    // Replace any Unicode escape sequence with its corresponding symbol
    let formattedPrice = price.replace("\\u20ac", "€").replace("\\u0024", "$");

    // Remove ".00" if present
    if (formattedPrice.includes(".00")) {
      formattedPrice = formattedPrice.substring(0, formattedPrice.indexOf(".00"));
    }

    return formattedPrice;
  }

  initUI() {
    this.mainContainer = document.createElement("div");
    this.mainContainer.classList.add("products-ui__main-container");

    this.createHeaderUI();

    const productcardcontainerdiv = document.createElement("div");
    productcardcontainerdiv.className = "products-ui__products-container";
    this.mainContainer.appendChild(productcardcontainerdiv);

    this.productsData.forEach(async (element) => {
      const productCard = await this.createProductCard(element);
      productcardcontainerdiv.appendChild(productCard);
      await this.updateSourceFavicon(element.link, productCard);
    });
  }

  createHeaderUI() {
    this.headerContainer = document.createElement("div");
    this.headerContainer.classList.add("products-ui__header");
    const sourcesTotal = this.countSources();

    this.headerContainer.innerHTML = `
      <p class="products-ui__sources">
        Searched ${sourcesTotal} sites
      </p>
    `;

    this.mainContainer.appendChild(this.headerContainer);
  }

  async createProductCard(productData) {
    const productCardContainer = document.createElement("div");
    productCardContainer.className = "products-ui__product-container";
    productCardContainer.style.order = productData;

    const price = this.formatPrice(productData.price);
    const faviconContainer = document.createElement("div");
    faviconContainer.className = "products-ui__product-source-logo placeholder";

    const linkWrapper = document.createElement("a");
    linkWrapper.setAttribute("href", productData.link);
    linkWrapper.setAttribute("target", "_blank");

    linkWrapper.innerHTML = `
      <div class="products-ui__product-header">
        <div class="products-ui__product-source-logo placeholder">
        </div>
        <p class="products-ui__product-source">${productData.source}</p>
      </div> 
      <div class="products-ui__product-image">
        <img src="${productData.imageUrl}" alt="${productData.title}">
      </div>
      <div class="products-ui__product-details">
        <h3>${productData.title}</h3>
      </div>
      <div class="products-ui__product-footer">
        <p class="products-ui__product-price">${price}</p>
        <div class="products-ui__product-rating">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.75289 11L5.99628 9.28955L9.23583 11L8.61566 7.38222L11.2389 4.81848L7.61417 4.29339L5.99637 1L4.37472 4.29339L0.75 4.81848L3.37323 7.38222L2.75289 11Z" fill="#959FB1" style="mix-blend-mode:multiply"/>
          </svg>
          <p>${productData.rating} </p>
        </div>
      </div>
    `;

    productCardContainer.appendChild(linkWrapper);
    return productCardContainer;
  }

  async updateSourceFavicon(source, cardContainer) {
    const faviconContainer = cardContainer.querySelector(".products-ui__product-source-logo");

    const baseUrl = new URL(source).origin;
    const { favicon } = getDomainAndFavicon(baseUrl);

    await new Promise((resolve, reject) => {
      const img = new Image();
      img.src = favicon;
      img.onload = () => {
        faviconContainer.appendChild(img);
        resolve();
      };
      img.onerror = (e) => {
        resolve();
      };
    });

    faviconContainer.classList.remove("placeholder");

    return faviconContainer;
  }
}
