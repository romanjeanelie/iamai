import { API_STATUSES } from "../constants";

export default class TaskManagerButton {
  constructor(tasks, emitter) {
    this.tasks = tasks;
    this.emitter = emitter;
    this.button = document.querySelector(".task-manager__button");

    this.addEventListeners();
  }

  countCompletedTasks() {
    const completedTasks = this.tasks.filter((task) => task.status.type === API_STATUSES.ENDED);
    return completedTasks.length;
  }

  handleTaskButton() {
    if (this.countCompletedTasks() > 0) {
      this.button.classList.remove("hidden");
    } else {
      this.button.classList.add("hidden");
    }
    this.updateButton();
  }

  updateButton() {
    this.button.innerHTML = this.countCompletedTasks();
  }

  addEventListeners() {
    this.emitter.on("taskManager:updateStatus", () => {
      this.handleTaskButton();
    });
  }
}
