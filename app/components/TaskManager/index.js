import gsap from "gsap";
import Flip from "gsap/Flip";

import fetcher from "../../utils/fetcher";
import { API_STATUSES, URL_AGENT_STATUS, URL_DELETE_STATUS } from "../constants";
import { store } from "../store";

import TaskManagerAnimations from "./TaskManagerAnimations";
import TaskManagerButton from "./TaskManagerButton";
import TaskManagerCard from "./TaskManagerCard";
import TaskManagerDebug from "./TaskManagerDebug";
import { getPreviousDayTimestamp } from "../History";
import { MoviesUI, FlightUI, ProductUI, HotelsUI } from "../UI";
import {
  flightSearchData,
  flightSearchResultsData,
  hotelSearchData,
  hotelSearchResultsData,
  moviesResultData,
  productResultData,
} from "../../../testData";

import TaskFetcher from "./TaskFetcher";
import { GUI } from "dat.gui";

gsap.registerPlugin(Flip);

export default class TaskManager {
  constructor({ emitter, navigation }) {
    this.emitter = emitter;
    this.navigation = navigation;

    // DOM Elements
    this.html = document.documentElement;
    this.container = document.querySelector(".task-manager__container");
    this.tasksGrid = document.querySelector(".task-manager__tasks-grid");

    // States
    this.tasks = [];
    this.tasksUI = [];
    this.currentDay = null;
    this.isHistorySet = false;

    // Init Methods
    this.button = new TaskManagerButton(this.tasks, this.emitter);
    this.animations = new TaskManagerAnimations(this.emitter);
    this.addListeners();

    // Debug
    this.debug = import.meta.env.VITE_DEBUG === "true";
    if (this.debug) {
      this.gui = new GUI();
      this.debugger = new TaskManagerDebug(this);
      this.debugger.addDebugTask();

      this.onStatusUpdate(this.tasks[0].key, {
        type: API_STATUSES.PROGRESSING,
        title: "Progressing",
        description:
          " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi maiores, culpa architecto enim autem iusto! Maxime sunt explicabo pariatur corporis accusantium, voluptas excepturi quam inventore dicta, consequatur soluta ipsam doloremque? ",
      });

      const testProductResult = new ProductUI(productResultData);
      const testMovieResult = new MoviesUI(moviesResultData, this.emitter);
      const testHotelResult = new HotelsUI(hotelSearchData, hotelSearchResultsData, this.emitter);
      const testFlightResult = new FlightUI(flightSearchData, flightSearchResultsData);

      this.onStatusUpdate(
        this.tasks[0].key,
        {
          type: API_STATUSES.ENDED,
          title: "Ended",
          description: "Task has ended",
        },
        testHotelResult
      );

      this.debugger.addDebugTask();
      this.debugger.addDebugTask();
    }
  }

  // ---------- Handling the task-manager states ----------
  initTaskManager() {
    this.fetcher = new TaskFetcher(this.emitter);
    gsap.set(this.container, {
      yPercent: 100,
    });

    this.container.classList.remove("hidden");
  }

  // ---------- Notification Pill ----------
  handleNotificationPill(taskKey, status) {
    if (status.type === API_STATUSES.INPUT_REQUIRED || status.type === API_STATUSES.ENDED) {
      new NotificationPill(taskKey, status); // Create a new instance of NotificationPill
    }
  }

  // ---------- Handling the tasks ----------
  createTask(task) {
    // Handling the Data
    this.tasks.unshift(task);

    // Handling the UI
    const initialState = Flip.getState(".task-manager__task-card-container");
    const newCardUI = new TaskManagerCard(task, this, this.emitter);

    // Handling the Date
    const taskDate = new Date(task.createdAt);
    const taskDay = taskDate?.toDateString();
    this.currentDay = taskDate;
    this.removePreviousDates(taskDay);
    this.addDate();

    this.animations.cardInOutAnimation(newCardUI, initialState);
    this.tasksUI.unshift(newCardUI);

    // Handling the Index
    this.updateTasksIndex();
  }

  addDate() {
    const divDate = document.createElement("div");
    divDate.classList.add("task-manager__date");
    const dayMonthYear = this.currentDay.toDateString();
    divDate.setAttribute("data-date", this.currentDay.toDateString());

    if (dayMonthYear === new Date().toDateString()) {
      divDate.innerHTML = "Today";
    } else {
      divDate.innerHTML = this.currentDay.toLocaleDateString("en-US", {
        weekday: "long",
      });
    }

    this.tasksGrid.prepend(divDate);
  }

  removePreviousDates(day) {
    // Remove the dom nodes
    const existingDates = this.tasksGrid.querySelectorAll(".task-manager__date");

    existingDates?.forEach((dateElement) => {
      if (dateElement.dataset.date === day) {
        dateElement.remove();
      }
    });
  }

  updateTasksIndex() {
    this.tasksUI.forEach((taskCard) => {
      const index = this.tasks.findIndex((task) => task.key === taskCard.task.key);
      taskCard.updateIndex(index);
    });
  }

  async deleteTask(taskKey) {
    const task = this.tasks.find((t) => t.key === taskKey);

    // Find and remove task from tasks array
    this.tasks = this.tasks.filter((t) => t.key !== taskKey);

    // Check if there is other tasks with the same date
    const taskDate = new Date(task.createdAt);
    const taskDay = taskDate?.toDateString();
    // if there si no other tasks with the same date, remove the date from the UI
    const isDatePresent = this.tasks.some((t) => {
      const tDate = new Date(t.createdAt);
      return tDate?.toDateString() === taskDay;
    });

    if (!isDatePresent) {
      this.removePreviousDates(taskDay);
    }

    // Find and remove the corresponding task card from taskCards array
    const taskCardIndex = this.tasksUI.findIndex((card) => card.task.key === taskKey);

    if (taskCardIndex === -1) {
      console.log("Task not found in the UI");
      return;
    }

    const initialState = Flip.getState(".task-manager__task-card-container");
    const taskUI = this.tasksUI[taskCardIndex];
    taskUI.removeTaskUI(); // Remove the task card's UI from the DOM
    this.animations.cardInOutAnimation(taskUI, initialState); // Animate the card out
    this.tasksUI.splice(taskCardIndex, 1); // Remove the card from the array

    // ---- Delete the task from the db ----
    const chatId = store.getState().chatId;
    const idToken = await store.getState().user.user.getIdToken(true);

    const params = {
      micro_thread_id: taskKey,
      uuid: chatId,
    };

    await fetcher({
      url: URL_DELETE_STATUS,
      params,
      idToken,
      method: "DELETE",
    });

    this.updateTasksIndex();
  }

  async postViewTask(taskKey) {
    const url = URL_AGENT_STATUS;
    const idToken = await store.getState().user.user.getIdToken(true);
    const params = {
      uuid: store.getState().chatId,
      micro_thread_id: taskKey,
      session_id: store.getState().session_id,
      status: API_STATUSES.VIEWED,
      time_stamp: getPreviousDayTimestamp(),
    };

    try {
      await fetcher({
        url,
        params,
        idToken,
        method: "POST",
      });
    } catch (e) {
      console.log(e);
    }
  }

  onStatusUpdate(taskKey, status, resultContainer, workflowID) {
    const taskIndex = this.tasks.findIndex((task) => task.key === taskKey);
    if (taskIndex === -1) return;

    const currentTask = this.tasks[taskIndex];

    const isFinalized =
      currentTask.status.type === API_STATUSES.ENDED || currentTask.status.type === API_STATUSES.VIEWED;
    const isValidTransition = !isFinalized || status.type === API_STATUSES.VIEWED;

    if (isValidTransition) {
      currentTask.status = status;
    }

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

    // Emitter
    this.emitter.on("taskManager:createTask", (task) => this.createTask(task));
    this.emitter.on("taskManager:updateStatus", (taskKey, status, container, workflowID) => {
      this.onStatusUpdate(taskKey, status, container, workflowID);
    });
    this.emitter.on("taskManager:deleteTask", (taskKey) => this.deleteTask(taskKey));
    this.emitter.on("taskManager:taskRead", async (taskKey) => await this.postViewTask(taskKey));
    this.emitter.on("app:initialized", (bool) => {
      this.isHistorySet = bool;
    });
  }
}
