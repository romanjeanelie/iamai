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
    opening: "" ,
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716596004/Phone-Call/Room_service-cropped_poz359.webp",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716595997/Phone-Call/Room_service_oirmou.webp",
    type: cardsType.classic,
  },
  {
    title: "Emergency Services",
    subTitle: "Call in your emergency",
    description:
      "For emergency services - In a life-threatening emergency, every second matters. Dial me now for immediate police, fire, or ambulance response.",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716595996/Phone-Call/Emergency_Services-cropped_iyomox.webp",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716595997/Phone-Call/Emergency_Services_y6ibxa.webp",
    type: cardsType.classic,
  },
  {
    title: "E-commerce Purchase",
    subTitle: "Try buying items over a call",
    description:
      "Need something special? Just call me with your shopping list, and I'll take care of finding and purchasing the items you desire. Consider it done!",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716596000/Phone-Call/E-commerce_purchasing-cropped_oagcxo.webp",
    imgFull:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716595994/Phone-Call/E-commerce_purchasing_se3kem.webp",
    type: cardsType.classic,
  },
  {
    title: "Banking",
    subTitle: "Check balances",
    description:
      "Curious about your account or credit card balance or recent transactions? Just give me a call, and I'll provide you with the information you need in a snap.",
    buttonText: "Try Me",
    imgCropped: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716595994/Phone-Call/Banking-cropped_m3bnzk.webp",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716595994/Phone-Call/Banking_bldyqg.webp",
    type: cardsType.classic,
  },
  {
    title: "Table Booking",
    subTitle: "Reserve a table for dinner",
    description:
      "Craving a night out? Just tell me your favorite restaurant and preferred time, and I'll secure your table reservation hassle-free.",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716596006/Phone-Call/Table_booking-cropped_ihn7br.webp",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716596006/Phone-Call/Table_booking_vszrey.webp",
    type: cardsType.classic,
  },
  {
    title: "Room Booking",
    subTitle: "Book a room to stay",
    description:
      "Need a hotel room? Just give me a call and tell me your preferences. I'll handle the rest, ensuring you get the perfect room for your stay.",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716596001/Phone-Call/Room_booking-cropped_hgea4l.webp",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716596004/Phone-Call/Room_booking_lgt6ec.webp",
    type: cardsType.classic,
  },
  {
    title: "Spa Booking",
    subTitle: "Make a reservation",
    description:
      "Need a little pampering? Call me with your preferred spa and treatment, and I'll take care of booking your well-deserved relaxation. ",
    buttonText: "Try Me",
    imgCropped:
      "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716596006/Phone-Call/Spa_booking-cropped_yjj6vo.webp",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716595998/Phone-Call/Spa_booking_jty0dv.webp",
    type: cardsType.classic,
  },
  {
    title: "Gucci",
    subTitle: "Buy a Gucci",
    description:
      "Dreaming of a new Gucci bag? Simply call me with the style you desire, and I'll guide you through the purchase process from start to finish.",
    buttonText: "Try Me",
    imgCropped: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716596001/Phone-Call/Gucci-cropped_f8zhoq.webp",
    imgFull: "https://res.cloudinary.com/dfdqiqn98/image/upload/v1716596003/Phone-Call/Gucci_jowtd8.webp",
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
