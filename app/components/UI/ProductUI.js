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

  formatPrice(price) {
    return price.includes(".00") ? price.substring(0, price.indexOf(".00")) : price;
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
    productCardContainer.className = "products-ui__product-container";

    const price = this.formatPrice(productData.price);

    const linkWrapper = document.createElement("a");
    linkWrapper.setAttribute("href", productData.link);
    linkWrapper.setAttribute("target", "_blank");

    linkWrapper.innerHTML = `
      <div class="products-ui__product-infos">
        <div class="products-ui__product-details">
          <h3>${productData.title}</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
        <div class="products-ui__product-image">
          <img src="${productData.imageUrl}" alt="${productData.title}">
        </div>
      </div>
      <p class="shopping-price">${price}</p>
    `;

    productCardContainer.appendChild(linkWrapper);

    return productCardContainer;
  }

  getElement() {
    return this.mainContainer;
  }
}
