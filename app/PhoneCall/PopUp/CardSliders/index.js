import CardSlider from "../../../components/CardSlider";

const cardsType = {
  classic: "classic",
  language: "language",
  empty: "empty",
};

const overviewCards = [
  {
    title: "Room Service",
    description: "Try ordering food to your room",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565356/Phone-Call/Room_service-cropped_mn6ms7.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565368/Phone-Call/Room_service_ny50ja.png",
  },
  {
    title: "Emergency Services",
    description: "Call in your emergency",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565362/Phone-Call/Emergency_Services-cropped_cy0zjp.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565354/Phone-Call/Emergency_Services_ablvvv.png",
  },
  {
    title: "E-commerce Purchase",
    description: "Try buying items over a call",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565346/Phone-Call/E-commerce_purchasing-cropped_vwj4qb.png",
    imgFull:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565349/Phone-Call/E-commerce_purchasing_juolzj.png",
  },
  {
    title: "Banking",
    description: "Check balances",
    buttonText: "Try Me",
    imgCropped: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565344/Phone-Call/Banking-cropped_g6szhe.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565353/Phone-Call/Banking_kvgbif.png",
  },
  {
    title: "Table Booking",
    description: "Reserve a table for dinner",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565378/Phone-Call/Table_booking-cropped_vq7iqs.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565377/Phone-Call/Table_booking_unvo90.png",
  },
  {
    title: "Room Booking",
    description: "Book a room to stay",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565369/Phone-Call/Room_booking-cropped_lsfcbg.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565372/Phone-Call/Room_booking_kqdrrh.png",
  },
  {
    title: "Spa Booking",
    description: "Make a reservation",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565364/Phone-Call/Spa_booking-cropped_h3xkrq.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565373/Phone-Call/Spa_booking_ft89l9.png",
  },
  {
    title: "Gucci",
    description: "Buy a Gucci",
    buttonText: "Try Me",
    imgCropped: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565336/Phone-Call/Gucci-cropped_goy7tt.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565341/Phone-Call/Gucci_snexdp.png",
  },
];

const languageCards = [
  {
    type: cardsType.language,
    title: "Hello",
  },
];

const slidersData = [
  {
    sliderHeader: "Overview",
    sliderCards: overviewCards,
  },
  {
    sliderHeader: "Hotels",
    sliderCards: new Array(5).fill({
      type: cardsType.empty,
    }),
  },
  {
    sliderHeader: "Customer Service",
    sliderCards: new Array(5).fill({
      type: cardsType.empty,
    }),
  },
  {
    sliderHeader: "Languages",
    sliderCards: languageCards,
  },
];

export default class CardSliders {
  constructor({ emitter }) {
    this.emitter = emitter;

    // State
    this.sliders = [];

    // Dom Elements
    this.container = document.querySelector(".callSliders__container");

    // Init methods
    this.init();
  }

  init() {
    slidersData.forEach((sliderData) => {
      const slider = new CardSlider({
        container: this.container,
        data: slidersData,
        handleClick: () => {
          console.log("button clicked");
        },
      });
      this.sliders.push(slider);
    });
  }
}
