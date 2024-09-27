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
      const productcarddiv = document.createElement("div");
      productcarddiv.className = "shopping-card";
      productcardcontainerdiv.appendChild(productcarddiv);
      const productcarddivA = document.createElement("a");
      productcarddivA.setAttribute("href", element.link);
      productcarddivA.setAttribute("target", "_blank");
      productcarddiv.appendChild(productcarddivA);

      const productimagediv = document.createElement("div");
      productimagediv.className = "shopping-image-dev";
      productcarddivA.appendChild(productimagediv);

      const productimage = document.createElement("img");
      productimage.className = "shopping-image";
      productimage.setAttribute("src", element.imageUrl);
      productimage.setAttribute("alt", element.title);
      productimagediv.appendChild(productimage);

      const productname = document.createElement("h3");
      productname.className = "shopping-name";
      var ptitle = truncate(element.title, 30);
      productname.innerHTML = ptitle;
      productcarddivA.appendChild(productname);

      const productsource = document.createElement("p");
      productsource.className = "shopping-source";
      productsource.innerHTML = element.source;
      productcarddivA.appendChild(productsource);

      const productprice = document.createElement("p");
      productprice.className = "shopping-price";
      if (element.price.includes(".00"))
        productprice.innerHTML = element.price.substring(0, element.price.indexOf(".00"));
      else productprice.innerHTML = element.price;
      productcarddivA.appendChild(productprice);

      const productoverlay = document.createElement("div");
      productoverlay.className = "shopping-overlay";
      productcarddivA.appendChild(productoverlay);
    });
  }

  getElement() {
    return this.mainContainer;
  }
}
