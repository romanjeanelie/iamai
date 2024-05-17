export default class WaitListForm {
  constructor() {
    this.form = document.querySelector(".divwaitlistform");
    this.handleActive();
  }

  handleActive() {
    const inputs = this.form.querySelectorAll(".input-container");
    inputs.forEach((container) => {
      const input = container.querySelector("input") || container.querySelector("textarea");
      // const optionnalLabel = container.querySelector("p");
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
