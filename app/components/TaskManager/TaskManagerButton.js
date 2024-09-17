import { TASK_STATUSES } from ".";

export default class TaskManagerButton {
  constructor(tasks, emitter) {
    this.tasks = tasks;
    this.emitter = emitter;
    this.button = document.querySelector(".task-manager__button");

    this.addEventListeners();
  }

  countCompletedTasks() {
    const completedTasks = this.tasks.filter((task) => task.status.type === TASK_STATUSES.COMPLETED);
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
