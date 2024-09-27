import truncate from "../../utils/truncate";

export default class ProductUI {
  constructor(productsData) {
    this.productsData = productsData;

    // DOM Elements
    this.mainContainer = null;

    // Init Methods
    this.initUI();
  }

  initUI() {
    this.mainContainer = document.createElement("div");
    const productcardcontainerdiv = document.createElement("div");
    productcardcontainerdiv.className = "shopping-container";
    this.mainContainer.appendChild(productcardcontainerdiv);

    this.productsData.forEach((element) => {
      const productCard = this.initCardUI(element);
      productcardcontainerdiv.appendChild(productCard);
    });
  }

  initCardUI(productData) {
    const productCardContainer = document.createElement("div");
    productCardContainer.className = "shopping-card";
    const productcarddivA = document.createElement("a");
    productcarddivA.setAttribute("href", productData.link);
    productcarddivA.setAttribute("target", "_blank");
    productCardContainer.appendChild(productcarddivA);

    const productimagediv = document.createElement("div");
    productimagediv.className = "shopping-image-dev";
    productcarddivA.appendChild(productimagediv);

    const productimage = document.createElement("img");
    productimage.className = "shopping-image";
    productimage.setAttribute("src", productData.imageUrl);
    productimage.setAttribute("alt", productData.title);
    productimagediv.appendChild(productimage);

    const productname = document.createElement("h3");
    productname.className = "shopping-name";
    var ptitle = truncate(productData.title, 30);
    productname.innerHTML = ptitle;
    productcarddivA.appendChild(productname);

    const productsource = document.createElement("p");
    productsource.className = "shopping-source";
    productsource.innerHTML = productData.source;
    productcarddivA.appendChild(productsource);

    const productprice = document.createElement("p");
    productprice.className = "shopping-price";
    if (productData.price.includes(".00"))
      productprice.innerHTML = productData.price.substring(0, productData.price.indexOf(".00"));
    else productprice.innerHTML = productData.price;
    productcarddivA.appendChild(productprice);

    const productoverlay = document.createElement("div");
    productoverlay.className = "shopping-overlay";
    productcarddivA.appendChild(productoverlay);

    return productCardContainer;
  }

  getElement() {
    return this.mainContainer;
  }
}
