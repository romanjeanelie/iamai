import { formatDateString } from "../../utils/dateUtils";
import UIComponent from "./UIComponent";

export class FlightUI extends UIComponent {
  constructor(FlightSearch, FlightSearchResults) {
    super();
    this.FlightSearch = FlightSearch;
    this.FlightSearchResults = FlightSearchResults;

    this.initUI();
  }

  initUI() {
    this.mainContainer = this.createElement("div", "FlightContainer Flight-Container", { name: "flightResult" });

    if (this.FlightSearch.departure_end_date.length > 0 && this.FlightSearch.return_end_date.length > 0) {
      const flightToggleButtonContainer = this.createElement("div", "flight-toggle-button-container");
      this.appendChild(this.FlightContainer, flightToggleButtonContainer);

      const outboundButton = this.createElement("button", "flight-toggle-button active", { id: "Outbound" });
      outboundButton.innerHTML = "Outbound";
      outboundButton.addEventListener("click", (event) => this.toggleflights(event));
      this.appendChild(flightToggleButtonContainer, outboundButton);

      const returnButton = this.createElement("button", "flight-toggle-button", { id: "Return" });
      returnButton.innerHTML = "Return";
      returnButton.addEventListener("click", (event) => this.toggleflights(event));
      this.appendChild(flightToggleButtonContainer, returnButton);
    }

    this.renderFlightResults(this.FlightSearchResults.Outbound, "flightResultOutbound");
    this.renderFlightResults(this.FlightSearchResults.Return, "flightResultReturn", true);
  }

  renderFlightResults(flightResults, resultId, hide = false) {
    if (flightResults.length > 0) {
      const flightResultDiv = this.createElement("div", "flightResult", { id: resultId });
      if (hide) flightResultDiv.style.display = "none";
      this.appendChild(this.FlightContainer, flightResultDiv);

      flightResults.forEach((flightResult) => {
        const flightCardDiv = this.createElement("div", "flightCard", {
          onclick: `window.open('${flightResult.link_url}', '_blank');`,
        });
        this.appendChild(flightResultDiv, flightCardDiv);

        const date = formatDateString(flightResult.travel_date);
        const stops = flightResult.travel.stops === 0 ? "Direct" : `${flightResult.travel.stops} stop`;

        flightCardDiv.innerHTML = `
          <section class="flightCard__main">
            <div class="flightCard__main-header">
              <p class="flightCard__departure-date">${date}</p>
              <p class="flightCard__duration">${flightResult.travel.duration}, ${stops}</p>
              <p class="flightCard__arrival-date">${date}</p>
            </div>
            <div class="flightCard__main-body">
              <p class="flightCard__departure-time">${flightResult.travel.start_time}</p>
              <div class="flightCard__progress-line">
                <div class="flightCard__progress-dot"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="116" height="8" viewBox="0 0 116 8" fill="none">
                  <path d="M1 3.5C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5L1 3.5ZM115.354 4.35354C115.549 4.15828 115.549 3.8417 115.354 3.64644L112.172 0.464456C111.976 0.269194 111.66 0.269194 111.464 0.464456C111.269 0.659719 111.269 0.976301 111.464 1.17156L114.293 3.99999L111.464 6.82842C111.269 7.02368 111.269 7.34026 111.464 7.53552C111.66 7.73079 111.976 7.73079 112.172 7.53552L115.354 4.35354ZM1 4.5L115 4.49999L115 3.49999L1 3.5L1 4.5Z" />
                </svg>
                <div class="flightCard__progress-dot"></div>
                <img class="flightCard__airline-logo" src="${flightResult.travel.airlines_logo}" alt="${flightResult.travel.airlines}">
              </div>
              <p class="flightCard__arrival-time">${flightResult.travel.end_time}</p>
            </div>
            <div class="flightCard__main-footer">
              <p class="flightCard__departure-airport-code">${flightResult.airport1_code}</p>
              <p>${flightResult.travel.airlines}</p>
              <p class="flightCard__arrival-airport-code">${flightResult.airport2_code}</p>
            </div>
          </section>
          <section class="flightCard__footer">
            <p class="flightCard__source">${flightResult.website}</p>
            <div class="flightCard__price">
              <p>Price</p>
              <p class="flightCard__price-value">${flightResult.price}</p>
            </div>
          </section>
        `;
      });
    }
  }
}
