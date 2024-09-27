import truncate from "../../utils/truncate";

export default class ProductUI {
  constructor(productsData) {
    this.productsData = productsData;

    // DOM Elements
    this.mainContainer = null;

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

  initUI() {
    this.mainContainer = document.createElement("div");
    this.mainContainer.classList.add("products-ui__main-container");

    this.createHeaderUI();

    const productcardcontainerdiv = document.createElement("div");
    productcardcontainerdiv.className = "products-ui__products-container";
    this.mainContainer.appendChild(productcardcontainerdiv);

    this.productsData.forEach((element) => {
      const productCard = this.createProductCard(element);
      productcardcontainerdiv.appendChild(productCard);
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

  createProductCard(productData) {
    const productCardContainer = document.createElement("div");
    productCardContainer.className = "shopping-card";

    const productcarddivA = document.createElement("a");
    productcarddivA.setAttribute("href", productData.link);
    productcarddivA.setAttribute("target", "_blank");

    productcarddivA.innerHTML = `
      <div class="shopping-image-dev">
        <img class="shopping-image" src="${productData.imageUrl}" alt="${productData.title}">
      </div>
      <h3 class="shopping-name">${truncate(productData.title, 30)}</h3>
      <p class="shopping-source">${productData.source}</p>
      <p class="shopping-price">${
        productData.price.includes(".00")
          ? productData.price.substring(0, productData.price.indexOf(".00"))
          : productData.price
      }</p>
      <div class="shopping-overlay"></div>
    `;

    productCardContainer.appendChild(productcarddivA);

    return productCardContainer;
  }

  getElement() {
    return this.mainContainer;
  }
}
