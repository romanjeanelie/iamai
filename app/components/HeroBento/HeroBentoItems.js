export default class HeroBentoItems {
  constructor(item) {
    this.item = item;

    // Map item names to their respective methods
    const itemHandlers = {
      "tagline-item": this.getTaglineItem.bind(this),
      "multitasking-item": this.getMultitaskingItem.bind(this),
      "talk-item": this.getTalkItem.bind(this),
      "travel-item": this.getTravelItem.bind(this),
      "entertainment-item": this.getEntertainmentItem.bind(this),
    };

    const handler = itemHandlers[item.name];
    if (handler) {
      return handler();
    } else {
      console.error(`No handler found for item ${item.name}`);
    }
  }

  getTaglineItem() {
    const container = document.createElement("div");
    container.className = `heroBentoGrid__grid-item  square-item tagline-item`;

    container.innerHTML = `
      <h3>Get things <br />done in the real world.</h3>
      <p>
        Ask me to call your friends. I’ll set up meetups etc.
      </p>
    `;

    return container;
  }

  getMultitaskingItem() {
    const container = document.createElement("div");
    container.className = `heroBentoGrid__grid-item wide-item multitasking-item`;

    container.innerHTML = `
      <h3>Your Multitasking<br /> Marvel! 
      <p>
        Watch me juggle multiple tasks simultaneously, no matter how many you throw my way.
      </p>
    `;

    return container;
  }

  getTalkItem() {
    const container = document.createElement("div");
    container.className = `heroBentoGrid__grid-item high-item talk-item`;

    container.innerHTML = `
      <div class="feature-box">
        <h3>Just Talk.</h3>
        <p>
          Ask anything, in any language. No search, just direct conversation.
        </p>
      </div>
      <div class="feature-illustration conversation-widget">
        <p>Hello</p>
        <div class="mic-icon">
          <img src="/icons/mic-icon.svg" alt="mic icon">
        </div>
      </div>
    `;

    return container;
  }

  getTravelItem() {
    const container = document.createElement("div");
    container.className = `heroBentoGrid__grid-item wide-item travel-item`;

    container.innerHTML = `
      <div class="feature-box">
        <h3>Plan Travel. <br />Effortlessly.</h3>
        <p>
          Need London trip help? Ask me to find the cheapest flights, hotels, and best spots to eat and explore
        </p>
      </div>
      <div class="feature-illustration travel-pictures">
        <div class="travel-picture">
          <img src="https://res.cloudinary.com/dfdqiqn98/image/upload/v1724312644/Home/bento-illu-beatch_oufrei.png" alt="beatch">
        </div>
        <div class="travel-picture">
          <img src="https://res.cloudinary.com/dfdqiqn98/image/upload/v1724312644/Home/bento-illu-sea_akahuh.png" alt="sea">
        </div>
        <div class="travel-picture">
          <img src="https://res.cloudinary.com/dfdqiqn98/image/upload/v1724312644/Home/bento-illu-girl_fsdl1s.png" alt="girl in front of the sea">
        </div>
      </div>
    `;

    return container;
  }

  getEntertainmentItem() {
    const container = document.createElement("div");
    container.className = `heroBentoGrid__grid-item square-item entertainment-item`;

    container.innerHTML = `
      <h3>Your<br class="desktop-break" /> Entertainment <br /> Guru</h3>
      <p>
        Want to watch a movie but need to fit your schedule?
      </p>
    `;

    return container;
  }
}
