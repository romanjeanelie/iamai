import CardSlider from "../../../components/CardSlider";

export const cardsType = {
  classic: "classic",
  language: "language",
};

const overviewCards = [
  {
    title: "Room Service",
    subTitle: "Try ordering food to your room",
    description: "Order food to your room",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565356/Phone-Call/Room_service-cropped_mn6ms7.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565368/Phone-Call/Room_service_ny50ja.png",
    type: cardsType.classic,
  },
  {
    title: "Emergency Services",
    subTitle: "Call in your emergency",
    description: "Order food to your room",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565362/Phone-Call/Emergency_Services-cropped_cy0zjp.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565354/Phone-Call/Emergency_Services_ablvvv.png",
    type: cardsType.classic,
  },
  {
    title: "E-commerce Purchase",
    subTitle: "Try buying items over a call",
    description: "Order food to your room",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565346/Phone-Call/E-commerce_purchasing-cropped_vwj4qb.png",
    imgFull:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565349/Phone-Call/E-commerce_purchasing_juolzj.png",
    type: cardsType.classic,
  },
  {
    title: "Banking",
    subTitle: "Check balances",
    description: "Order food to your room",
    buttonText: "Try Me",
    imgCropped: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565344/Phone-Call/Banking-cropped_g6szhe.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565353/Phone-Call/Banking_kvgbif.png",
    type: cardsType.classic,
  },
  {
    title: "Table Booking",
    subTitle: "Reserve a table for dinner",
    description: "Order food to your room",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565378/Phone-Call/Table_booking-cropped_vq7iqs.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565377/Phone-Call/Table_booking_unvo90.png",
    type: cardsType.classic,
  },
  {
    title: "Room Booking",
    subTitle: "Book a room to stay",
    description: "Order food to your room",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565369/Phone-Call/Room_booking-cropped_lsfcbg.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565372/Phone-Call/Room_booking_kqdrrh.png",
    type: cardsType.classic,
  },
  {
    title: "Spa Booking",
    subTitle: "Make a reservation",
    description: "Order food to your room",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565364/Phone-Call/Spa_booking-cropped_h3xkrq.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565373/Phone-Call/Spa_booking_ft89l9.png",
    type: cardsType.classic,
  },
  {
    title: "Gucci",
    subTitle: "Buy a Gucci",
    description: "Order food to your room",
    buttonText: "Try Me",
    imgCropped: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565336/Phone-Call/Gucci-cropped_goy7tt.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565341/Phone-Call/Gucci_snexdp.png",
    type: cardsType.classic,
  },
];

const languageCards = [
  {
    title: "Hello",
    type: cardsType.language,
    gradient: `-webkit-linear-gradient(0deg, #ff0f01 0%, #fff501 40%, transparent 60%, transparent 100%)`,
  },
  {
    title: "Bonjour",
    type: cardsType.language,
    gradient: `-webkit-linear-gradient(0deg, #01b2ff 0%, #7d03ff 40%, transparent 60%, transparent 100%)`,
  },
  {
    title: "Ciao",
    type: cardsType.language,
    gradient: `-webkit-linear-gradient(0deg, #01fd0a 0%, #017705 40%, transparent 60%, transparent 100%)`,
  },
  {
    title: "Hola",
    type: cardsType.language,
    gradient: `-webkit-linear-gradient(0deg, #fe9901 0%, #083bf7 40%, transparent 60%, transparent 100%)`,
  },
];

const slidersData = [
  {
    sliderHeader: "Overview",
    sliderCards: overviewCards,
  },
  {
    sliderHeader: "Hotels",
    sliderCards: new Array(5).fill({}),
  },
  {
    sliderHeader: "Customer Service",
    sliderCards: new Array(5).fill({}),
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
        data: sliderData,
        handleClick: () => {
          console.log("button clicked");
        },
      });
      this.sliders.push(slider);
    });
  }
}
