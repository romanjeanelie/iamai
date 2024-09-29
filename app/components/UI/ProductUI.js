import truncate from "../../utils/truncate";

export default class ProductUI {
  constructor(productsData) {
    this.productsData = productsData;

    // DOM Elements
    this.mainContainer = null;
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
    const ratings = this.createRatingUI(productData.rating);

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
      <div class="products-ui__product-footer">
        <div class="products-ui__product-price-rating">
          <p class="products-ui__product-price">${price}</p>
          ${ratings.outerHTML}
        </div>

        <p class="products-ui__product-source">${productData.source}</p>
      </div>
    `;

    productCardContainer.appendChild(linkWrapper);

    return productCardContainer;
  }

  createRatingUI(rating) {
    const ratingContainer = document.createElement("div");
    ratingContainer.classList.add("products-ui__product-rating");

    const wholeFill = Math.floor(rating);
    const decimalFill = rating % 1;

    if (rating === undefined) return ratingContainer;

    ratingContainer.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="10.49" height="10" viewBox="0 0 61 12" fill="none">
        <defs>
          <clipPath id="stars-clip">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.22652 11L6.46991 9.28955L9.70946 11L9.08929 7.38222L11.7125 4.81848L8.0878 4.29339L6.47 1L4.84835 4.29339L1.22363 4.81848L3.84687 7.38222L3.22652 11Z" />
          </clipPath>
        </defs>
      </svg>
   `;

    for (let i = 0; i < 5; i++) {
      const starContainer = document.createElement("div");
      starContainer.className = `products-ui__rating-star star-${i}`;

      const yellow = document.createElement("div");
      yellow.className = "yellow";

      const grey = document.createElement("div");
      grey.className = "grey";

      // we fill the stars yellow to the whole number of the rating
      if (i < wholeFill) {
        yellow.style.width = "100%";
        // then we fill the decimal part in function of the decimal
      } else if (i === wholeFill) {
        yellow.style.width = `${decimalFill * 100}%`;
      } // and then because the grey part is flex-grow 1, it will fill the rest of the stars

      starContainer.appendChild(yellow);
      starContainer.appendChild(grey);

      ratingContainer.appendChild(starContainer);
      this.stars.push(starContainer);
    }

    return ratingContainer;
  }

  getElement() {
    return this.mainContainer;
  }
}
