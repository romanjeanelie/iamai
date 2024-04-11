import gsap from "gsap";
import Flip from "gsap/Flip";
import scrollToDiv from "../../utils/scrollToDiv";

const STATES = {
  CLOSED: "closed",
  MINIMIZED: "minimized",
  FULLSCREEN: "fullscreen",
};

export const TASK_STATUSES = {
  IN_PROGRESS: "In Progress",
  INPUT_REQUIRED: "Input Required",
  COMPLETED: "View Results",
};

const STATUS_COLORS = {
  [TASK_STATUSES.IN_PROGRESS]: "rgba(0, 0, 0, 0.72)",
  [TASK_STATUSES.INPUT_REQUIRED]: "rgba(224, 149, 2, 1)",
  [TASK_STATUSES.COMPLETED]: "rgba(0, 128, 83, 1)",
};

const defaultValues = {
  [TASK_STATUSES.IN_PROGRESS]: {
    label: "searching moving",
    title: "searching",
    description: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
  },
  [TASK_STATUSES.INPUT_REQUIRED]: {
    label: "Name your city",
    title: "question",
    description: "Flight for 18th Mar are all fully booked. Is there any other dates you would like to try for?",
  },
  [TASK_STATUSES.COMPLETED]: {
    title: "results",
    description: "Here's your flights to Bali!",
  },
};

gsap.registerPlugin(Flip);

export default class TaskManager {
  constructor({ gui, emitter }) {
    // DOM Elements
    this.container = document.querySelector(".task-manager__container");
    this.button = document.querySelector(".task-manager__button");
    this.closeButton = document.querySelector(".task-manager__closing-icon");
    this.fullscreenButton = document.querySelector(".task-manager__fullscreen-icon");
    this.closeFullscreenButton = document.querySelector(".task-manager__closeFullscreen-icon");
    this.accordionContainer = document.querySelector(".task-manager__accordion-container");

    // States
    this.tasks = [];
    this.taskManagerState = STATES.CLOSED;
    this.notificationTimeoutId = null;
    this.notificationDuration = 5000;
    this.isInputFullscreen = false;
    this.currentTask = null;

    this.isHistorySet = false;

    this.addListeners();

    // Debug
    this.debug = import.meta.env.VITE_DEBUG === "true";
    this.gui = gui;

    // Emitter
    this.emitter = emitter;
    this.emitter.on("taskManager:createTask", (task, textAI) => this.createTask(task));
    this.emitter.on("taskManager:updateStatus", (taskKey, status, container, workflowID) =>
      this.onStatusUpdate(taskKey, status, container, workflowID)
    );
    this.emitter.on("taskManager:deleteTask", (taskKey) => this.deleteTask(taskKey));
    this.emitter.on("taskManager:isHistorySet", (bool) => (this.isHistorySet = bool));

    if (this.debug) {
      console.log("Debug mode enabled");
      this.debugTask = {
        name: `Task ${this.tasks.length + 1}`,
        key: this.tasks.length + 1,
      };

      this.taskNameController = this.gui.add(this.debugTask, "name").onChange((value) => {
        this.debugTask.name = value;
      });

      this.gui.add(
        {
          addTask: (e) => {
            const task = {
              ...this.debugTask,
              status: { type: TASK_STATUSES.IN_PROGRESS, ...defaultValues[TASK_STATUSES.IN_PROGRESS] },
            };
            const textAI =
              "Certainly! I'm currently searching for the best flight options to Bali for you. Please give me a moment to find the most suitable flights. In the meantime, feel free to ask any other questions or make additional requests. I'll get back to you with the flight details as soon as possible";

            this.addDebugTask(task);
            this.emitter.emit("taskManager:createTask", task, textAI);

            this.debugTask.name = `Task ${this.tasks.length + 1}`;
            this.debugTask.key = this.tasks.length + 1;
            this.taskNameController.setValue(this.debugTask.name);
          },
        },
        "addTask"
      );

      this.tasks.forEach((task) => {
        this.addDebugTask(task);
      });
    }
  }

  addDebugTask(task) {
    const folder = this.gui.addFolder(task.name);
    folder.open();
    folder.add(task.status, "type", TASK_STATUSES).onChange((value) => {
      const status = { type: value, ...defaultValues[value] };
      titleController.setValue(task.status.title);
      descriptionController.setValue(task.status.description);
      if (value === TASK_STATUSES.COMPLETED) {
        const container = document.createElement("div");
        container.innerHTML = "Here's your flights to Bamako!";
        this.emitter.emit("taskManager:updateStatus", task.key, status, container);
      } else if (value === TASK_STATUSES.INPUT_REQUIRED) {
        const workflowID = "1234";
        this.emitter.emit("taskManager:updateStatus", task.key, status, null, workflowID);
      } else {
        this.emitter.emit("taskManager:updateStatus", task.key, status);
      }
    });

    const titleController = folder
      .add(task.status, "title")
      .onChange((value) => {
        task.status.title = value;
      })
      .name("status title");

    const descriptionController = folder
      .add(task.status, "description")
      .onChange((value) => {
        task.status.description = value;
      })
      .name("status desc");

    folder.add(
      {
        updateStatus: () => {
          this.emitter.emit("taskManager:updateStatus", task.key, task.status);
        },
      },
      "updateStatus"
    );
    folder.add(
      {
        deleteTask: () => {
          this.emitter.emit("taskManager:deleteTask", task.key);
          this.debugTask.name = `Task ${this.tasks.length + 1}`;
          this.debugTask.key = this.tasks.length + 1;
          this.taskNameController.setValue(this.debugTask.name);
          this.gui.removeFolder(folder);
        },
      },
      "deleteTask"
    );
  }

  // ---------- Handling the task-manager states ----------
  changeState(newState) {
    this.taskManagerState = newState;
    const initialState = Flip.getState(this.container);

    if (newState !== STATES.FULLSCREEN) {
      this.unblockScroll();
    } else {
      this.blockScroll();
    }

    // Remove all state classes
    this.container.classList.remove("closed", "minimized", "fullscreen");
    // Add the new state class
    this.container.classList.add(newState);

    Flip.from(initialState, {
      duration: 0.5,
      ease: "power2.inOut",
      absolute: true,
    });
  }

  closeTaskManager() {
    this.changeState(STATES.CLOSED);
  }

  toMinimized() {
    this.closeFullscreenButton.classList.add("hidden");
    this.fullscreenButton.classList.remove("hidden");
    const isMobile = window.innerWidth < 820;
    // if on mobile, we go straight to fullscreen
    this.changeState(isMobile ? STATES.FULLSCREEN : STATES.MINIMIZED);
  }

  blockScroll() {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
  }

  unblockScroll() {
    document.body.style.overflow = "";
    document.body.style.height = "";
  }

  toFullscreen() {
    this.closeFullscreenButton.classList.remove("hidden");
    this.fullscreenButton.classList.add("hidden");
    this.changeState(STATES.FULLSCREEN);
  }

  // ---------- Handling the notification pill ----------
  initNotificationPill(taskKey, status) {
    if (this.notificationContainer) this.disposeNotificationPill();

    this.notificationContainer = document.createElement("div");
    this.notificationContainer.classList.add("task-manager__notification-container", "hidden");

    this.notificationContainer.style.backgroundColor = STATUS_COLORS[status.type];

    const notificationLabel = document.createElement("div");
    notificationLabel.classList.add("task-manager__notification-label");
    const notificationLabelP = document.createElement("p");
    notificationLabelP.textContent = status.label || status.type;

    const notificationCloseBtn = document.createElement("button");
    notificationCloseBtn.classList.add("task-manager__notification-closeBtn");
    notificationCloseBtn.innerHTML = `
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.800781" y="1.47949" width="0.96" height="10.56" rx="0.48" transform="rotate(-45 0.800781 1.47949)" fill="white"/>
        <rect x="0.799805" y="8.26758" width="10.56" height="0.96" rx="0.48" transform="rotate(-45 0.799805 8.26758)" fill="white"/>
      </svg>
    `;

    notificationLabel.appendChild(notificationLabelP);
    this.notificationContainer.appendChild(notificationLabel);
    this.notificationContainer.appendChild(notificationCloseBtn);
    document.body.appendChild(this.notificationContainer);

    this.notificationContainer.addEventListener("click", () => this.handleClickOnNotificationPill(taskKey, status));
    notificationCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.closeNotificationPill();
    });

    this.expandNotificationPill();
  }

  expandNotificationPill() {
    const label = this.notificationContainer.querySelector(".task-manager__notification-label");
    const closeBtn = this.notificationContainer.querySelector(".task-manager__notification-closeBtn");
    const svg = closeBtn.querySelector("svg");

    gsap.to(this.notificationContainer, {
      opacity: 1,
      onComplete: () => {
        const initialState = Flip.getState([this.notificationContainer, label, closeBtn, svg]);
        this.notificationContainer.classList.add("expanded");
        Flip.from(initialState, {
          duration: 0.5,
          ease: "power2.inOut",
          absolute: true,
          onComplete: () => {
            this.notificationContainer.classList.remove("hidden");
            this.notificationTimeoutId = setTimeout(() => {
              this.closeNotificationPill();
              this.notificationTimeoutId = null;
            }, this.notificationDuration);
          },
        });
      },
    });
  }

  closeNotificationPill() {
    if (!this.notificationContainer) return;

    const label = this.notificationContainer.querySelector(".task-manager__notification-label");
    const closeBtn = this.notificationContainer.querySelector(".task-manager__notification-closeBtn");
    const svg = closeBtn.querySelector("svg");
    const initialState = Flip.getState([this.notificationContainer, label, closeBtn, svg]);
    this.notificationContainer.classList.remove("expanded");
    Flip.from(initialState, {
      duration: 0.5,
      ease: "power2.inOut",
      absolute: true,
      onComplete: () => {
        gsap.to(this.notificationContainer, {
          opacity: 0,
          onComplete: () => this.disposeNotificationPill(),
        });
      },
    });
  }

  disposeNotificationPill() {
    this.notificationContainer?.remove();
    this.notificationContainer = null;
  }

  handleNotificationPill(taskKey, status) {
    if (status.type === TASK_STATUSES.INPUT_REQUIRED || status.type === TASK_STATUSES.COMPLETED) {
      this.initNotificationPill(taskKey, status);
    } else {
      this.notificationContainer?.classList.add("hidden");
    }
  }

  handleClickOnNotificationPill(taskKey, status) {
    if (this.notificationTimeoutId) {
      clearTimeout(this.notificationTimeoutId);
      this.notificationTimeoutId = null;
    }
    this.closeNotificationPill();

    if (status.type !== TASK_STATUSES.COMPLETED) {
      // open the task manager and go to the right panel
      this.toMinimized();
      this.goToPanel(taskKey);
    } else {
      this.viewResults(taskKey);
    }
  }

  // ---------- Handling the task-manager button ----------
  getButtonColor() {
    // order of priority for the color of the button
    const order = [TASK_STATUSES.COMPLETED, TASK_STATUSES.INPUT_REQUIRED, TASK_STATUSES.IN_PROGRESS];
    for (const status of order) {
      // the first status found in the tasks array will be the color of the button
      if (this.tasks.some((task) => task.status.type === status)) {
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
    this.button.style.backgroundColor = this.getButtonColor();
  }

  removeButton() {
    this.button.classList.add("hidden");
  }

  handleButton() {
    if (this.tasks.length === 0) {
      this.removeButton();
    } else if (this.tasks.length === 1) {
      this.initializeButton();
    } else {
      this.updateButton();
    }
  }

  // ---------- Handling the accordion ----------
  togglePanel(key) {
    // Check if the clicked panel is already open
    const isPanelOpen = this.currentTask === key;

    // Close all panels
    this.accordionPanels.forEach((panel) => (panel.style.maxHeight = "0px"));
    this.accordionHeaders.forEach((header) => header.classList.remove("active"));
    // If the clicked panel was not already open, open it
    if (!isPanelOpen) {
      const currentTask = this.accordionContainer.querySelector(`[task-key="${key}"]`);
      currentTask.querySelector(".task-manager__accordion-header").classList.add("active");
      const panel = currentTask.querySelector(".task-manager__accordion-panel");
      panel.style.maxHeight = panel.scrollHeight + "px";
      this.currentTask = key;
    } else {
      this.currentTask = null;
    }
  }

  goToPanel(key) {
    // Close all panels
    this.accordionPanels.forEach((panel) => (panel.style.maxHeight = "0px"));
    this.accordionHeaders.forEach((header) => header.classList.remove("active"));

    // Open the panel or if already openned update its the panel height
    const currentTask = this.accordionContainer.querySelector(`[task-key="${key}"]`);
    currentTask.querySelector(".task-manager__accordion-header").classList.add("active");
    const panel = currentTask.querySelector(".task-manager__accordion-panel");
    panel.style.maxHeight = panel.scrollHeight + "px";
    this.currentTask = key;

    // Scroll to the last status from the panel
    const statuses = Array.from(panel.querySelectorAll(".task-manager__status-container"));
    const lastStatus = statuses[statuses.length - 1];
    scrollToDiv(this.container, lastStatus);
  }

  // ---------- Update the tasks UI  ----------
  addTaskUI(data) {
    // Create elements
    const li = document.createElement("li");
    li.setAttribute("task-key", data.key);
    li.classList.add("task-manager__accordion");

    const headerDiv = document.createElement("div");
    headerDiv.classList.add("task-manager__accordion-header");

    const headerTitle = document.createElement("h4");
    headerTitle.textContent = data.name;

    const statusDiv = document.createElement("div");

    const statusPill = document.createElement("p");
    statusPill.classList.add("task-manager__status-pill");
    statusPill.style.backgroundColor = STATUS_COLORS[data.status.type];
    statusPill.textContent = data.status.label || data.status.type;

    const chevronButton = document.createElement("button");
    chevronButton.classList.add("task-manager__accordion-chevron");

    const chevronIcon = document.createElement("img");
    chevronIcon.src = "/images/down.svg";
    chevronIcon.alt = "chevron down icon";

    const panelDiv = document.createElement("div");
    panelDiv.classList.add("task-manager__accordion-panel");

    const statusWrapperDiv = document.createElement("div");
    statusWrapperDiv.classList.add("task-manager__status-wrapper");

    const statusContainerDiv = document.createElement("div");
    statusContainerDiv.classList.add("task-manager__status-container");

    const statusTitleP = document.createElement("p");
    statusTitleP.classList.add("task-manager__status-title");
    statusTitleP.textContent = data.status.title;

    const statusDescriptionP = document.createElement("p");
    statusDescriptionP.classList.add("task-manager__status-description");
    statusDescriptionP.textContent = data.status.description;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("task-manager__delete-btn");
    deleteButton.textContent = "CANCEL";

    // Append elements
    headerDiv.appendChild(headerTitle);
    statusDiv.appendChild(statusPill);
    chevronButton.appendChild(chevronIcon);
    statusDiv.appendChild(chevronButton);
    headerDiv.appendChild(statusDiv);

    statusContainerDiv.appendChild(statusTitleP);
    statusContainerDiv.appendChild(statusDescriptionP);
    statusWrapperDiv.appendChild(statusContainerDiv);
    panelDiv.appendChild(statusWrapperDiv);
    panelDiv.appendChild(deleteButton);

    li.appendChild(headerDiv);
    li.appendChild(panelDiv);

    this.accordionContainer.appendChild(li);

    // I set the accordionHeaders and Panels up to date
    this.accordionHeaders = Array.from(document.querySelectorAll(".task-manager__accordion-header"));
    this.accordionPanels = Array.from(document.querySelectorAll(".task-manager__accordion-panel"));

    headerDiv.addEventListener("click", () => this.togglePanel(data.key));
    deleteButton.addEventListener("click", () => this.emitter.emit("taskManager:deleteTask", data.key));
  }

  addStatus(key, statusWrapper, status) {
    const divider = document.createElement("div");
    divider.classList.add("task-manager__accordion-panel-divider");

    const statusContainerDiv = document.createElement("div");
    statusContainerDiv.classList.add("task-manager__status-container");

    const statusTitleP = document.createElement("p");
    statusTitleP.classList.add("task-manager__status-title");
    statusTitleP.textContent = status.title;

    const statusDescriptionP = document.createElement("p");
    statusDescriptionP.classList.add("task-manager__status-description");
    statusDescriptionP.textContent = status.description;

    statusContainerDiv.appendChild(statusTitleP);
    statusContainerDiv.appendChild(statusDescriptionP);

    if (status.type === TASK_STATUSES.INPUT_REQUIRED) {
      this.addInput(key, statusContainerDiv);
    }

    statusWrapper.appendChild(divider);
    statusWrapper.appendChild(statusContainerDiv);
    this.goToPanel(key);
  }

  addOnlyStatusTitle(key, statusWrapper, status) {
    const divider = document.createElement("div");
    divider.classList.add("task-manager__accordion-panel-divider");

    const statusContainerDiv = document.createElement("div");
    statusContainerDiv.classList.add("task-manager__status-container");

    const statusTitleP = document.createElement("p");
    statusTitleP.classList.add("task-manager__status-title");
    statusTitleP.textContent = status.title;

    statusContainerDiv.appendChild(statusTitleP);

    statusWrapper.appendChild(divider);
    statusWrapper.appendChild(statusContainerDiv);
    this.goToPanel(key);
  }

  updateTaskUI(key, status) {
    const task = this.accordionContainer.querySelector(`[task-key="${key}"]`);
    const header = task.querySelector(".task-manager__accordion-header");
    const statusPill = header.querySelector(".task-manager__status-pill");
    statusPill.innerText = status.type;
    statusPill.style.backgroundColor = STATUS_COLORS[status.type];

    const panel = task.querySelector(".task-manager__accordion-panel");
    const statusWrapper = task.querySelector(".task-manager__status-wrapper");
    const buttonDelete = task.querySelector(".task-manager__delete-btn");

    if (status.type === TASK_STATUSES.COMPLETED) {
      buttonDelete.classList.add("hidden");
      this.addOnlyStatusTitle(key, statusWrapper, status);
      this.makeStatusPillClickable(key, statusPill);
    } else {
      this.addStatus(key, statusWrapper, status);
    }
  }

  deleteTaskUI(key) {
    const task = this.accordionContainer.querySelector(`[task-key="${key}"]`);
    task.remove();
  }

  makeStatusPillClickable(key, statusPill) {
    statusPill.classList.add("clickable");
    statusPill.addEventListener("click", (e) => {
      e.stopPropagation();
      this.viewResults(key);
    });
  }

  // ---------- Handling the input ----------
  addInput(key, statusContainer) {
    const statusInputContainer = document.createElement("form");
    statusInputContainer.classList.add("task-manager__input-container");

    const statusInput = document.createElement("input");
    statusInput.type = "text";
    statusInput.classList.add("task-manager__input");

    const button = document.createElement("button");
    button.type = "submit";

    const buttonIcon = document.createElement("img");
    buttonIcon.src = "/icons/arrow-up.svg";
    buttonIcon.alt = "arrow up icon";
    button.appendChild(buttonIcon);

    statusInputContainer.addEventListener("click", (e) => this.handleMobileInput(statusContainer));
    statusInputContainer.addEventListener("submit", (e) => this.handleInputSubmit(e, key, statusInputContainer));

    statusInputContainer.appendChild(statusInput);
    statusInputContainer.appendChild(button);
    statusContainer.appendChild(statusInputContainer);
  }

  handleInputSubmit(e, key, container) {
    e.preventDefault();
    const task = this.tasks.find((task) => task.key === key);
    const input = e.target.querySelector("input");
    const value = input.value;
    this.emitter.emit("taskManager:inputSubmit", value, task);

    this.closeInput(container);

    this.onStatusUpdate(key, {
      type: TASK_STATUSES.IN_PROGRESS,
      title: "answer : ",
      description: value,
    });
  }

  closeInput(container) {
    this.closeTaskManager();
    container.style.display = "none";
  }

  // ---------- Handling the tasks ----------
  createTask(task) {
    this.tasks.push(task);
    this.addTaskUI(task);
    this.handleButton();
  }

  deleteTask(taskKey) {
    this.tasks = this.tasks.filter((task) => task.key !== taskKey);
    this.deleteTaskUI(taskKey);
    this.handleButton();
    if (this.tasks.length === 0) {
      this.closeTaskManager();
    }
  }

  onStatusUpdate(taskKey, status, container, workflowID) {
    const task = this.tasks.find((task) => task.key === taskKey);
    if (!task) return;
    task.status = status;
    if (container) task.resultsContainer = container;
    task.workflowID = workflowID;
    this.handleButton();
    this.updateTaskUI(taskKey, status);
    if (!this.isHistorySet) return;
    this.handleNotificationPill(taskKey, status);
  }

  // function triggered when click on completed task or the notification pill for completed task
  viewResults(key) {
    const task = this.tasks.find((task) => task.key === key);
    console.log("task:",task)
    this.emitter.emit("taskManager:viewResults", task, task.resultsContainer);

    this.closeNotificationPill();
    this.closeTaskManager();
    this.deleteTask(key);
  }

  addListeners() {
    this.button.addEventListener("click", () => this.toMinimized());
    this.closeButton.addEventListener("click", () => this.closeTaskManager());
    this.fullscreenButton.addEventListener("click", () => this.toFullscreen());
    this.closeFullscreenButton.addEventListener("click", () => this.toMinimized());
    window.addEventListener("resize", () => {
      if (this.taskManagerState === STATES.MINIMIZED && window.innerWidth < 820) {
        this.toFullscreen();
      }
    });
  }
}
