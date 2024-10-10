export class HotelDetails {
  constructor(hotel, resultDetailsContainer) {
    this.hotel = hotel;
    this.hotelDetailContainer = resultDetailsContainer;

    // Init Methods
    this.createHotelDetailUI();
  }

  createRoomCard(room) {
    const roomCard = document.createElement("div");
    roomCard.className = "hotel-details__room-card animate";

    const roomHeader = document.createElement("div");
    roomHeader.className = "hotel-details__room-header";

    const roomName = document.createElement("h5");
    roomName.textContent = room.name;

    const roomChevron = document.createElement("button");
    roomChevron.className = "hotel-details__room-chevron";
    roomChevron.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none">
        <path d="M2 2L6 6L10 2" stroke="#979BAC" stroke-width="1.5" stroke-linecap="square"/>
      </svg>
    `;

    roomHeader.appendChild(roomName);
    // append the chevron only if there are more than 4 availability slots
    if (room.availability.length > 4) roomHeader.appendChild(roomChevron);

    const availabilityContainer = document.createElement("div");
    availabilityContainer.className = "hotel-details__availability";

    roomChevron.addEventListener("click", () => this.toggleRoomDetails(roomCard));

    room.availability.forEach((availability) => {
      const availabilityElement = document.createElement("a");
      availabilityElement.className = "hotel-details__availability-item";
      // remove the extra :00 at the end of the time
      const formattedTime = availability.Time.slice(0, -3);

      availabilityElement.textContent = formattedTime;
      availabilityElement.setAttribute("href", availability.BookingUrl);
      availabilityContainer.appendChild(availabilityElement);
    });

    roomCard.appendChild(roomHeader);
    roomCard.appendChild(availabilityContainer);

    return roomCard;
  }

  createHotelDetailUI() {
    this.hotelDetailContainer.className = "hotel-details__container";

    this.hotelDetailContainer.innerText = "YO IT'S THE HOTEL DETAIL CONTAINER";
  }

  getElement() {
    return this.hotelDetailContainer;
  }
}
