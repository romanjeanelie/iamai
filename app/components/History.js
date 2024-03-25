import { TASK_STATUSES } from "./TaskManager/index.js";
import { AGENT_STATUSES } from "./constants.js";
import fetcher from "../utils/fetcher.js";

const BASE_URL = import.meta.env.VITE_API_HOST || "https://api.asterizk.ai";
const URL_CONVERSATION_HISTORY = `${BASE_URL}/search/conversation_history`;
const URL_AGENT_STATUS = `${BASE_URL}/search/agent_status`;

export default class History {
  constructor({ emitter }) {
    this.emitter = emitter;

    this.elements = null;
    this.isSet = false;
  }

  addStatuses(statuses) {
    statuses.forEach((status) => {
      switch (status.status) {
        case AGENT_STATUSES.STARTED:
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
        case AGENT_STATUSES.PROGRESSING:
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
      }
    });
  }

  getLastStatus(data) {
    const statuses = data.map((obj) => obj.status);

    if (statuses.includes(AGENT_STATUSES.COMPLETED)) {
      return AGENT_STATUSES.COMPLETED;
    } else if (statuses.includes(AGENT_STATUSES.PROGRESSING)) {
      return AGENT_STATUSES.PROGRESSING;
    } else {
      return AGENT_STATUSES.STARTED;
    }
  }

  async getStatusesTask({ micro_thread_id, order = "asc" }) {
    const params = {
      micro_thread_id,
      order,
    };
    const { data, error } = await fetcher({ url: URL_AGENT_STATUS, params });
    const lastStatus = this.getLastStatus(data.results);
    data.lastStatus = lastStatus;
    return data;
  }

  async getAllElements({ uuid, start = 0, size = 3, order = "asc" }) {
    const params = {
      //   uuid: "01240e9b-e666-4b41-9633-12a64ca8d23e_YLeg4G5kNhgQUmYMg5hNDZaGKD82",
      uuid,
      start,
      size,
      order,
    };
    // Get all elements
    const { data, error } = await fetcher({ url: URL_CONVERSATION_HISTORY, params });

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
      const isTaskProgressing =
        element.micro_thread_id !== "" && element.statuses?.lastStatus !== AGENT_STATUSES.COMPLETED;

      if (element.user.length > 0) {
        const userContainer = document.createElement("div");
        userContainer.classList.add("discussion__user");
        userContainer.innerHTML = element.user;
        container.appendChild(userContainer);
        if (isTaskProgressing) userContainer.classList.add("discussion__user--task-created");
      }
      if (element.assistant.length > 0) {
        const AIContainer = document.createElement("div");
        AIContainer.classList.add("discussion__ai");
        AIContainer.innerHTML = element.assistant;
        container.appendChild(AIContainer);
        if (isTaskProgressing) AIContainer.classList.add("discussion__ai--task-created");
      }
    });
    return container;
  }

  async getHistory({ uuid }) {
    // Get elements
    const elements = await this.getAllElements({ uuid });
    const tasksProgressing = elements.results.filter(
      (element) => element.micro_thread_id !== "" && element.statuses?.lastStatus !== AGENT_STATUSES.COMPLETED
    );

    // Add tasks
    tasksProgressing.forEach((task) => {
      const statuses = task.statuses.results;
      this.addStatuses(statuses);
    });

    // Create UI elements
    const container = this.createUIElements(elements.results);

    this.isSet = true;
    return { elements: elements.results, container };
  }

  async postViewTask({
    uuid,
    micro_thread_id,
    session_id,
    task_name,
    status,
    type,
    response_json,
    time_stamp,
    awaiting,
  }) {
    const result = await fetcher({
      url: URL_AGENT_STATUS,
      params: {
        uuid: "Cm15ZC1OlxaWeJ3SQnQJZWneDZP2",
        micro_thread_id: "Cm15ZC1OlxaWeJ3SQnQJZWneDZP2",
        session_id: "dfsdf",
        task_name: "What is the stock price of Reliance?",
        status: "user_viewed",
        type: "",
        response_json: { text: "" },
        time_stamp: "2024-03-06T00:21:00",
        awaiting: false,
      },
      method: "POST",
    });
  }
}
