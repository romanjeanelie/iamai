export function generateSlider(container) {
  const html = `
    <div class="blogSlider__slides-container">
    </div>

    <button class="blogSlider__exitFullscreen hidden">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M26.5 14.7C26.5 15.1418 26.1418 15.5 25.7 15.5L17.3001 15.5H17.3C16.8582 15.5 16.5 15.1418 16.5 14.7L16.5001 14.6874L16.5001 6.3C16.5001 5.85817 16.8583 5.5 17.3001 5.5C17.7419 5.5 18.1001 5.85817 18.1001 6.3L18.1001 12.7622L25.1073 5.75506C25.4197 5.44264 25.9262 5.44264 26.2386 5.75506C26.5511 6.06748 26.5511 6.57401 26.2386 6.88643L19.2251 13.9H25.7C26.1418 13.9 26.5 14.2582 26.5 14.7Z" fill="black"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 17.3C5.5 16.8582 5.85817 16.5 6.3 16.5H14.6999H14.7C15.1418 16.5 15.5 16.8582 15.5 17.3L15.4999 17.3126L15.4999 25.7C15.4999 26.1418 15.1417 26.5 14.6999 26.5C14.2581 26.5 13.8999 26.1418 13.8999 25.7L13.8999 19.2376L6.89254 26.245C6.58012 26.5574 6.07359 26.5574 5.76117 26.245C5.44875 25.9325 5.44875 25.426 5.76117 25.1136L12.7748 18.1L6.3 18.1C5.85817 18.1 5.5 17.7418 5.5 17.3Z" fill="black"/>
      </svg>
    </button>

    <button class="blog__cta blogSlider__mobileCTA"> 
      Watch the Videos
    </button>

    <div class="blogSlider__footer"> 
      <p class="blogSlider__slide-description">
      </p>

      <div class="blogSlider__navigation">
        <button class="blogSlider__button prev">
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 1L1 8.5L8.5 16" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <p class="blogSlider__pagination">
          <span class="blogSlider__pagination-current">1</span> of <span class="blogSlider__pagination-total">6</span>
        </p>

        <button class="blogSlider__button next">
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 1L9 8.5L1.5 16" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <button class="blogSlider__infoBtn">
        <img src="/icons/info-icon.svg" alt="Info">
      </button>
    </div>

    <div class="blogSlider__mobile-description hidden">
      <button class="blogSlider__closeBtn">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="1.13184" width="1.6" height="17.6" rx="0.8" transform="rotate(-45 0 1.13184)" fill="white"/>
          <rect y="12.4453" width="17.6" height="1.6" rx="0.8" transform="rotate(-45 0 12.4453)" fill="white"/>
        </svg>
      </button>
      <p></p>
    </div>
  `;

  container.innerHTML += html;
}

export function generateSliderHeader(data, isOdd, container) {
  if (data.h1 === "The Multitasking Assistant.<br/> Always by Your Side.") isOdd = false;

  const html = `
    <div class="blogSlider__section">
      <div class="blog__container">
        <div class="blogSlider__header">
          <h1 class="${isOdd && "centered"}" >${data.h1}</h1>
          ${data.h4 ? `<h4>${data.h4} <span> ${data.h4Span} </span></h4>` : ""}
          <p class="${isOdd && "centered"}" >${data.p}</p>
        </div>
      </div>

      <div class="blogSlider__container sliderSection">

      </div>
    </div>
  `;

  container.innerHTML += html;
}
