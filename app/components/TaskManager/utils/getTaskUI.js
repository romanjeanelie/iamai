import { MoviesUI, FlightUI, ProductUI, HotelsUI } from "../../UI";

function getTaxiUI(TaxiSearchResults) {
  const taxidiv = document.createElement("div");
  taxidiv.className = "rides-list-wrapper";

  let data = TaxiSearchResults;
  for (let taxii = 0; taxii < data.services.length; taxii++) {
    let service = data.services[taxii];
    if (service) {
      const rideslistitemdiv = document.createElement("div");
      rideslistitemdiv.className = "rides-list-item";
      taxidiv.appendChild(rideslistitemdiv);
      const rideslistitemheaderdiv = document.createElement("div");
      rideslistitemheaderdiv.className = "rides-list-item-header";
      rideslistitemdiv.appendChild(rideslistitemheaderdiv);
      const rideslistitemheaderlogo = document.createElement("figure");
      rideslistitemheaderlogo.className = "rides-list-item-header-logo";
      rideslistitemheaderdiv.appendChild(rideslistitemheaderlogo);
      const rideslistitemheaderlogoimg = document.createElement("img");
      rideslistitemheaderlogoimg.setAttribute("src", "./images/logo/" + service.provider + "-logo.svg");
      rideslistitemheaderlogoimg.setAttribute("alt", service.provider);
      rideslistitemheaderlogo.appendChild(rideslistitemheaderlogoimg);
      const rideslistitemheaderinfodiv = document.createElement("div");
      rideslistitemheaderinfodiv.className = "rides-list-item-header-info";
      const rideslistitemheaderinfodivp = document.createElement("p");
      if (service.name.includes("TAXI_HAILING")) rideslistitemheaderinfodivp.innerHTML = "Taxi Hailing";
      else rideslistitemheaderinfodivp.innerHTML = service.name;

      rideslistitemheaderinfodiv.appendChild(rideslistitemheaderinfodivp);
      const rideslistitemheaderinfodescriptionp = document.createElement("p");
      rideslistitemheaderinfodescriptionp.innerHTML = service.description;
      rideslistitemheaderinfodiv.appendChild(rideslistitemheaderinfodescriptionp);
      const rideslistitemheaderinfoseatsp = document.createElement("p");
      rideslistitemheaderinfoseatsp.innerHTML = service.seats;
      rideslistitemheaderinfodiv.appendChild(rideslistitemheaderinfoseatsp);
      if (service.deeplink) {
        const rideslistitemheaderinfollink = document.createElement("a");
        rideslistitemheaderinfollink.setAttribute("href", service.deeplink);
        rideslistitemheaderinfollink.setAttribute("target", "_blank");
        rideslistitemheaderinfollink.innerHTML = "Link";
        rideslistitemheaderinfodiv.appendChild(rideslistitemheaderinfollink);
      }
      rideslistitemheaderdiv.appendChild(rideslistitemheaderinfodiv);
      // rideslistitemdiv.appendChild(rideslistitemheaderdiv)
      const rideslistitemcontentdiv = document.createElement("div");
      rideslistitemcontentdiv.className = "rides-list-item-content";

      const rideslistitemcontentpricesdiv = document.createElement("div");
      rideslistitemcontentpricesdiv.className = "rides-list-item-content-prices";
      if (service.price) {
        if (service.price.length > 1) {
          const ridespricespan1 = document.createElement("span");
          ridespricespan1.innerText = "$";
          rideslistitemcontentpricesdiv.appendChild(ridespricespan1);
          const ridespricespan2 = document.createElement("span");
          ridespricespan2.innerText = service.price[0] + "-" + service.price[1];
          rideslistitemcontentpricesdiv.appendChild(ridespricespan2);

          if (taxii == 0) {
            const ridespricecheapestspan = document.createElement("span");
            ridespricecheapestspan.className = "rides-list-item-content-sticker";
            ridespricecheapestspan.innerText = "cheapest";
            rideslistitemcontentdiv.appendChild(ridespricecheapestspan);
          }
        } else {
          const ridespricespan1 = document.createElement("span");
          ridespricespan1.innerText = "$";
          rideslistitemcontentpricesdiv.appendChild(ridespricespan1);
          const ridespricespan2 = document.createElement("span");
          ridespricespan2.innerText = service.price;
          rideslistitemcontentpricesdiv.appendChild(ridespricespan2);

          if (taxii == 0) {
            const ridespricecheapestspan = document.createElement("span");
            ridespricecheapestspan.className = "rides-list-item-content-sticker";
            ridespricecheapestspan.innerText = "cheapest";
            rideslistitemcontentdiv.appendChild(ridespricecheapestspan);
          }
        }
      } else {
        const ridespricespan1 = document.createElement("span");
        const ridespricespan2 = document.createElement("span");
        rideslistitemcontentpricesdiv.appendChild(ridespricespan1);
        rideslistitemcontentpricesdiv.appendChild(ridespricespan2);
      }
      rideslistitemcontentdiv.appendChild(rideslistitemcontentpricesdiv);
      rideslistitemdiv.appendChild(rideslistitemcontentdiv);
      // rideslistitemheaderdiv.appendChild(rideslistitemheaderinfodiv);
      taxidiv.appendChild(rideslistitemdiv);

      // this.updateTextContainer();
      // this.textContainer.appendChild(taxidiv);
    }
  }
  return taxidiv;
}

function getGucciUI() {
  const productdiv = document.createElement("div");
  const productcardcontainerdiv = document.createElement("div");
  productcardcontainerdiv.className = "productcard-container";
  productdiv.appendChild(productcardcontainerdiv);

  this.RAG_CHAT.forEach((element) => {
    const productcarddiv = document.createElement("div");
    productcarddiv.className = "product-card";
    productcarddiv.setAttribute("data-info", "product-details");
    productcarddiv.setAttribute("data-details", JSON.stringify(element).replace(/'/g, "&#39;"));
    productcarddiv.addEventListener("click", (event) => showProductDetail(event));
    productcardcontainerdiv.appendChild(productcarddiv);

    const productimage = document.createElement("img");
    productimage.className = "product-image";
    productimage.setAttribute("src", element.image_url);
    productimage.setAttribute("alt", element.name);
    productcarddiv.appendChild(productimage);

    const productname = document.createElement("h3");
    productname.className = "product-name";
    productname.innerHTML = element.name;
    productcarddiv.appendChild(productname);

    const productprice = document.createElement("p");
    productprice.className = "product-price";
    productprice.innerHTML = element.price;
    productcarddiv.appendChild(productprice);

    const productoverlay = document.createElement("div");
    productoverlay.className = "product-overlay";
    productcarddiv.appendChild(productoverlay);
  });
  const productdetails = document.createElement("div");
  productdetails.id = "product-details";
  productdiv.appendChild(productdetails);

  this.updateTextContainer();
  this.textContainer.appendChild(productdiv);
}

function showProductDetail(event) {
  let element = event.target;
  var divdata = JSON.parse(element.parentElement.getAttribute("data-details"));
  var divele = element.parentElement.parentElement.parentElement.querySelector("#product-details");

  const productdetailscard = document.createElement("div");
  productdetailscard.className = "product-details-card";
  const productdetailsimage = document.createElement("div");
  productdetailsimage.className = "product-details-image";
  productdetailscard.appendChild(productdetailsimage);

  const carouseldiv = document.createElement("div");
  carouseldiv.className = "carousel";
  productdetailsimage.appendChild(carouseldiv);

  divdata.image_urls.forEach((image_url) => {
    const carouselitemdiv = document.createElement("div");
    carouselitemdiv.className = "carouselitem";
    const carouselitemimg = document.createElement("img");
    carouselitemimg.setAttribute("src", image_url);
    carouselitemimg.setAttribute("alt", divdata.name);
    carouselitemdiv.appendChild(carouselitemimg);
    carouseldiv.appendChild(carouselitemdiv);
  });

  const productdetailsdiv = document.createElement("div");
  productdetailsdiv.className = "product-details";
  productdetailscard.appendChild(productdetailsdiv);

  const productdetailstitlediv = document.createElement("h1");
  productdetailstitlediv.className = "product-details-title";
  productdetailstitlediv.innerHTML = divdata.name;
  productdetailsdiv.appendChild(productdetailstitlediv);

  const productdetailspricediv = document.createElement("div");
  productdetailspricediv.className = "product-details-price";
  productdetailspricediv.innerHTML = divdata.price;
  productdetailsdiv.appendChild(productdetailspricediv);

  const productdetailsbuybtn = document.createElement("button");
  productdetailsbuybtn.className = "product-details-add-btn";
  productdetailsdiv.appendChild(productdetailsbuybtn);

  const productdetailsbuybtnA = document.createElement("a");
  productdetailsbuybtnA.setAttribute("href", divdata.link_url);
  productdetailsbuybtnA.setAttribute("target", "_blank");
  productdetailsbuybtn.appendChild(productdetailsbuybtnA);

  const productdetailsbuybtnimg = document.createElement("img");
  productdetailsbuybtnimg.setAttribute("src", "./images/buy.svg");
  productdetailsbuybtnA.appendChild(productdetailsbuybtnimg);

  const productdetailsdescription = document.createElement("p");
  productdetailsdescription.className = "product-details-description";
  productdetailsdescription.innerHTML = divdata.desc.replaceAll("\n", "<br>");
  productdetailsdiv.appendChild(productdetailsdescription);
  divele.innerHTML = "";
  divele.appendChild(productdetailscard);
  // scrollToDiv(element.getAttribute('data-info'));
}

function codefilter(event, Filter) {
  let targetElement = event.target;

  while (targetElement && targetElement.tagName !== "DIV") {
    targetElement = targetElement.parentElement;
  }

  if (targetElement) {
    let allitems = targetElement.parentElement.querySelectorAll(".codecard-filtercode");
    allitems.forEach((tab) => tab.classList.remove("active"));
    targetElement.classList.add("active");

    let codeactive = targetElement.parentElement.parentElement.querySelector(".codecard-data.active");
    let codenotactive = targetElement.parentElement.parentElement.querySelector(`.codecard-data.${Filter}`);
    if (codeactive) codeactive.classList.remove("active");
    if (codenotactive) codenotactive.classList.add("active");
  }
}

function getCodeUI(Code, Language) {
  const codediv = document.createElement("div");
  codediv.className = "code-container";
  const codedivfilter = document.createElement("div");
  codedivfilter.className = "code-filter";
  codediv.appendChild(codedivfilter);

  const codedatadiv = document.createElement("div");
  codedatadiv.className = "codecard-data code active";
  codedatadiv.innerHTML = md.parse(Code);

  codediv.appendChild(codedatadiv);
  if (Language.toLowerCase() == "html") {
    const codedivfiltercode = document.createElement("div");
    codedivfiltercode.className = "codecard-filtercode code active";
    codedivfiltercode.innerHTML = "Code";
    codedivfiltercode.addEventListener("click", (event) => codefilter(event, "code"));
    codedivfilter.appendChild(codedivfiltercode);
    const codedivfilterpreview = document.createElement("div");
    codedivfilterpreview.className = "codecard-filtercode preview";
    codedivfilterpreview.innerHTML = "Preview";
    codedivfilterpreview.addEventListener("click", (event) => codefilter(event, "preview"));
    codedivfilter.appendChild(codedivfilterpreview);

    const codedivpreview = document.createElement("div");
    codedivpreview.className = "codecard-data preview";
    const iframe = document.createElement("iframe");
    iframe.className = "codecard-data previewframe";
    iframe.srcdoc = Code.replace("```html", "").replace("```", "");
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
    codedivpreview.appendChild(iframe);

    codediv.appendChild(codedivpreview);
  }
  return codediv;
}

export function getTaskUI(data, emitter) {
  let container;
  let domain = data.domain;
  if (domain == "MovieSearch") {
    container = new MoviesUI(JSON.parse(data.MovieSearchResults), emitter);
  } else if (domain == "TaxiSearch") {
    container = getTaxiUI(JSON.parse(data.TaxiSearchResults));
  } else if (domain == "FlightSearch") {
    container = new FlightUI(JSON.parse(data.FlightSearch), JSON.parse(data.FlightSearchResults)).getElement();
  } else if (domain == "ProductSearch") {
    container = new ProductUI(JSON.parse(data.ProductSearchResults)).getElement();
  } else if (domain == "HotelSearch") {
    container = new HotelsUI(JSON.parse(data.HotelSearch), JSON.parse(data.HotelSearchResults), emitter);
  } else if (domain == "Code") {
    container = getCodeUI(data.Code, data.Language);
  }
  return container;
}
