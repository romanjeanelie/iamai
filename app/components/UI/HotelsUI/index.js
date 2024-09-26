export default class HotelsUI {
  constructor(HotelsSearch, HotelsSearchResults) {
    this.hotelsSearch = HotelsSearch;
    this.hotelsSearchResults = HotelsSearchResults;

    // State
    this.filter = "all";

    // DOM Elements
    this.mainContainer = null;
    this.hotelsContainer = null;
    this.initUI();
  }

  initUI() {
    // Initialize the UI
    this.mainContainer = document.createElement("div");

    // Build the HTML content as a string
    let htmlContent = `
      <div class="hotels-ui__filter-container">
        <button class="hotels-ui__filter-item active" data-filter="all">
          All
        </button>
        <button class="hotels-ui__filter-item" data-filter="airbnb">
          Airbnb
        </button>
        <button class="hotels-ui__filter-item" data-filter="accor">
          Hotels
        </button>
      </div>
    `;

    // Append the hotel cards UI
    this.hotelsContainer = this.getHotelsCardsUI(this.filter).outerHTML;
    htmlContent += this.hotelsContainer;

    // Set the innerHTML of hotelsContainer
    this.mainContainer.innerHTML = htmlContent;

    this.filters = this.mainContainer.querySelectorAll(".hotels-ui__filter-item");
    this.filters.forEach((element) => {
      const filter = element.getAttribute("data-filter");
      element.addEventListener("click", (event) => this.filterHotels(event, filter));
    });

    return this.mainContainer;
  }

  filterHotels(event, filter) {
    this.filter = filter;

    this.filters.forEach((f) => {
      f.classList.remove("active");

      if (f.getAttribute("data-filter") === filter) {
        f.classList.add("active");
      }
    });

    // TO DO - Update the hotelsContainer with the new filter
  }

  getHotelsCardsUI(Filter) {
    const hotelcardcontainerdiv = document.createElement("div");
    hotelcardcontainerdiv.className = "hotelscard-container";

    this.hotelsSearchResults.all.forEach((element) => {
      if (element.website == Filter || Filter == "all") {
        const hotelcarddiv = document.createElement("div");
        hotelcarddiv.className = "hotels-card";
        const hotelcardimagediv = document.createElement("div");
        hotelcardimagediv.className = "hotels-image-div";
        const hotelcardimageslidesdiv = document.createElement("div");
        hotelcardimageslidesdiv.className = "hotels-image-slides";
        hotelcardimagediv.appendChild(hotelcardimageslidesdiv);
        const hoteldots = document.createElement("div");
        hoteldots.className = "hotels-dots";

        for (let index = 0; index < element.pictures?.length; index++) {
          const hotelcardimageslidediv = document.createElement("div");
          if (index === 0) hotelcardimageslidediv.className = "hotels-image-slide active";
          else hotelcardimageslidediv.className = "hotels-image-slide";

          hotelcardimageslidesdiv.appendChild(hotelcardimageslidediv);
          const hotelsimg = document.createElement("img");

          hotelsimg.className = "hotels-image";
          hotelsimg.setAttribute("alt", element.title.replace(/'/g, "&#39;"));
          hotelsimg.setAttribute("src", element.pictures[index]);
          hotelcardimageslidediv.appendChild(hotelsimg);

          const dot = document.createElement("span");
          if (index === 0) dot.className = "hotels-dot active";
          else dot.classList.add("hotels-dot");
          hoteldots.appendChild(dot);
          if (index === 3) break;
        }
        if (element.website == "airbnb") {
          const hotelsimgairbnb = document.createElement("img");
          hotelsimgairbnb.className = "hotels-image-airbnb";
          hotelsimgairbnb.setAttribute("src", "./icons/airbnb.svg");
          hotelcardimagediv.appendChild(hotelsimgairbnb);
        }

        const hotelimagesprev = document.createElement("button");
        hotelimagesprev.className = "hotels-prev";
        hotelimagesprev.innerHTML =
          '<svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="20" r="20" fill="#00254E" fill-opacity="0.24"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.0742 12.0002L20.5 20.0002L25.0742 28.0002H27L22.4258 20.0002L27 12.0002H25.0742Z" fill="white"/></svg>';
        hotelimagesprev.addEventListener("click", (event) => this.hotelmoveSlide(event, false));
        hotelcardimagediv.appendChild(hotelimagesprev);

        const hotelimagesnext = document.createElement("button");
        hotelimagesnext.className = "hotels-next";
        hotelimagesnext.innerHTML =
          '<svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="20" r="20" fill="#00254E" fill-opacity="0.24"/><path fill-rule="evenodd" clip-rule="evenodd" d="M23.9264 12L28.5023 20L23.9264 28H22L26.5759 20L22 12H23.9264Z" fill="white"/></svg>';

        hotelimagesnext.addEventListener("click", (event) => this.hotelmoveSlide(event, true));
        hotelcardimagediv.appendChild(hotelimagesnext);

        hotelcardimagediv.appendChild(hoteldots);
        hotelcarddiv.appendChild(hotelcardimagediv);

        const hoteltitlep = document.createElement("div");
        hoteltitlep.className = "hotels-title";
        hoteltitlep.innerHTML = element.title;
        hotelcarddiv.appendChild(hoteltitlep);

        const hotelratingp = document.createElement("div");
        hotelratingp.className = "hotels-rating";
        hotelratingp.innerHTML =
          '<svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.9846 10.7967C10.967 10.7449 10.9347 10.6989 10.8912 10.6636C10.8478 10.6284 10.7949 10.6053 10.7385 10.5971L7.31189 10.1205L5.77952 7.16317C5.75406 7.11417 5.71476 7.07294 5.66605 7.04411C5.61733 7.01528 5.56114 7 5.50382 7C5.44649 7 5.3903 7.01528 5.34158 7.04411C5.29287 7.07294 5.25357 7.11417 5.22811 7.16317L3.69575 10.1205L0.270384 10.5901C0.21192 10.5969 0.156735 10.6196 0.111382 10.6554C0.0660294 10.6912 0.0324144 10.7388 0.0145294 10.7923C-0.00335554 10.8458 -0.00475898 10.9031 0.0104858 10.9574C0.0257305 11.0116 0.0569829 11.0606 0.100531 11.0984L2.5794 13.4077L1.99476 16.6561C1.98488 16.7102 1.99109 16.7658 2.01269 16.8167C2.03428 16.8675 2.07039 16.9116 2.11691 16.9439C2.16344 16.9761 2.21852 16.9953 2.2759 16.9992C2.33328 17.0032 2.39067 16.9917 2.44154 16.9661L5.50382 15.4293L8.56732 16.9649C8.61819 16.9905 8.67558 17.002 8.73296 16.9981C8.79034 16.9942 8.84543 16.975 8.89195 16.9427C8.93848 16.9104 8.97459 16.8663 8.99618 16.8155C9.01777 16.7646 9.02398 16.709 9.0141 16.6549L8.42824 13.4077L10.9071 11.0984C10.9483 11.0601 10.9774 11.0115 10.9912 10.9581C11.0049 10.9048 11.0026 10.8489 10.9846 10.7967Z" fill="#FFB421"/></svg>';
        hotelratingp.innerHTML += element.rating;
        hotelcarddiv.appendChild(hotelratingp);

        const hotelpricep = document.createElement("div");
        hotelpricep.className = "hotels-price";
        hotelpricep.innerHTML = element.price;
        const hotelview = document.createElement("button");
        hotelview.className = "hotels-view";
        hotelview.innerHTML =
          '<svg width="95" height="40" viewBox="0 0 95 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="95" height="40" rx="12" fill="#00254E" fill-opacity="0.6"/><path d="M32.0879 24L29.1582 15.5449H30.8047L32.9492 22.3887H32.9785L35.1289 15.5449H36.7754L33.8398 24H32.0879ZM40.0777 24V15.5449H41.5895V24H40.0777ZM45.4777 24V15.5449H50.9504V16.8164H46.9895V19.0957H50.7336V20.3203H46.9895V22.7285H50.9504V24H45.4777ZM56.4383 24L54.1707 15.5449H55.741L57.2117 21.9258H57.241L58.9344 15.5449H60.3055L61.9988 21.9258H62.0281L63.4988 15.5449H65.0691L62.8016 24H61.3426L59.6375 17.9355H59.6023L57.8973 24H56.4383Z" fill="white"/></svg>';
        hotelview.setAttribute("onclick", "window.open('" + element.booking_url + "', '_blank');");
        hotelpricep.appendChild(hotelview);
        hotelcarddiv.appendChild(hotelpricep);
        hotelcardcontainerdiv.appendChild(hotelcarddiv);
      }
    });

    return hotelcardcontainerdiv;
  }

  getElement() {
    return this.mainContainer;
  }
}
