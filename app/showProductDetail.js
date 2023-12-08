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

function toggleflights(element) {
  // element.parent.querySelectorAll('.toggle-button').forEach(btn => btn.classList.remove('active'));
  // this.classList.add('active');
  if (element.id == "Outbound") {
    element.classList.add('active');
    element.parentElement.querySelector('#Return').classList.remove('active');
    // .getElementById("Return").remove('active');
    element.parentElement.parentElement.querySelector("#flightResultOutbound").style.display = "flex";
    element.parentElement.parentElement.querySelector("#flightResultReturn").style.display = "none";
  } else {
    element.classList.add('active');
    element.parentElement.querySelector('#Outbound').classList.remove('active');
    // element.parentElement.getElementById("Outbound").remove('active');
    element.parentElement.parentElement.querySelector("#flightResultOutbound").style.display = "none";
    element.parentElement.parentElement.querySelector("#flightResultReturn").style.display = "flex";
  }
}

function formatDateToString(date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  date = new Date(date);
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const monthName = months[date.getMonth()];

  return `${dayName}, ${day} ${monthName}`;
}