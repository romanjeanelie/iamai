import gsap from "gsap";
import Flip from "gsap/Flip";
import { flightSearchData, flightSearchResultsData } from "../../../testData";

const STATES = {
  CLOSED: "closed",
  FULLSCREEN: "fullscreen",
};

export const TASK_STATUSES = {
  IN_PROGRESS: "In Progress",
  INPUT_REQUIRED: "Input Required",
  COMPLETED: "View Results",
};

const STATUS_COLORS = {
  [TASK_STATUSES.IN_PROGRESS]: "rgba(149, 159, 177, 0.14)",
  [TASK_STATUSES.INPUT_REQUIRED]:
    "linear-gradient(70deg, rgba(227, 207, 28, 0.30) -10.29%, rgba(225, 135, 30, 0.30) 105%)",
  [TASK_STATUSES.COMPLETED]: "linear-gradient(70deg, rgba(116, 225, 30, 0.30) -10.29%, rgba(28, 204, 227, 0.30) 105%)",
};

const defaultValues = {
  [TASK_STATUSES.IN_PROGRESS]: {
    label: "In progress",
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
  constructor({ gui, emitter, discussion, navigation }) {
    this.gui = gui;
    this.emitter = emitter;
    this.navigation = navigation;
    this.discussion = discussion;

    // DOM Elements
    this.html = document.documentElement;
    this.container = document.querySelector(".task-manager__container");
    this.tasksGrid = document.querySelector(".task-manager__tasks-grid");
    this.taskCards = document.querySelectorAll(".task-manager__task-card");
    this.fullscreenTaskContainer = document.querySelector(".task-manager__task-fullscreen");

    this.discussionContainer = document.querySelector(".discussion__wrapper");

    // States
    this.tasks = [];
    this.taskManagerState = STATES.CLOSED;
    this.notificationTimeoutId = null;
    this.notificationDuration = 1500000;
    this.isInputFullscreen = false;
    this.currentTask = undefined;
    this.isHistorySet = false;

    // Init Methods
    this.initTaskManager();
    this.addListeners();

    // Debug
    this.debug = import.meta.env.VITE_DEBUG === "true";

    // Emitter
    this.emitter.on("taskManager:createTask", (task) => this.createTask(task));
    this.emitter.on("taskManager:updateStatus", (taskKey, status, container, workflowID) =>
      this.onStatusUpdate(taskKey, status, container, workflowID)
    );
    this.emitter.on("taskManager:deleteTask", (taskKey) => this.deleteTask(taskKey));
    this.emitter.on("taskManager:isHistorySet", (bool) => (this.isHistorySet = bool));

    if (this.debug) {
      this.setupDebug();
      this.navigation.toggleTasks();
      const flightCard = this.tasksGrid.querySelector('[task-key="1"]');
      // this.animateCardToFullscreen(flightCard);
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

  setupDebug() {
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

  // ---------- Handling the task-manager button ----------
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
    this.button.style.backgroundColor = this.getButtonColor();
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

  // ---------- Handling the task-manager states ----------
  initTaskManager() {
    gsap.set(this.container, {
      yPercent: 100,
    });
  }

  blockScroll() {
    this.html.classList.add("no-scroll");
  }

  unblockScroll() {
    this.html.classList.remove("no-scroll");
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

    this.navigation.toggleTasks();
  }

  // ---------- Update the tasks UI  ----------
  addTaskUI(data) {
    // Create elements
    const cardContainer = document.createElement("li");
    cardContainer.setAttribute("task-key", data.key);
    cardContainer.classList.add("task-manager__task-card");

    const taskCardContent = document.createElement("div");
    taskCardContent.classList.add("task-manager__task-card-content");
    cardContainer.appendChild(taskCardContent);

    const headerTitle = document.createElement("h3");
    headerTitle.classList.add("task-manager__task-card-title");
    headerTitle.textContent = data.name;
    taskCardContent.appendChild(headerTitle);

    const statusPill = document.createElement("div");
    statusPill.classList.add("task-manager__task-status");
    statusPill.style.background = STATUS_COLORS[data.status.type];
    taskCardContent.appendChild(statusPill);

    const statusLabel = document.createElement("p");
    statusLabel.classList.add("task-manager__task-status-label");
    statusLabel.textContent = data.status.label || data.status.type;
    statusPill.appendChild(statusLabel);

    const taskCardIllustration = document.createElement("div");
    taskCardIllustration.classList.add("task-manager__task-illustration");
    cardContainer.appendChild(taskCardIllustration);

    const taskCardIllustrationCover = document.createElement("div");
    taskCardIllustrationCover.classList.add("task-manager__task-card-illustration-cover");
    taskCardIllustration.appendChild(taskCardIllustrationCover);

    const taskCardIllustrationBehind = document.createElement("div");
    taskCardIllustrationBehind.classList.add("task-manager__task-illustration-behind");
    taskCardIllustration.append(taskCardIllustrationBehind);

    this.tasksGrid.appendChild(cardContainer);

    cardContainer.addEventListener("click", () => {
      this.animateCardToFullscreen(cardContainer, currentTask);
    });
  }

  animateCardToFullscreen(cardContainer) {
    this.currentTask = cardContainer.getAttribute("task-key"); // we set the state of the current task
    const cardState = cardContainer.querySelector(".card-state");
    const fullscreenState = cardContainer.querySelector(".fullscreen-state");

    const tl = gsap.timeline();

    tl.to(cardState, {
      opacity: 0,
      duration: 0.2,
    });
    tl.add(() => {
      const state = Flip.getState(cardContainer);
      this.fullscreenTaskContainer.appendChild(cardContainer);
      fullscreenState.style.display = "flex";
      cardState.style.display = "none";
      Flip.from(state, {
        duration: 0.5,
        absolute: true,
        onComplete: () => {
          // FOR DEMO PURPOSES ONLY
          const flightCards = this.discussion.Chat.getFlightUI(flightSearchData, flightSearchResultsData);
          const AIContainer = document.createElement("div");
          AIContainer.classList.add("discussion__ai");
          AIContainer.appendChild(flightCards);
          fullscreenState.appendChild(AIContainer);
          document.addEventListener("click", handleClickOutside);
        },
      });
    });
    tl.to(
      fullscreenState,
      {
        autoAlpha: 1,
        duration: 0.5,
      },
      "<0.5"
    );

    const handleClickOutside = (event) => {
      if (!this.fullscreenTaskContainer.contains(event.target)) {
        this.closeFullscreen(cardContainer); // Call a method to close the fullscreen
        document.removeEventListener("click", handleClickOutside); // Clean up the event listener
      }
    };
  }

  closeFullscreen(cardContainer) {
    this.currentTask = undefined; // we reset the state of the current task
    const cardState = cardContainer.querySelector(".card-state");
    const fullscreenState = cardContainer.querySelector(".fullscreen-state");

    const tl = gsap.timeline();

    tl.to(fullscreenState, {
      opacity: 0,
    });
    tl.add(() => {
      const state = Flip.getState(cardContainer);
      this.tasksGrid.appendChild(cardContainer);
      fullscreenState.style.display = "none";
      cardState.style.display = "flex";

      Flip.from(state, {
        duration: 0.5,
        delay: 0.5,
        onComplete: () => {
          gsap.to(cardState, {
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.1,
          });
        },
      });
    });
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
    if (this.currentTask === key) {
      this.goToPanel(key);
    }
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

  // TO DO NEW WAY
  updateTaskUI(key, status) {
    // const task = this.accordionContainer.querySelector(`[task-key="${key}"]`);
    // const header = task.querySelector(".task-manager__accordion-header");
    // const statusPill = header.querySelector(".task-manager__status-pill");
    // statusPill.innerText = status.type;
    // statusPill.style.backgroundColor = STATUS_COLORS[status.type];
    // const statusWrapper = task.querySelector(".task-manager__status-wrapper");
    // const buttonDelete = task.querySelector(".task-manager__delete-btn");
    // if (status.type === TASK_STATUSES.COMPLETED) {
    //   buttonDelete.classList.add("hidden");
    //   this.addOnlyStatusTitle(key, statusWrapper, status);
    //   this.makeStatusPillClickable(key, statusPill);
    // } else {
    //   this.addStatus(key, statusWrapper, status);
    // }
  }

  deleteTaskUI(key) {
    // const task = this.accordionContainer.querySelector(`[task-key="${key}"]`);
    // task.remove();
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
  }

  deleteTask(taskKey) {
    this.tasks = this.tasks.filter((task) => task.key !== taskKey);
    this.deleteTaskUI(taskKey);
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
    this.updateTaskUI(taskKey, status);
    if (!this.isHistorySet) return;
    this.handleNotificationPill(taskKey, status);
  }

  // function triggered when click on completed task or the notification pill for completed task
  viewResults(key) {
    const task = this.tasks.find((task) => task.key === key);
    this.emitter.emit("taskManager:viewResults", task, task.resultsContainer);

    this.closeNotificationPill();
    this.closeTaskManager();
    this.deleteTask(key);
  }

  addListeners() {
    this.taskCards.forEach((card) => {
      card.addEventListener("click", () => this.animateCardToFullscreen(card));
    });

    // Prevent touch event bugs
    this.container.addEventListener("touchstart", (e) => {
      e.stopPropagation();
    });
    this.container.addEventListener("touchmove", (e) => {
      e.stopPropagation();
    });
    this.container.addEventListener("touchend", (e) => {
      e.stopPropagation();
    });
  }
}
