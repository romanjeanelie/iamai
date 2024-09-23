export class TaskCardInput {
  constructor() {
    // DOM Elements
    // Init Methods
  }

  initInputUI() {}
}

export function initInputUI() {
  const inputContainer = document.createElement("div");
  inputContainer.className = "input__container task-manager__input-container";

  inputContainer.innerHTML = `
    <!-- Input front -->
    <div class="input__front">
      <form>
        <textarea
          class="input-text"
          rows="1"
          placeholder="How can I help you?"
  
        ></textarea>
      </form>
    </div>

    <button class="phone-btn" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4.69031 2.22833C4.45164 2.16014 4.3323 2.12604 4.23202 2.06546C4.11023 1.99186 4.00814 1.88977 3.93454 1.76798C3.87396 1.6677 3.83986 1.54836 3.77167 1.30969C3.56107 0.572618 3.45578 0.204084 3.30466 0.0969979C3.12214 -0.0323327 2.87786 -0.0323326 2.69534 0.096998C2.54422 0.204084 2.43893 0.572618 2.22833 1.30969C2.16014 1.54837 2.12604 1.6677 2.06546 1.76798C1.99186 1.88977 1.88977 1.99186 1.76798 2.06546C1.6677 2.12604 1.54836 2.16014 1.30969 2.22833C0.572618 2.43893 0.204084 2.54422 0.096998 2.69534C-0.0323326 2.87786 -0.0323327 3.12214 0.0969979 3.30466C0.204084 3.45578 0.572618 3.56107 1.30969 3.77167C1.54837 3.83986 1.6677 3.87396 1.76798 3.93454C1.88977 4.00814 1.99186 4.11023 2.06546 4.23202C2.12604 4.3323 2.16014 4.45164 2.22833 4.69031C2.43893 5.42738 2.54422 5.79592 2.69534 5.903C2.87786 6.03233 3.12214 6.03233 3.30466 5.903C3.45578 5.79592 3.56107 5.42738 3.77167 4.69031C3.83986 4.45163 3.87396 4.33229 3.93454 4.23202C4.00814 4.11023 4.11023 4.00814 4.23202 3.93454C4.33229 3.87396 4.45163 3.83986 4.69031 3.77167C5.42738 3.56107 5.79592 3.45578 5.903 3.30466C6.03233 3.12214 6.03233 2.87786 5.903 2.69534C5.79592 2.54422 5.42738 2.43893 4.69031 2.22833Z"
          fill="white"
        />
      </svg>
      <img alt="phone-icon" src="/icons/phone-icon.svg" />
    </button>
  `;

  const textarea = inputContainer.querySelector(".input-text");

  textarea.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  return inputContainer;
}
