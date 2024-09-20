import gsap from "gsap";
import Flip from "gsap/Flip";

import TaskManagerButton from "./TaskManagerButton";
import TaskManagerCard from "./TaskManagerCard";
import TaskManagerAnimations from "./TaskManagerAnimations";
import { API_STATUSES, URL_DELETE_STATUS } from "../constants";
import fetcher from "../../utils/fetcher";
import { store } from "../store";
import TaskManagerDebug from "./TaskManagerCard/TaskManagerDebug";
import { NotificationPill } from "./TaskManagerCard/NotificationPill";

export const STATUS_COLORS = {
  [API_STATUSES.PROGRESSING]: "rgba(149, 159, 177, 0.14)",
  [API_STATUSES.INPUT_REQUIRED]:
    "linear-gradient(70deg, rgba(227, 207, 28, 0.30) -10.29%, rgba(225, 135, 30, 0.30) 105%)",
  [API_STATUSES.ENDED]: "linear-gradient(70deg, rgba(116, 225, 30, 0.30) -10.29%, rgba(28, 204, 227, 0.30) 105%)",
  [API_STATUSES.VIEWED]: "linear-gradient(70deg, rgba(116, 225, 30, 0.30) -10.29%, rgba(28, 204, 227, 0.30) 105%)",
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

    // States
    this.tasks = [];
    this.tasksUI = [];
    this.notificationTimeoutId = null;
    this.notificationDuration = 1500000;
    this.isInputFullscreen = false;
    this.currentTask = undefined;
    this.isHistorySet = false;

    // Init Methods
    this.button = new TaskManagerButton(this.tasks, this.emitter);
    this.animations = new TaskManagerAnimations(this.emitter);
    this.initTaskManager();
    this.addListeners();

    // Debug
    this.debug = import.meta.env.VITE_DEBUG === "true";
    if (this.debug) {
      this.debugger = new TaskManagerDebug(this);
    }

    // Emitter
    this.emitter.on("taskManager:createTask", (task) => this.createTask(task));
    this.emitter.on("taskManager:updateStatus", (taskKey, status, container, workflowID) =>
      this.onStatusUpdate(taskKey, status, container, workflowID)
    );
    this.emitter.on("taskManager:deleteTask", (taskKey) => this.deleteTask(taskKey));
    this.emitter.on("app:initialized", (bool) => {
      this.isHistorySet = bool;
    });
  }

  // ---------- Handling the task-manager states ----------
  initTaskManager() {
    gsap.set(this.container, {
      yPercent: 100,
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
      type: API_STATUSES.PROGRESSING,
      title: "answer : ",
      description: value,
    });
  }

  closeInput(container) {
    container.style.display = "none";
  }

  // ---------- Notification Pill ----------
  handleNotificationPill(taskKey, status) {
    if (status.type === API_STATUSES.INPUT_REQUIRED || status.type === API_STATUSES.ENDED) {
      new NotificationPill(taskKey, status); // Create a new instance of NotificationPill
    }
  }

  // ---------- Handling the tasks ----------
  createTask(task) {
    this.tasks.unshift(task);
    const initialState = Flip.getState(".task-manager__task-card-container");

    const newCardUI = new TaskManagerCard(task, this, this.emitter);

    Flip.from(initialState, {
      duration: 0.3,
      ease: "power1.inOut",
      onStart: () => {
        return gsap.fromTo(
          newCardUI.cardContainer,
          {
            opacity: 0,
            scale: 0.9,
          },
          {
            opacity: 1,
            scale: 1,
            delay: 0.2,
            duration: 0.3,
          }
        );
      },
    });

    this.tasksUI.unshift(newCardUI);
  }

  async deleteTask(taskKey) {
    // Find and remove task from tasks array
    this.tasks = this.tasks.filter((t) => t.key !== taskKey);

    // Find and remove the corresponding task card from taskCards array
    const taskCardIndex = this.tasksUI.findIndex((card) => card.task.key === taskKey);
    if (taskCardIndex !== -1) {
      const taskUI = this.tasksUI[taskCardIndex];
      taskUI.removeTaskUI(); // Remove the task card's UI from the DOM
      this.tasksUI.splice(taskCardIndex, 1); // Remove the card from the array
    }

    const chatId = store.getState().chatId;
    const idToken = await store.getState().user.user.getIdToken(true);

    // Find and remove the task from the db
    const params = {
      micro_thread_id: taskKey,
      uuid: chatId,
    };

    const result = await fetcher({
      url: URL_DELETE_STATUS,
      params,
      idToken,
      method: "DELETE",
    });
    console.log(result);
  }

  onStatusUpdate(taskKey, status, resultContainer, workflowID) {
    const taskIndex = this.tasks.findIndex((task) => task.key === taskKey);
    if (taskIndex === -1) return;

    if (this.tasks[taskIndex].status.type === API_STATUSES.ENDED) return;

    this.tasks[taskIndex].status = status;
    this.button.handleTaskButton();

    if (resultContainer) this.tasks[taskIndex].resultsContainer = resultContainer;
    this.tasks[taskIndex].workflowID = workflowID;

    this.notifyChildToUpdate(taskKey, taskIndex);
  }

  notifyChildToUpdate(taskKey, taskIndex) {
    const taskCard = this.tasksUI?.find((card) => card.task.key === taskKey);
    const taskData = this.tasks[taskIndex];
    if (taskCard) {
      taskCard.updateTaskUI(taskData);
    }
  }

  addListeners() {
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

    this.emitter.on("taskManager:deleteTask", (taskKey) => this.deleteTask(taskKey));
  }
}
