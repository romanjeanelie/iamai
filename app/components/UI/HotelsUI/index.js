export default class HotelsUI {
  constructor(HotelsSearch, HotelsSearchResults) {
    this.hotelsSearch = HotelsSearch;
    this.hotelsSearchResults = HotelsSearchResults;

    // DOM Elements
    this.hotelsContainer = null;
    this.initUI();
  }

  initUI() {
    // Initialize the UI
    this.hotelsContainer = document.createElement("div");
    this.hotelsContainer.setAttribute("data-details", JSON.stringify(this.hotelsSearchResults));

    // Build the HTML content as a string
    let htmlContent = `
      <div class="hotelscard-filter">
        <div class="hotelscard-filter all hotelactive" data-filter="all" onclick="this.getHotelFilters(event, 'all')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_3952_11361)">
              <rect x="1" y="1" width="8" height="8" rx="1" stroke="#00254E" stroke-width="2" stroke-linejoin="round"/>
              <rect x="1" y="15" width="8" height="8" rx="1" stroke="#00254E" stroke-width="2" stroke-linejoin="round"/>
              <rect x="15" y="1" width="8" height="8" rx="1" stroke="#00254E" stroke-width="2" stroke-linejoin="round"/>
              <rect x="15" y="15" width="8" height="8" rx="1" stroke="#00254E" stroke-width="2" stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_3952_11361">
                <rect width="24" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          All
          <div id="border" class="hotelfilteractive"></div>
        </div>
        <div class="hotelscard-filter airbnb" data-filter="airbbnb" onclick="this.getHotelFilters(event, 'airbnb')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_3952_11362)">
              <path d="M15.3409 1.89305C14.6375 0.718783 13.3691 0 12.0002 0C10.6313 0 9.36292 0.71875 8.65949 1.89305L0.820688 14.9577C0.284133 15.851 0.000483877 16.8732 0 17.9152V18.252C0.000126002 19.7028 0.548781 21.0998 1.53605 22.163C2.52322 23.2262 3.87592 23.8767 5.32287 23.9842C6.7696 24.0916 8.20358 23.648 9.33711 22.7424L12.0003 20.6094L14.6636 22.7424C15.797 23.648 17.231 24.0916 18.6778 23.9842C20.1247 23.8767 21.4774 23.2262 22.4646 22.163C23.4519 21.0999 24.0005 19.7028 24.0007 18.252V17.9152C24.0002 16.8732 23.7165 15.851 23.18 14.9577L15.3409 1.89305ZM13.208 16.6687L12.0002 17.6365L10.7925 16.6687C10.3323 16.3013 10.0644 15.7442 10.0647 15.1552V15.0971C10.0647 14.4056 10.4337 13.7667 11.0325 13.4209C11.6313 13.0752 12.3692 13.0752 12.968 13.4209C13.5668 13.7667 13.9357 14.4056 13.9357 15.0971V15.1552C13.9361 15.7442 13.6682 16.3013 13.208 16.6687ZM21.6778 18.252C21.6791 19.1169 21.3528 19.9503 20.7646 20.5843C20.1764 21.2185 19.3698 21.6063 18.5073 21.6699C17.6446 21.7334 16.7899 21.4679 16.1151 20.9268L13.8584 19.123L14.6597 18.4804C15.6728 17.6746 16.2616 16.4497 16.2584 15.1552V15.0971C16.2584 13.5758 15.4468 12.1701 14.1293 11.4093C12.8119 10.6487 11.1887 10.6487 9.87122 11.4093C8.55378 12.17 7.74216 13.5756 7.74216 15.0971V15.1552C7.74228 16.4489 8.33049 17.6723 9.34086 18.4804L10.1422 19.123L7.88532 20.927L7.88545 20.9268C7.21067 21.4679 6.35595 21.7334 5.49329 21.6699C4.63076 21.6063 3.82417 21.2185 3.23594 20.5843C2.64774 19.9503 2.32148 19.117 2.32273 18.252V17.9152C2.32286 17.2948 2.49146 16.686 2.81051 16.154L10.6493 3.09704C10.9316 2.61681 11.4471 2.32197 12.0042 2.32197C12.5613 2.32197 13.0766 2.61683 13.359 3.09704L21.1901 16.154C21.5091 16.686 21.6777 17.2947 21.6779 17.9152L21.6778 18.252Z" fill="#00254E"/>
            </g>
            <defs>
              <clipPath id="clip0_3952_11362">
                <rect width="24" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          Airbnb
          <div id="border"></div>
        </div>
        <div class="hotelscard-filter hotels" data-filter="accor" onclick="this.getHotelFilters(event, 'accor')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_3952_11368)">
              <line x1="0.958357" y1="1.45836" x2="0.958358" y2="22.5422" stroke="#00254E" stroke-width="1.91671" stroke-linecap="round"/>
              <path d="M23 16.6016L23 22.3515" stroke="#00254E" stroke-width="1.91671" stroke-linecap="round"/>
              <line x1="1.14844" y1="16.7916" x2="21.6912" y2="16.7916" stroke="#00254E" stroke-width="1.91671"/>
              <path d="M12.6484 8.55078H19.8042C21.5685 8.55078 22.9987 9.98099 22.9987 11.7452V16.601H12.6484V8.55078Z" stroke="#00254E" stroke-width="1.91671"/>
              <circle cx="6.90321" cy="10.8505" r="2.49173" stroke="#00254E" stroke-width="1.91671"/>
            </g>
            <defs>
              <clipPath id="clip0_3952_11368">
                <rect width="24" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          Hotels
          <div id="border"></div>
        </div>
      </div>
    `;

    // Append the hotel cards UI
    htmlContent += this.getHotelsCardsUI("all").outerHTML;

    // Set the innerHTML of hotelsContainer
    this.hotelsContainer.innerHTML = htmlContent;
    this.filters = this.hotelsContainer.querySelectorAll(".hotelscard-filter");
    this.filters.forEach((element) => {
      const filter = element.getAttribute("data-filter");
      element.addEventListener("click", (event) => this.getHotelFilters(event, filter));
    });

    // Append hotelsContainer to the desired parent element
    document.body.appendChild(this.hotelsContainer);

    return this.hotelsContainer;
  }

  getHotelFilters(event, Filter) {
    let targetElement = event.target;

    while (targetElement.tagName !== "DIV") {
      targetElement = targetElement.parentElement;
    }
    let clicked = targetElement.querySelector("#border");
    let HotelSearchResults = JSON.parse(targetElement.parentElement.parentElement.getAttribute("data-details"));
    let hotelcardcontainerdiv = targetElement.parentElement.parentElement.querySelector(".hotelscard-container");
    let allitems = targetElement.parentElement.querySelector(".hotelfilteractive");
    allitems.parentElement.classList.remove("hotelactive");
    allitems.classList.remove("hotelfilteractive");
    clicked.parentElement.classList.add("hotelactive");
    clicked.classList.add("hotelfilteractive");
    hotelcardcontainerdiv.remove();
    targetElement.parentElement.parentElement.appendChild(this.getHotelsCardsUI(Filter));
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
    return this.hotelsContainer;
  }
}
