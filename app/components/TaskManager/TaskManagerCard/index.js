import TaskCardAnimations from "./TaskCardAnimations";

import { API_STATUSES } from "../../constants";
import { STATUS_COLORS, TASK_PANELS } from "../taskManagerConstants";
import TaskCardAccordion from "./TaskCardAccordion";
import TaskCardStatus from "./TaskCardStatus";

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
    this.resultDetail = null;

    // Bindings
    this.handleClickOutside = this.handleClickOutside.bind(this);

    // Init Methods
    this.initUI();
    this.accordion = new TaskCardAccordion({ container: this.fullscreenState });
    this.proSearch = new TaskCardStatus({ card: this });
    this.addListeners();

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

      <div class="task-manager__result-detail no-scrollbar">
    `;

    this.cardState = this.card.querySelector(".card-state");
    this.fullscreenState = this.card.querySelector(".fullscreen-state");
    this.resultDetail = this.card.querySelector(".task-manager__result-detail");
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
  initResultsContainer() {
    this.resultsContainer = this.accordion.addNewPanel(TASK_PANELS.ANSWER, "/icons/blue-magic-wand.png");
  }

  addResult() {
    if (!this.resultsContainer) {
      this.initResultsContainer();
    }
    if (this.task.resultsContainer instanceof Node) {
      this.resultsContainer.appendChild(this.task.resultsContainer);
    } else if (this.task.resultsContainer?.isClass) {
      // if resultsContainer is not a dom element but a CLASS instance (from the UI components)
      this.results = this.task.resultsContainer;
      this.resultsContainer.appendChild(this.results.getElement());
    } else {
      console.error("resultsContainer is not a valid DOM Node", this.task.resultsContainer);
    }

    this.accordion.displayChevrons();
  }

  updateTaskUI(taskData = null) {
    if (taskData) this.task = taskData;

    if (this.task.status?.label) this.statusPillLabel.innerText = this.task.status.label;
    if (this.task.status?.type) this.statusPill.style.background = STATUS_COLORS[this.task.status.type];

    if (this.task.status?.type === API_STATUSES.ENDED) {
      // Set all the preceding proSearch states to completed
      this.proSearch.updatePrecedingStatusesStates();
      // Adds the result AnswerPanel
      this.addResult();
      // the completed class mostly adds the notification mark on the card
      this.card.classList.add("completed");
    } else if (this.task.status?.type === API_STATUSES.VIEWED) {
      // remove the completed class and notification mark
      this.card.classList.remove("completed");
    } else if (this.task.status?.type === API_STATUSES.INPUT_REQUIRED) {
      // the input-required class mostly adds the input required notification mark on the card
      this.card.classList.add("input-required");
      this.proSearch.addStatus(this.task.status);
    } else {
      this.card.classList.remove("input-required");
      this.proSearch.addStatus(this.task.status);
    }

    this.accordion.updateActivePanelHeight();
  }

  // From card to fullscreen
  expandCardToFullscreen() {
    if (this.isExpanded) return;
    this.isExpanded = true;
    this.animations.cardToFullScreen(this.index, () => {
      document.addEventListener("click", this.handleClickOutside);
      this.fullscreenContainer.classList.add("active");
      this.accordion.updateActivePanelHeight();
      const activePanel = this.accordion.getActivePanel();
      if (activePanel === TASK_PANELS.PROSEARCH) this.proSearch.scrollToBottom();
    });
  }

  closeFullscreen() {
    this.isExpanded = false;
    this.animations.fullscreenToCard(this.index);
    this.fullscreenContainer.classList.remove("active");
  }

  // Show details when click on a result item
  openResultDetails() {
    // Hide the fullscreen state
    this.animations.hideFullScreenState(() => {
      this.fullscreenState.style.display = "none";
    });

    // Set up back button
    const backButton = document.createElement("button");
    backButton.className = "task-manager__back-button";
    backButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M8.75008 15.8334L2.91675 10.0001L8.75008 4.16671M17.0834 10.0001L3.33341 10" stroke="#817B93" stroke-width="1.66667"/>
      </svg>
      <p>Back</p>
    `;

    backButton.addEventListener("click", () => {
      this.closeResultDetails();
    });

    // // show result details
    this.resultDetail.style.display = "block";
    this.resultDetail.appendChild(backButton);
    this.resultDetail.append(this.results.getResultsDetails());
    this.animations.showResultDetails(this.resultDetail, backButton);
  }

  closeResultDetails() {
    this.animations.showResultsTl.reverse();
    this.animations.showFullScreenState();
  }

  // Close fullscreen when clicking outside the fullscreen container
  handleClickOutside(event) {
    if (!this.fullscreenContainer.contains(event.target) && !this.debug) {
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

  getElement() {
    return this.cardContainer;
  }

  dispose() {
    this.card.removeEventListener("click", this.expandCardToFullscreen);
    this.cardContainer.remove();
  }

  addListeners() {
    this.emitter.on("taskManager:showDetail", (taskData) => {
      if (this.isExpanded) this.openResultDetails(taskData.type);
    });

    this.card.addEventListener("click", () => {
      this.expandCardToFullscreen();
      this.markAsRead();
    });
  }
}
