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

function showMovieDetail(element) {
  let moviedetail = element.parentElement.parentElement.querySelector("#movie-details");
  let moviedetaildata = JSON.parse(element.getAttribute("data-details").replace("&#39;", /'/g));
  let divinnerhtml = "";
  moviedetaildata.Theatre.forEach((theatre) => {
    divinnerhtml += '<div class="movie-details-card">';
    divinnerhtml += '<div class="movie-details-theater-header">' + theatre.Name + '</div>';
    divinnerhtml += '<div class="movie-details-dates" data-details=\''+JSON.stringify(theatre).replace(/'/g, "&#39;")+'\'>';
    divinnerhtml += getMoviesDateShowtime(theatre, theatre.DateTime[0].Date);
    divinnerhtml += "</div></div>";
  });
  moviedetail.innerHTML = divinnerhtml;
}

function getMoviesDateShowtime(theatre, date) {
  let divinnerhtml = "";
  divinnerhtml += '<div class="movie-details-date-selector">';
  if(theatre.DateTime[0].Date == date)
    divinnerhtml += '<button class="arrow left-arrow" disabled>&lt;&nbsp;&nbsp;</button>';
  else
    divinnerhtml += '<button class="arrow left-arrow" onclick="getmovieshowtimes(-1,this);return false;">&lt;&nbsp;&nbsp;</button>';
  divinnerhtml += '<span>' + date + '</span>';
  if(theatre.DateTime[theatre.DateTime.length-1].Date == date)
    divinnerhtml += '<button class="arrow right-arrow" disabled>&nbsp;&nbsp;&gt;</button>';
  else
  divinnerhtml += '<button class="arrow right-arrow" onclick="getmovieshowtimes(1,this);return false;">&nbsp;&nbsp;&gt;</button>';
  divinnerhtml += "</div>";
  theatre.DateTime.forEach((moviesdatetime) => {
    if (moviesdatetime.Date == date) {
      divinnerhtml += '<div class="movie-details-showtimes">';
      moviesdatetime.Time.forEach((moviestime) => {
        divinnerhtml += '<button class="movie-details-showtime">'+moviestime.slice(0, -3);+'</button>';
      });
      divinnerhtml += "</div>";
    }
  });
  return divinnerhtml;
}

function getmovieshowtimes(day,element)
{
  let moviedetail = element.parentElement.parentElement.parentElement.querySelector(".movie-details-dates");
  let moviedetaildata = JSON.parse(moviedetail.getAttribute("data-details").replace("&#39;", /'/g));
  let divinnerhtml ="";
  if(day == 1){
    const previousSiblingSpan = element.previousElementSibling.tagName === 'SPAN' ? element.previousElementSibling : null;
    let date = new Date(previousSiblingSpan.innerHTML);
    date.setDate(date.getDate() + 1);
    divinnerhtml = getMoviesDateShowtime(moviedetaildata,date.toISOString().slice(0, 10));
  }else{
    const nextSiblingSpan = element.nextElementSibling.tagName === 'SPAN' ? element.nextElementSibling : null;
    let date = new Date(nextSiblingSpan.innerHTML);
    date.setDate(date.getDate() - 1);
    divinnerhtml = getMoviesDateShowtime(moviedetaildata,date.toISOString().slice(0, 10));
  }
  moviedetail.innerHTML = divinnerhtml;
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