export function generateSlider(container) {
  const html = `
    <div class="blogSlider__slides-container no-scrollbar">
    </div>

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
