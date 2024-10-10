"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HotelDetails = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HotelDetails =
/*#__PURE__*/
function () {
  function HotelDetails(hotel, resultDetailsContainer) {
    _classCallCheck(this, HotelDetails);

    this.hotel = hotel;
    this.hotelDetailContainer = resultDetailsContainer; // Init Methods

    this.createHotelDetailUI();
  }

  _createClass(HotelDetails, [{
    key: "createRoomCard",
    value: function createRoomCard(room) {
      var _this = this;

      var roomCard = document.createElement("div");
      roomCard.className = "hotel-details__room-card animate";
      var roomHeader = document.createElement("div");
      roomHeader.className = "hotel-details__room-header";
      var roomName = document.createElement("h5");
      roomName.textContent = room.name;
      var roomChevron = document.createElement("button");
      roomChevron.className = "hotel-details__room-chevron";
      roomChevron.innerHTML = "\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"8\" viewBox=\"0 0 12 8\" fill=\"none\">\n        <path d=\"M2 2L6 6L10 2\" stroke=\"#979BAC\" stroke-width=\"1.5\" stroke-linecap=\"square\"/>\n      </svg>\n    ";
      roomHeader.appendChild(roomName); // append the chevron only if there are more than 4 availability slots

      if (room.availability.length > 4) roomHeader.appendChild(roomChevron);
      var availabilityContainer = document.createElement("div");
      availabilityContainer.className = "hotel-details__availability";
      roomChevron.addEventListener("click", function () {
        return _this.toggleRoomDetails(roomCard);
      });
      room.availability.forEach(function (availability) {
        var availabilityElement = document.createElement("a");
        availabilityElement.className = "hotel-details__availability-item"; // remove the extra :00 at the end of the time

        var formattedTime = availability.Time.slice(0, -3);
        availabilityElement.textContent = formattedTime;
        availabilityElement.setAttribute("href", availability.BookingUrl);
        availabilityContainer.appendChild(availabilityElement);
      });
      roomCard.appendChild(roomHeader);
      roomCard.appendChild(availabilityContainer);
      return roomCard;
    }
  }, {
    key: "createHotelDetailUI",
    value: function createHotelDetailUI() {
      this.hotelDetailContainer.className = "hotel-details__container";
      this.hotelDetailContainer.innerText = "YO IT'S THE HOTEL DETAIL CONTAINER";
    }
  }, {
    key: "getElement",
    value: function getElement() {
      return this.hotelDetailContainer;
    }
  }]);

  return HotelDetails;
}();

exports.HotelDetails = HotelDetails;