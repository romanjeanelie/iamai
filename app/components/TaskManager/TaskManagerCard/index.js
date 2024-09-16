import gsap from "gsap";
import Flip from "gsap/Flip";
import TaskCardAnimations from "./TaskCardAnimations";

import { STATUS_COLORS, TASK_STATUSES } from "..";
import { URL_AGENT_STATUS } from "../../constants";
import fetcher from "../../../utils/fetcher";

gsap.registerPlugin(Flip);

export default class TaskManagerCard {
  constructor(task, taskManager, emitter) {
    this.task = task;
    this.taskManager = taskManager;
    this.emitter = emitter;
    console.log(this.task);

    // Index of the task in the tasks array
    this.index = this.taskManager.tasks.findIndex((t) => t.key === this.task.key);

    // DOM Elements
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
              ${this.task.status.label || this.task.status.type}
            </p>
          </div>
        </div>
        <div class="task-manager__task-illustration">
          <div class="task-manager__task-illustration-cover">
          </div>
          <div class="task-manager__task-illustration-behind">
          </div>
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
    this.fullscreenState.appendChild(this.task.resultsContainer);
  }

  updateTaskUI(status) {
    this.statusPillLabel.innerText = status.type;
    this.statusPill.style.background = STATUS_COLORS[status.type];

    if (status.type === TASK_STATUSES.COMPLETED) {
      this.addResult(status);
    } else {
      this.addStatus();
    }
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
    if (this.task.status.type !== TASK_STATUSES.COMPLETED) return;

    this.task.status = {
      ...this.task.status,
      type: TASK_STATUSES.READ,
    };

    this.taskManager.updateTaskStatus(this.task);
    this.emitter.emit("taskManager:taskRead", this.task.key);
  }

  addEventListeners() {
    this.card.addEventListener("click", () => {
      this.expandCardToFullscreen();
      this.markAsRead();
    });

    this.emitter.on("taskManager:updateStatus", (taskKey, status) => {
      if (this.task.key === taskKey) {
        this.updateTaskUI(status);
      }
    });
  }

  getElement() {
    return this.cardContainer;
  }
}
