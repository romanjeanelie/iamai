function showProductDetail(element) {
  // console.log(JSON.parse(element.getAttribute('data-details')));
  // console.log(element.getAttribute('data-info'));
  // element.parentElement.parentElement.querySelector("#flightResultOutbound").style.display = "flex";
  var divdata = JSON.parse(element.getAttribute("data-details"));
  var divele = element.parentElement.parentElement.querySelector("#product-details");
  var divinnerhtml = "";
  divinnerhtml += '<div class="product-details-card">';
  divinnerhtml += '<div class="product-details-image">';
  divinnerhtml += '<div class="carousel">';
  divdata.image_urls.forEach((image_url) => {
    divinnerhtml += '<div class="carouselitem"><img src="' + image_url + '" alt="' + divdata.name + '"></div>';
  });
  divinnerhtml += "</div></div>";
  divinnerhtml += '<div class="product-details">';
  divinnerhtml += '<h1 class="product-details-title">' + divdata.name + "</h1>";
  divinnerhtml += '<div class="product-details-price">' + divdata.price + "</div>";
  divinnerhtml +=
    '<button class="product-details-add-btn"><a href="' +
    divdata.link_url +
    '" target="_blank"><img src="./images/buy.svg"></a></button>';
  divinnerhtml += '<p class="product-details-description">' + divdata.desc.replaceAll("\n", "<br>") + "</p>";
  divinnerhtml += "</div>";
  divele.innerHTML = divinnerhtml;
  // scrollToDiv(element.getAttribute('data-info'));
}
