export default class WaitListForm {
  constructor() {
    this.form = document.querySelector(".divwaitlistform");
    this.handleActive();
  }

  handleActive() {
    const inputs = this.form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      const labelId = input.dataset.label;
      const label = document.querySelector(`#${labelId}`);

      if (!label) return; // Skip if label not found
      input.addEventListener("focus", () => {
        label.classList.add("active");
      });

      input.addEventListener("blur", () => {
        label.classList.remove("active");
      });
    });
  }
}
