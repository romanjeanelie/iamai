import { TASK_STATUSES } from "./TaskManager/index.js";
import { API_STATUSES } from "./constants.js";
import fetcher from "../utils/fetcher.js";
import DiscussionTabs from "./DiscussionTabs.js";

const isEmpty = (obj) => Object.keys(obj).length === 0;

const BASE_URL = import.meta.env.VITE_API_HOST || "https://api.asterizk.ai";
const URL_CONVERSATION_HISTORY = `${BASE_URL}/search/conversation_history`;
const URL_AGENT_STATUS = `${BASE_URL}/search/agent_status`;

const isTask = (el) => el.micro_thread_id !== "";
const isTaskViewed = (el) => isTask(el) && el.statuses?.lastStatus === API_STATUSES.VIEWED;

function getPreviousDayTimestamp() {
  const currentDate = new Date();
  const previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - 1);
  return previousDate.toISOString();
}

export default class History {
  constructor({ getTaskResultUI, emitter }) {
    this.getTaskResultUI = getTaskResultUI;
    this.emitter = emitter;

    this.elements = null;
    this.isSet = false;
    this.isFetching = false;
    this.newStart = 0;
  }

  getResultsUI(statuses) {
    let resultsContainer = null;

    statuses.forEach((status) => {
      if (status.type === "ui") {
        const results = status.response_json;
        resultsContainer = this.getTaskResultUI(results);
      }
    });

    return resultsContainer;
  }

  addStatuses(statuses, resultsContainer) {
    statuses.forEach((status) => {
      switch (status.status) {
        case API_STATUSES.STARTED:
          let taskname = status.task_name;

          const task = {
            key: status.micro_thread_id,
            name: taskname,
            status: {
              type: TASK_STATUSES.IN_PROGRESS,
              title: "Planning",
              description: "Planning your tasks.",
            },
          };
          const textAI = status.response_json.text;
          this.emitter.emit("taskManager:createTask", task, textAI);
        case API_STATUSES.PROGRESSING:
          if (status.awaiting) {
            let taskname = status.task_name;
            const task = {
              key: status.micro_thread_id,
              status: {
                type: TASK_STATUSES.INPUT_REQUIRED,
                label: taskname,
                title: taskname,
                description: status.response_json.text,
              },
              workflowID: status.session_id,
            };

            this.emitter.emit("taskManager:updateStatus", task.key, task.status, null, task.workflowID);
          } else {
            const task = {
              key: status.micro_thread_id,
              status: {
                type: TASK_STATUSES.IN_PROGRESS,
                title: status.response_json.text.split(" ")[0],
                description: status.response_json.text,
              },
            };

            this.emitter.emit("taskManager:updateStatus", task.key, task.status);
          }
          break;
        case API_STATUSES.ENDED:
          const taskEnded = {
            key: status.micro_thread_id,
            status: {
              type: TASK_STATUSES.COMPLETED,
              title: "Completed",
              description: status.response_json.text,
              label: status.task_name + " is completed",
            },
          };
          this.emitter.emit("taskManager:updateStatus", taskEnded.key, taskEnded.status, resultsContainer);
          break;
      }
    });
  }

  getTaskLastStatus(data) {
    const statuses = data.map((obj) => obj.status);

    if (statuses.includes(API_STATUSES.VIEWED)) {
      return API_STATUSES.VIEWED;
    } else if (statuses.includes(API_STATUSES.ENDED)) {
      return API_STATUSES.ENDED;
    } else if (statuses.includes(API_STATUSES.PROGRESSING)) {
      return API_STATUSES.PROGRESSING;
    } else {
      return API_STATUSES.STARTED;
    }
  }

  async getStatusesTask({ micro_thread_id, order = "asc" }) {
    const params = {
      micro_thread_id,
      order,
    };
    const { data, error } = await fetcher({ url: URL_AGENT_STATUS, params });
    const lastStatus = this.getTaskLastStatus(data.results);

    data.lastStatus = lastStatus;
    return data;
  }

  async getAllElements({ uuid, start = 0, size = 3, order = "desc" }) {
    const params = {
      uuid,
      start,
      size,
      order,
    };
    // Get all elements
    const { data, error } = await fetcher({ url: URL_CONVERSATION_HISTORY, params });

    // Remove duplicate tasks
    const uniqueMicroThreadId = [];
    const removedDuplicate = data?.results.filter((item) => {
      if (item.micro_thread_id === "") return true;
      if (!uniqueMicroThreadId.includes(item.micro_thread_id)) {
        uniqueMicroThreadId.push(item.micro_thread_id);
        return true;
      }
      return false;
    });
    data.results = removedDuplicate;

    // Get  statuses tasks
    for (const result of data?.results || []) {
      if (result.micro_thread_id !== "") {
        const statuses = await this.getStatusesTask({ micro_thread_id: result.micro_thread_id });
        result.statuses = statuses;
      }
    }

    return data;
  }

  createUIElements(elements) {
    const container = document.createElement("div");

    elements.forEach((element) => {
      if (element.user.length > 0) {
        const userContainer = document.createElement("div");
        userContainer.classList.add("discussion__user");
        userContainer.innerHTML = element.user;
        container.appendChild(userContainer);

        if (!isEmpty(element.images)) {
          const tabs = new DiscussionTabs({
            container: userContainer,
            emitter: this.emitter,
          });
          if (element.images.user_images) tabs?.initImages(JSON.parse(element.images.user_images));
          container.appendChild(userContainer);
        }

        if (isTask(element)) {
          userContainer.setAttribute("taskKey", element.micro_thread_id);
          userContainer.classList.add("discussion__user--task-created");
        }
      }

      if (isTaskViewed(element) && element.resultsContainer) {
        const AIContainer = document.createElement("div");
        AIContainer.classList.add("discussion__ai");
        AIContainer.innerHTML = element.assistant;
        AIContainer.appendChild(element.resultsContainer);
        container.appendChild(AIContainer);
      } else if (element.assistant.length > 0) {
        const AIContainer = document.createElement("div");
        AIContainer.classList.add("discussion__ai");
        AIContainer.innerHTML = element.assistant;
        container.appendChild(AIContainer);
        if (isTask(element)) {
          AIContainer.setAttribute("taskKey", element.micro_thread_id);
          AIContainer.classList.add("discussion__ai--task-created");
        }
        if (!isEmpty(element.sources) || !isEmpty(element.images)) {
          const tabs = new DiscussionTabs({
            container: AIContainer,
            emitter: this.emitter,
          });
          if (element.images.images) {
            tabs?.addTab("Images");
            tabs?.initImages(JSON.parse(element.images.images));
          }
          if (element.sources.sources) {
            tabs?.addTab("Sources");
            tabs?.initSources(JSON.parse(element.sources.sources));
          }

          tabs?.displayDefaultTab();
          tabs?.showSourcesTab();

          container.appendChild(AIContainer);
        }
      }
    });
    return container;
  }

  async getHistory({ uuid, size = 3 }) {
    this.isFetching = true;
    // Get elements
    const elements = await this.getAllElements({ uuid, size, start: this.newStart });
    const tempElements = await this.getAllElements({ uuid, size: size * 3, start: this.newStart });
    console.log("history1", elements, tempElements);
    // Reverse the order of elements
    elements.results.reverse();

    elements.results.forEach((element) => {
      if (!isTask(element)) return;
      const statuses = element.statuses.results;
      // Get results container
      const resultsContainer = this.getResultsUI(statuses);
      element.resultsContainer = resultsContainer;
      // Add statuses
      if (isTaskViewed(element)) return;
      this.addStatuses(statuses, resultsContainer);
    });

    // Create UI elements
    const container = this.createUIElements(elements.results);

    this.isSet = true;
    this.isFetching = false;
    this.newStart += size;

    return { elements: elements.results, container };
  }

  async postViewTask({ uuid, micro_thread_id, session_id }) {
    const url = URL_AGENT_STATUS;
    const params = {
      uuid,
      micro_thread_id,
      session_id,
      status: API_STATUSES.VIEWED,
      time_stamp: getPreviousDayTimestamp(),
    };

    const result = await fetcher({
      url,
      params,
      method: "POST",
    });

    return result;
  }
}
