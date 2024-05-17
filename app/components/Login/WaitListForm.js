export default class WaitListForm {
  constructor() {
    // States
    this.isRequiredValid = false;

    // DOM Elements
    this.form = document.querySelector(".divwaitlistform");
    this.inputs = document.querySelectorAll("input, textarea");
    this.button = this.form.querySelector(".btnsave");

    this.handleActive();
    this.handleValidation();
  }

  handleSubmitButton() {
    if (this.isRequiredValid) {
      this.button.classList.remove("inactive");
      this.button.classList.add("active");
    } else {
      this.button.classList.add("inactive");
      this.button.classList.remove("active");
    }
  }

  handleValidation() {
    const requiredInputs = this.form.querySelectorAll("[required]");
    this.form.addEventListener("input", () => {
      for (let input of requiredInputs) {
        const value = input.value.trim();
        // Validate the input based on its type
        if (input.type === "text") {
          if (value.length <= 3) {
            this.isRequiredValid = false;
            break;
          }
        } else if (input.type === "textarea") {
          if (value.length <= 5) {
            this.isRequiredValid = false;
            break;
          }
        }
        this.isRequiredValid = true;
      }

      this.handleSubmitButton();
    });
  }

  handleActive() {
    this.inputs.forEach((input) => {
      const labelId = input.dataset.label;
      const label = document.querySelector(`#${labelId}`);

      if (!label) return; // Skip if label not found
      input.addEventListener("focus", () => {
        label.classList.add("active");
        // optionnalLabel?.classList.add("hidden");
      });

      input.addEventListener("blur", () => {
        label.classList.remove("active");
        // optionnalLabel?.classList.remove("hidden");
      });
    });
  }
}
