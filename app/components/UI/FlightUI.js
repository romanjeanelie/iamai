import { formatDateString } from "../../utils/dateUtils";

export class FlightUI {
  constructor(FlightSearch, FlightSearchResults) {
    this.FlightSearch = FlightSearch;
    this.FlightSearchResults = FlightSearchResults;

    this.initUI();
  }

  initUI() {
    this.FlightContainer = document.createElement("div");
    this.FlightContainer.className = "FlightContainer Flight-Container";
    this.FlightContainer.setAttribute("name", "flightResult");

    if (this.FlightSearch.departure_end_date.length > 0 && this.FlightSearch.return_end_date.length > 0) {
      const flighttogglebuttoncontainerdiv = document.createElement("div");
      flighttogglebuttoncontainerdiv.className = "flight-toggle-button-container";
      this.FlightContainer.appendChild(flighttogglebuttoncontainerdiv);

      const flighttogglebutton = document.createElement("button");
      flighttogglebutton.className = "flight-toggle-button active";
      flighttogglebutton.addEventListener("click", (event) => this.toggleflights(event));
      flighttogglebutton.innerHTML = "Outbound";
      flighttogglebutton.id = "Outbound";
      flighttogglebuttoncontainerdiv.appendChild(flighttogglebutton);

      const flighttogglebutton2 = document.createElement("button");
      flighttogglebutton2.className = "flight-toggle-button";
      flighttogglebutton2.addEventListener("click", (event) => this.toggleflights(event));
      flighttogglebutton2.id = "Return";
      flighttogglebutton2.innerHTML = "Return";
      flighttogglebuttoncontainerdiv.appendChild(flighttogglebutton2);
    }
    let FlightSearchResultsArr = this.FlightSearchResults.Outbound;
    for (let flightsi = 0; flightsi < 2; flightsi++) {
      if (flightsi == 1) FlightSearchResultsArr = this.FlightSearchResults.Return;
      if (FlightSearchResultsArr.length > 0) {
        const flightResultdiv = document.createElement("div");
        flightResultdiv.className = "flightResult";
        if (flightsi == 0) {
          flightResultdiv.className = "flightResult";
          flightResultdiv.setAttribute("id", "flightResultOutbound");
          this.FlightContainer.appendChild(flightResultdiv);
        }
        if (flightsi == 1) {
          flightResultdiv.setAttribute("id", "flightResultReturn");
          flightResultdiv.setAttribute("style", "display:None");
          this.FlightContainer.appendChild(flightResultdiv);
        }
        let flightcheapest = 0;
        FlightSearchResultsArr.forEach((FlightSearchResult) => {
          const flightCarddiv = document.createElement("div");
          flightCarddiv.className = "flightCard";
          flightCarddiv.setAttribute("onclick", "window.open('" + FlightSearchResult.link_url + "', '_blank');");
          flightResultdiv.appendChild(flightCarddiv);

          const date = formatDateString(FlightSearchResult.travel_date);
          const stops = FlightSearchResult.travel.stops === 0 ? "Direct" : FlightSearchResult.travel.stops + " stop";

          flightCarddiv.innerHTML = `
            <section class="flightCard__main">
              <div class="flightCard__main-header">
                <p class="flightCard__departure-date">
                  ${date}
                </p>

                <p class="flightCard__duration">
                  ${FlightSearchResult.travel.duration}, ${stops}
                </p>

                <p class="flightCard__arrival-date">
                  ${date}
                </p>
              </div>

              <div class="flightCard__main-body">
                <p class="flightCard__departure-time">
                  ${FlightSearchResult.travel.start_time}
                </p>
                <div class="flightCard__progress-line">
                  <div class="flightCard__progress-dot"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="116" height="8" viewBox="0 0 116 8" fill="none">
                    <path d="M1 3.5C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5L1 3.5ZM115.354 4.35354C115.549 4.15828 115.549 3.8417 115.354 3.64644L112.172 0.464456C111.976 0.269194 111.66 0.269194 111.464 0.464456C111.269 0.659719 111.269 0.976301 111.464 1.17156L114.293 3.99999L111.464 6.82842C111.269 7.02368 111.269 7.34026 111.464 7.53552C111.66 7.73079 111.976 7.73079 112.172 7.53552L115.354 4.35354ZM1 4.5L115 4.49999L115 3.49999L1 3.5L1 4.5Z" 
                    />
                  </svg>
                  <div class="flightCard__progress-dot"></div>
                  <img class="flightCard__airline-logo" src="${FlightSearchResult.travel.airlines_logo}" alt="${FlightSearchResult.travel.airlines}">
                </div>

                <p class="flightCard__arrival-time">
                  ${FlightSearchResult.travel.end_time}
                </p>
              </div>

              <div class="flightCard__main-footer">
                <p class="flightCard__departure-airport-code">
                  ${FlightSearchResult.airport1_code}
                </p>
                <p> ${FlightSearchResult.travel.airlines} </p>
                <p class="flightCard__arrival-airport-code">
                  ${FlightSearchResult.airport2_code}
                </p>
              </div>
            </section>
            <section class="flightCard__footer">
              <p class="flightCard__source">
                  ${FlightSearchResult.website}              
              </p>

              <div class="flightCard__price">
                <p>
                  Price
                </p>
                <p class="flightCard__price-value">
                  ${FlightSearchResult.price}
                </p>
              </div>
            </section>
          `;
        });
      }
    }
  }

  getElement() {
    return this.FlightContainer;
  }
}
