import { API_STATUSES } from "../constants";

export default class TaskManagerButton {
  constructor(tasks, emitter) {
    this.tasks = tasks;
    this.emitter = emitter;
    this.button = document.querySelector(".task-manager__button");

    this.addEventListeners();
  }

  countRelevantTasks() {
    const relevantTasks = this.tasks.filter(
      (task) => task.status.type === API_STATUSES.ENDED || task.status.type === API_STATUSES.INPUT_REQUIRED
    );
    return relevantTasks.length;
  }

  handleTaskButton() {
    if (this.countRelevantTasks() > 0) {
      this.showButton();
    } else {
      this.hideButton();
    }
    this.updateButton();
  }

  updateButton() {
    this.button.innerHTML = this.countRelevantTasks();
  }

  hideButton() {
    this.button.classList.add("hidden");
  }

  showButton() {
    if (this.countRelevantTasks() > 0) this.button.classList.remove("hidden");
  }

  addEventListeners() {
    this.emitter.on("taskManager:updateStatus", () => {
      this.handleTaskButton();
    });

    this.emitter.on("taskManager:taskRead", this.handleTaskButton.bind(this));

    this.emitter.on("Navigation:openTasks", this.hideButton.bind(this));
    this.emitter.on("Navigation:closeTasks", this.showButton.bind(this));
  }
}
