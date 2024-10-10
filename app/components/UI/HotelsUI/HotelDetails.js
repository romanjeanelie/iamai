export class HotelDetails {
  constructor(hotel, resultDetailsContainer) {
    this.hotel = hotel;
    this.hotelDetailContainer = resultDetailsContainer;
    console.log(this.hotel);

    // Init Methods
    this.createHotelDetailUI();
  }

  createHotelDetailUI() {
    this.hotelDetailContainer.className = "hotel-details__container";
    this.hotelDetailContainer.innerHTML = `
      <div class="hotel-details__header-image">
        <img src="${this.hotel.pictures[0]}" alt="${this.hotel.desc}" />
      </div>
      <div class="hotel-details__body">
        <div class="hotel-details__description hotel-details__section">
          <h2 class="hotel-details__title">${this.hotel.desc}</h2>

          <p class="hotel-details__rating">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
             <path d="M7.50241 11.7072C7.37801 11.6547 7.23764 11.6547 7.11323 11.7072L3.49059 13.2377C3.13984 13.3859 2.75878 13.1033 2.79877 12.7246L3.19197 9.00136C3.20718 8.85738 3.15922 8.71387 3.06051 8.60796L0.473638 5.83224C0.207892 5.5471 0.356132 5.08103 0.737775 5.00179L4.56605 4.20699C4.7018 4.17881 4.81975 4.09552 4.89174 3.97703L6.8805 0.703405C7.07522 0.382876 7.54042 0.382875 7.73515 0.703404L9.72391 3.97703C9.79589 4.09552 9.91384 4.17881 10.0496 4.20699L13.8779 5.00179C14.2595 5.08103 14.4078 5.5471 14.142 5.83224L11.5551 8.60796C11.4564 8.71387 11.4085 8.85738 11.4237 9.00136L11.8169 12.7246C11.8569 13.1033 11.4758 13.3859 11.125 13.2377L7.50241 11.7072Z" fill="#B5C0D1"/>
            </svg>
            <span>
              ${this.hotel.rating}
            </span>
          </p>
          <p class="hotel-details__about">${this.hotel.hotel_desc}</p>
        </div>
      </div>
    
    `;
  }

  getElement() {
    return this.hotelDetailContainer;
  }
}
