import TaskCardAnimations from "./TaskCardAnimations";

import { API_STATUSES } from "../../constants";
import { TaskCardInput } from "./TaskCardInput";
import { STATUS_COLORS, STATUS_PROGRESS_STATES } from "../taskManagerConstants";
import TaskAccordion from "./TaskAccordion";

export default class TaskManagerCard {
  constructor(task, taskManager, emitter) {
    this.task = task;
    this.taskManager = taskManager;
    this.emitter = emitter;

    // Index of the task in the tasks array
    this.debug = import.meta.env.VITE_DEBUG === "true";
    this.index = this.taskManager.tasks.findIndex((t) => t.key == this.task.key);

    // States
    this.isExpanded = false;

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
    this.accordion = new TaskAccordion({ container: this.fullscreenState });
    this.addEventListeners();

    if (this.debug) {
      if (this.task.key === 1) {
        setTimeout(() => {
          this.expandCardToFullscreen();
        }, 15);
      }
    }
  }

  // Create the card element
  initUI() {
    this.cardContainer = document.createElement("li");
    this.cardContainer.classList.add("task-manager__task-card-container");

    this.card = document.createElement("div");
    this.card.classList.add("task-manager__task-card");
    this.card.setAttribute("task-key", this.task.key);

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
    this.tasksGrid.prepend(this.cardContainer);

    this.animations = new TaskCardAnimations(this.card);
  }

  updateIndex(index) {
    this.index = index;
    this.card.setAttribute("index", index);
  }

  // Update the state
  initProSearch() {
    this.proSearchContainer = this.accordion.addNewPanel("Pro Search", "/icons/blue-sparkles.png");
  }

  initResultsContainer() {
    this.resultsContainer = this.accordion.addNewPanel("Answer", "/icons/blue-magic-wand.png");
  }

  addStatus() {
    if (!this.proSearchContainer) {
      this.initProSearch();
    }

    const statusContainer = document.createElement("div");

    statusContainer.className = `proSearch__status-container ${STATUS_PROGRESS_STATES.IDLE}`;
    statusContainer.innerHTML = `
      <div class="proSearch__status-side">
        <div class="proSearch__status-progress ">
          <div></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9.25 12.5L11.25 14.5L14.75 9.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="proSearch__status-line"></div>
      </div>
      <p class="proSearch__status-description">${this.task.status.description}</p>
    `;

    this.proSearchContainer.appendChild(statusContainer);

    if (this.task.status.type === API_STATUSES.INPUT_REQUIRED && !this.input) {
      this.input = new TaskCardInput({
        taskCard: this,
        emitter: this.emitter,
      });
    } else if (this.task.status.type !== API_STATUSES.INPUT_REQUIRED && this.input) {
      this.input.dispose();
      this.input = null;
    }
  }

  addResult() {
    if (!this.resultsContainer) {
      this.initResultsContainer();
    }

    if (this.task.resultsContainer instanceof Node) {
      this.resultsContainer.appendChild(this.task.resultsContainer);
      this.accordion.toggleChevrons();
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
      this.card.classList.remove("completed");
    } else if (this.task.status?.type === API_STATUSES.INPUT_REQUIRED) {
      this.card.classList.add("input-required");
      this.addStatus();
    } else {
      this.card.classList.remove("input-required");
      this.addStatus();
    }
  }

  removeTaskUI() {
    this.cardContainer.remove();
  }

  // From card to fullscreen
  expandCardToFullscreen() {
    if (this.isExpanded) return;
    this.isExpanded = true;
    this.animations.cardToFullScreen(this.index, () => {
      // if (!this.debug) {
      document.addEventListener("click", this.handleClickOutside);
      // }
      this.fullscreenContainer.classList.add("active");
      this.input?.updatePosition();
    });
  }

  closeFullscreen() {
    this.isExpanded = false;
    this.animations.fullscreenToCard(this.index);
    this.fullscreenContainer.classList.remove("active");
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
