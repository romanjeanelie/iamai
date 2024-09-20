import TaskCardAnimations from "./TaskCardAnimations";

import { STATUS_COLORS } from "..";
import { API_STATUSES } from "../../constants";

export default class TaskManagerCard {
  constructor(task, taskManager, emitter) {
    this.task = task;
    console.log(this.task.status);
    this.taskManager = taskManager;
    this.emitter = emitter;

    // Index of the task in the tasks array
    this.index = this.taskManager.tasks.findIndex((t) => t.key === this.task.key);

    // DOM Elements
    this.container = document.querySelector(".task-manager__container");
    this.tasksGrid = document.querySelector(".task-manager__tasks-grid");
    this.fullscreenContainer = document.querySelector(".task-manager__task-fullscreen");
    this.cardContainer = null;
    this.cardState = null;
    this.fullscreenState = null;

    // Bindings
    this.handleClickOutside = this.handleClickOutside.bind(this);

    // Init Methods
    this.initUI();
    this.addEventListeners();
  }

  // Create the card element
  initUI() {
    this.cardContainer = document.createElement("li");
    this.cardContainer.classList.add("task-manager__task-card-container");

    this.card = document.createElement("div");
    this.card.classList.add("task-manager__task-card");
    this.card.setAttribute("task-key", this.task.key);
    this.card.setAttribute("index", this.index);

    this.card.innerHTML = `
      <div class="card-state">
        <div class="task-manager__task-card-content">
          <h3 class="task-manager__task-card-title">
            ${this.task.name} 
          </h3>

          <div class="task-manager__task-status">
            <p class="task-manager__task-status-label">
              ${this.task.status.label}
            </p>
            </div>
        </div>
        <div class="task-manager__task-illustration">
          <div class="task-manager__task-illustration-cover">
          </div>
          <div class="task-manager__task-illustration-behind">
          </div>
        </div>
        <div class="task-manager__task-completed-notification task-manager__button"> 
        1
        </div> 
      </div>

      <div class="fullscreen-state">
        <div class="discussion__userspan">
          ${this.task.name}          
        </div>
      </div>
    `;

    this.cardState = this.card.querySelector(".card-state");
    this.fullscreenState = this.card.querySelector(".fullscreen-state");
    this.statusPill = this.card.querySelector(".task-manager__task-status");
    this.statusPill.style.background = STATUS_COLORS[this.task.status.type];

    this.statusPillLabel = this.card.querySelector(".task-manager__task-status-label");

    this.cardContainer.appendChild(this.card);
    this.tasksGrid.appendChild(this.cardContainer);

    this.animations = new TaskCardAnimations(this.card, this.index);
  }

  // Update the state
  addStatus() {
    // console.log(this.task);
  }

  addResult() {
    if (this.task.resultsContainer instanceof Node) {
      this.fullscreenState?.appendChild(this.task.resultsContainer);
    } else {
      console.error("resultsContainer is not a valid DOM Node", this.task.resultsContainer);
    }
  }

  updateTaskUI(taskData = null) {
    if (taskData) this.task = taskData;

    if (this.task.status?.label) this.statusPillLabel.innerText = this.task.status.label;
    if (this.task.status?.type) this.statusPill.style.background = STATUS_COLORS[this.task.status.type];

    if (this.task.status?.type === API_STATUSES.ENDED) {
      this.addResult();
      this.card.classList.add("completed");
    } else if (this.task.status?.type === API_STATUSES.VIEWED) {
      this.addResult();
      this.card.classList.remove("completed");
    } else {
      this.addStatus();
    }
  }

  removeTaskUI() {
    this.cardContainer.remove();
  }

  // From card to fullscreen
  expandCardToFullscreen() {
    this.animations.cardToFullScreen(() => {
      document.addEventListener("click", this.handleClickOutside);
    });
  }

  closeFullscreen() {
    this.animations.fullscreenToCard();
  }

  // Close fullscreen when clicking outside the fullscreen container
  handleClickOutside(event) {
    if (!this.fullscreenContainer.contains(event.target)) {
      this.closeFullscreen();
      document.removeEventListener("click", this.handleClickOutside);
    }
  }

  markAsRead() {
    if (this.task.status?.type !== API_STATUSES.ENDED) return;
    this.task.status = {
      ...this.task.status,
      type: API_STATUSES.VIEWED,
    };
    this.updateTaskUI(this.task);
    this.emitter.emit("taskManager:taskRead", this.task.key);
  }

  addEventListeners() {
    this.card.addEventListener("click", () => {
      this.expandCardToFullscreen();
      this.markAsRead();
    });
  }

  getElement() {
    return this.cardContainer;
  }

  dispose() {
    this.card.removeEventListener("click", this.expandCardToFullscreen);
    this.cardContainer.remove();
  }
}
