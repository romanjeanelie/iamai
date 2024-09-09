import { TASK_STATUSES, STATUS_COLORS } from "./index";

export default class TaskManagerButton {
  constructor() {
    this.button = document.querySelector(".");
  }

  getButtonColor() {
    // order of priority for the color of the button
    const order = [TASK_STATUSES.COMPLETED, TASK_STATUSES.INPUT_REQUIRED, TASK_STATUSES.IN_PROGRESS];
    for (const status of order) {
      // the first status found in the tasks array will be the color of the button
      if (this.tasks.some((task) => task.status.type === status)) {
        if (status === TASK_STATUSES.COMPLETED) {
          this.button.classList.add("completed");
        } else {
          this.button.classList.remove("completed");
        }

        return STATUS_COLORS[status];
      }
    }
  }

  initializeButton() {
    this.button.classList.remove("hidden");
    this.updateButton();
  }

  updateButton() {
    this.button.innerHTML = this.tasks.length;
    this.button.style.background = this.getButtonColor();
  }

  removeButton() {
    this.button.classList.add("hidden");
  }

  handleButton() {
    // only function to be called to deal with button
    if (this.tasks.length === 0) {
      this.removeButton();
    } else if (this.tasks.length === 1) {
      this.initializeButton();
    } else {
      this.updateButton();
    }
  }
}
