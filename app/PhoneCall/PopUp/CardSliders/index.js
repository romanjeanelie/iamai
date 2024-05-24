import CardSlider from "../../../components/CardSlider";

export const cardsType = {
  classic: "classic",
  language: "language",
};

const overviewCards = [
  {
    title: "Room Service",
    subTitle: "Try ordering food to your room",
    description:
      "It's time to indulge in some room service. Just let me know what delicious treats you're craving from the menu, and I'll take care of placing the order for you.",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565356/Phone-Call/Room_service-cropped_mn6ms7.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565368/Phone-Call/Room_service_ny50ja.png",
    type: cardsType.classic,
  },
  {
    title: "Emergency Services",
    subTitle: "Call in your emergency",
    description:
      "For emergency services - In a life-threatening emergency, every second matters. Dial me now for immediate police, fire, or ambulance response.",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565362/Phone-Call/Emergency_Services-cropped_cy0zjp.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565354/Phone-Call/Emergency_Services_ablvvv.png",
    type: cardsType.classic,
  },
  {
    title: "E-commerce Purchase",
    subTitle: "Try buying items over a call",
    description:
      "Need something special? Just call me with your shopping list, and I'll take care of finding and purchasing the items you desire. Consider it done!",
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
    description:
      "Curious about your account or credit card balance or recent transactions? Just give me a call, and I'll provide you with the information you need in a snap.",
    buttonText: "Try Me",
    imgCropped: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565344/Phone-Call/Banking-cropped_g6szhe.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565353/Phone-Call/Banking_kvgbif.png",
    type: cardsType.classic,
  },
  {
    title: "Table Booking",
    subTitle: "Reserve a table for dinner",
    description:
      "Craving a night out? Just tell me your favorite restaurant and preferred time, and I'll secure your table reservation hassle-free.",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565378/Phone-Call/Table_booking-cropped_vq7iqs.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565377/Phone-Call/Table_booking_unvo90.png",
    type: cardsType.classic,
  },
  {
    title: "Room Booking",
    subTitle: "Book a room to stay",
    description:
      "Need a hotel room? Just give me a call and tell me your preferences. I'll handle the rest, ensuring you get the perfect room for your stay.",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565369/Phone-Call/Room_booking-cropped_lsfcbg.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565372/Phone-Call/Room_booking_kqdrrh.png",
    type: cardsType.classic,
  },
  {
    title: "Spa Booking",
    subTitle: "Make a reservation",
    description:
      "Need a little pampering? Call me with your preferred spa and treatment, and I'll take care of booking your well-deserved relaxation. ",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565364/Phone-Call/Spa_booking-cropped_h3xkrq.png",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716565373/Phone-Call/Spa_booking_ft89l9.png",
    type: cardsType.classic,
  },
  {
    title: "Gucci",
    subTitle: "Buy a Gucci",
    description:
      "Dreaming of a new Gucci bag? Simply call me with the style you desire, and I'll guide you through the purchase process from start to finish.",
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
      });
      this.sliders.push(slider);
    });
  }
}
