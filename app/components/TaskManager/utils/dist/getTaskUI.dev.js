"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTaskUI = getTaskUI;

var _UI = require("../../UI");

function getTaxiUI(TaxiSearchResults) {
  var taxidiv = document.createElement("div");
  taxidiv.className = "rides-list-wrapper";
  var data = TaxiSearchResults;

  for (var taxii = 0; taxii < data.services.length; taxii++) {
    var service = data.services[taxii];

    if (service) {
      var rideslistitemdiv = document.createElement("div");
      rideslistitemdiv.className = "rides-list-item";
      taxidiv.appendChild(rideslistitemdiv);
      var rideslistitemheaderdiv = document.createElement("div");
      rideslistitemheaderdiv.className = "rides-list-item-header";
      rideslistitemdiv.appendChild(rideslistitemheaderdiv);
      var rideslistitemheaderlogo = document.createElement("figure");
      rideslistitemheaderlogo.className = "rides-list-item-header-logo";
      rideslistitemheaderdiv.appendChild(rideslistitemheaderlogo);
      var rideslistitemheaderlogoimg = document.createElement("img");
      rideslistitemheaderlogoimg.setAttribute("src", "./images/logo/" + service.provider + "-logo.svg");
      rideslistitemheaderlogoimg.setAttribute("alt", service.provider);
      rideslistitemheaderlogo.appendChild(rideslistitemheaderlogoimg);
      var rideslistitemheaderinfodiv = document.createElement("div");
      rideslistitemheaderinfodiv.className = "rides-list-item-header-info";
      var rideslistitemheaderinfodivp = document.createElement("p");
      if (service.name.includes("TAXI_HAILING")) rideslistitemheaderinfodivp.innerHTML = "Taxi Hailing";else rideslistitemheaderinfodivp.innerHTML = service.name;
      rideslistitemheaderinfodiv.appendChild(rideslistitemheaderinfodivp);
      var rideslistitemheaderinfodescriptionp = document.createElement("p");
      rideslistitemheaderinfodescriptionp.innerHTML = service.description;
      rideslistitemheaderinfodiv.appendChild(rideslistitemheaderinfodescriptionp);
      var rideslistitemheaderinfoseatsp = document.createElement("p");
      rideslistitemheaderinfoseatsp.innerHTML = service.seats;
      rideslistitemheaderinfodiv.appendChild(rideslistitemheaderinfoseatsp);

      if (service.deeplink) {
        var rideslistitemheaderinfollink = document.createElement("a");
        rideslistitemheaderinfollink.setAttribute("href", service.deeplink);
        rideslistitemheaderinfollink.setAttribute("target", "_blank");
        rideslistitemheaderinfollink.innerHTML = "Link";
        rideslistitemheaderinfodiv.appendChild(rideslistitemheaderinfollink);
      }

      rideslistitemheaderdiv.appendChild(rideslistitemheaderinfodiv); // rideslistitemdiv.appendChild(rideslistitemheaderdiv)

      var rideslistitemcontentdiv = document.createElement("div");
      rideslistitemcontentdiv.className = "rides-list-item-content";
      var rideslistitemcontentpricesdiv = document.createElement("div");
      rideslistitemcontentpricesdiv.className = "rides-list-item-content-prices";

      if (service.price) {
        if (service.price.length > 1) {
          var ridespricespan1 = document.createElement("span");
          ridespricespan1.innerText = "$";
          rideslistitemcontentpricesdiv.appendChild(ridespricespan1);
          var ridespricespan2 = document.createElement("span");
          ridespricespan2.innerText = service.price[0] + "-" + service.price[1];
          rideslistitemcontentpricesdiv.appendChild(ridespricespan2);

          if (taxii == 0) {
            var ridespricecheapestspan = document.createElement("span");
            ridespricecheapestspan.className = "rides-list-item-content-sticker";
            ridespricecheapestspan.innerText = "cheapest";
            rideslistitemcontentdiv.appendChild(ridespricecheapestspan);
          }
        } else {
          var _ridespricespan = document.createElement("span");

          _ridespricespan.innerText = "$";
          rideslistitemcontentpricesdiv.appendChild(_ridespricespan);

          var _ridespricespan2 = document.createElement("span");

          _ridespricespan2.innerText = service.price;
          rideslistitemcontentpricesdiv.appendChild(_ridespricespan2);

          if (taxii == 0) {
            var _ridespricecheapestspan = document.createElement("span");

            _ridespricecheapestspan.className = "rides-list-item-content-sticker";
            _ridespricecheapestspan.innerText = "cheapest";
            rideslistitemcontentdiv.appendChild(_ridespricecheapestspan);
          }
        }
      } else {
        var _ridespricespan3 = document.createElement("span");

        var _ridespricespan4 = document.createElement("span");

        rideslistitemcontentpricesdiv.appendChild(_ridespricespan3);
        rideslistitemcontentpricesdiv.appendChild(_ridespricespan4);
      }

      rideslistitemcontentdiv.appendChild(rideslistitemcontentpricesdiv);
      rideslistitemdiv.appendChild(rideslistitemcontentdiv); // rideslistitemheaderdiv.appendChild(rideslistitemheaderinfodiv);

      taxidiv.appendChild(rideslistitemdiv); // this.updateTextContainer();
      // this.textContainer.appendChild(taxidiv);
    }
  }

  return taxidiv;
}

function getGucciUI() {
  var productdiv = document.createElement("div");
  var productcardcontainerdiv = document.createElement("div");
  productcardcontainerdiv.className = "productcard-container";
  productdiv.appendChild(productcardcontainerdiv);
  this.RAG_CHAT.forEach(function (element) {
    var productcarddiv = document.createElement("div");
    productcarddiv.className = "product-card";
    productcarddiv.setAttribute("data-info", "product-details");
    productcarddiv.setAttribute("data-details", JSON.stringify(element).replace(/'/g, "&#39;"));
    productcarddiv.addEventListener("click", function (event) {
      return showProductDetail(event);
    });
    productcardcontainerdiv.appendChild(productcarddiv);
    var productimage = document.createElement("img");
    productimage.className = "product-image";
    productimage.setAttribute("src", element.image_url);
    productimage.setAttribute("alt", element.name);
    productcarddiv.appendChild(productimage);
    var productname = document.createElement("h3");
    productname.className = "product-name";
    productname.innerHTML = element.name;
    productcarddiv.appendChild(productname);
    var productprice = document.createElement("p");
    productprice.className = "product-price";
    productprice.innerHTML = element.price;
    productcarddiv.appendChild(productprice);
    var productoverlay = document.createElement("div");
    productoverlay.className = "product-overlay";
    productcarddiv.appendChild(productoverlay);
  });
  var productdetails = document.createElement("div");
  productdetails.id = "product-details";
  productdiv.appendChild(productdetails);
  this.updateTextContainer();
  this.textContainer.appendChild(productdiv);
}

function showProductDetail(event) {
  var element = event.target;
  var divdata = JSON.parse(element.parentElement.getAttribute("data-details"));
  var divele = element.parentElement.parentElement.parentElement.querySelector("#product-details");
  var productdetailscard = document.createElement("div");
  productdetailscard.className = "product-details-card";
  var productdetailsimage = document.createElement("div");
  productdetailsimage.className = "product-details-image";
  productdetailscard.appendChild(productdetailsimage);
  var carouseldiv = document.createElement("div");
  carouseldiv.className = "carousel";
  productdetailsimage.appendChild(carouseldiv);
  divdata.image_urls.forEach(function (image_url) {
    var carouselitemdiv = document.createElement("div");
    carouselitemdiv.className = "carouselitem";
    var carouselitemimg = document.createElement("img");
    carouselitemimg.setAttribute("src", image_url);
    carouselitemimg.setAttribute("alt", divdata.name);
    carouselitemdiv.appendChild(carouselitemimg);
    carouseldiv.appendChild(carouselitemdiv);
  });
  var productdetailsdiv = document.createElement("div");
  productdetailsdiv.className = "product-details";
  productdetailscard.appendChild(productdetailsdiv);
  var productdetailstitlediv = document.createElement("h1");
  productdetailstitlediv.className = "product-details-title";
  productdetailstitlediv.innerHTML = divdata.name;
  productdetailsdiv.appendChild(productdetailstitlediv);
  var productdetailspricediv = document.createElement("div");
  productdetailspricediv.className = "product-details-price";
  productdetailspricediv.innerHTML = divdata.price;
  productdetailsdiv.appendChild(productdetailspricediv);
  var productdetailsbuybtn = document.createElement("button");
  productdetailsbuybtn.className = "product-details-add-btn";
  productdetailsdiv.appendChild(productdetailsbuybtn);
  var productdetailsbuybtnA = document.createElement("a");
  productdetailsbuybtnA.setAttribute("href", divdata.link_url);
  productdetailsbuybtnA.setAttribute("target", "_blank");
  productdetailsbuybtn.appendChild(productdetailsbuybtnA);
  var productdetailsbuybtnimg = document.createElement("img");
  productdetailsbuybtnimg.setAttribute("src", "./images/buy.svg");
  productdetailsbuybtnA.appendChild(productdetailsbuybtnimg);
  var productdetailsdescription = document.createElement("p");
  productdetailsdescription.className = "product-details-description";
  productdetailsdescription.innerHTML = divdata.desc.replaceAll("\n", "<br>");
  productdetailsdiv.appendChild(productdetailsdescription);
  divele.innerHTML = "";
  divele.appendChild(productdetailscard); // scrollToDiv(element.getAttribute('data-info'));
}

function codefilter(event, Filter) {
  var targetElement = event.target;

  while (targetElement && targetElement.tagName !== "DIV") {
    targetElement = targetElement.parentElement;
  }

  if (targetElement) {
    var allitems = targetElement.parentElement.querySelectorAll(".codecard-filtercode");
    allitems.forEach(function (tab) {
      return tab.classList.remove("active");
    });
    targetElement.classList.add("active");
    var codeactive = targetElement.parentElement.parentElement.querySelector(".codecard-data.active");
    var codenotactive = targetElement.parentElement.parentElement.querySelector(".codecard-data.".concat(Filter));
    if (codeactive) codeactive.classList.remove("active");
    if (codenotactive) codenotactive.classList.add("active");
  }
}

function getCodeUI(Code, Language) {
  var codediv = document.createElement("div");
  codediv.className = "code-container";
  var codedivfilter = document.createElement("div");
  codedivfilter.className = "code-filter";
  codediv.appendChild(codedivfilter);
  var codedatadiv = document.createElement("div");
  codedatadiv.className = "codecard-data code active";
  codedatadiv.innerHTML = md.parse(Code);
  codediv.appendChild(codedatadiv);

  if (Language.toLowerCase() == "html") {
    var codedivfiltercode = document.createElement("div");
    codedivfiltercode.className = "codecard-filtercode code active";
    codedivfiltercode.innerHTML = "Code";
    codedivfiltercode.addEventListener("click", function (event) {
      return codefilter(event, "code");
    });
    codedivfilter.appendChild(codedivfiltercode);
    var codedivfilterpreview = document.createElement("div");
    codedivfilterpreview.className = "codecard-filtercode preview";
    codedivfilterpreview.innerHTML = "Preview";
    codedivfilterpreview.addEventListener("click", function (event) {
      return codefilter(event, "preview");
    });
    codedivfilter.appendChild(codedivfilterpreview);
    var codedivpreview = document.createElement("div");
    codedivpreview.className = "codecard-data preview";
    var iframe = document.createElement("iframe");
    iframe.className = "codecard-data previewframe";
    iframe.srcdoc = Code.replace("```html", "").replace("```", "");
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
    codedivpreview.appendChild(iframe);
    codediv.appendChild(codedivpreview);
  }

  return codediv;
}

function getTaskUI(data, emitter) {
  var container;
  var domain = data.domain;

  if (domain == "MovieSearch") {
    container = new _UI.MoviesUI(JSON.parse(data.MovieSearchResults), emitter);
  } else if (domain == "TaxiSearch") {
    container = getTaxiUI(JSON.parse(data.TaxiSearchResults));
  } else if (domain == "FlightSearch") {
    container = new _UI.FlightUI(JSON.parse(data.FlightSearch), JSON.parse(data.FlightSearchResults)).getElement();
  } else if (domain == "ProductSearch") {
    container = new _UI.ProductUI(JSON.parse(data.ProductSearchResults)).getElement();
  } else if (domain == "HotelSearch") {
    container = new _UI.HotelsUI(JSON.parse(data.HotelSearch), JSON.parse(data.HotelSearchResults));
  } else if (domain == "Code") {
    container = getCodeUI(data.Code, data.Language);
  }

  return container;
}