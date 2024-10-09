import fetcher from "../../utils/fetcher";
import getMarked from "../../utils/getMarked";
import { API_STATUSES, URL_AGENT_STATUS, URL_TASK_HISTORY } from "../constants";
import { store } from "../store";
import UIComponent from "../UI/UIComponent";
import { getTaskUI } from "./utils/getTaskUI";

const md = getMarked();
const isTaskCancelled = (el) => el.statuses?.lastStatus === API_STATUSES.CANCELLED;

export default class TaskFetcher {
  constructor(emitter) {
    this.emitter = emitter;
    this.getTasks();
  }

  addTasksUI(statuses, resultsContainer) {
    // Initialize the task
    const firstStatus = statuses.results.find((result) => result.status === "agent_started");
    const initialTask = this.createInitialTask(firstStatus);
    const textAI = firstStatus.response_json.text;

    // Emit the task creation
    this.emitter.emit("taskManager:createTask", initialTask, textAI);

    // put the user_viewed or agent_ended status at the end of the statuses array
    statuses.results.sort((a, b) => {
      const statusOrder = {
        user_viewed: 2, // Last
        agent_ended: 1, // Second last
      };

      // Assign a default value of 0 for any other status
      const orderA = statusOrder[a.status] || 0;
      const orderB = statusOrder[b.status] || 0;

      // Sort in ascending order, meaning the higher the value, the further back it goes
      return orderA - orderB;
    });

    statuses.results.forEach((result) => {
      this.updateTaskStatus(result, initialTask, resultsContainer, statuses);
    });
  }

  createInitialTask(firstStatus) {
    return {
      key: firstStatus.micro_thread_id,
      name: firstStatus.task_name,
      createdAt: firstStatus.time_stamp,
      status: {
        type: API_STATUSES.PROGRESSING,
        title: "Planning",
        description: "Planning your tasks.",
        label: "In Progress",
      },
    };
  }

  updateTaskStatus(status, initialTask, resultsContainer, statuses = null) {
    switch (status.status) {
      case API_STATUSES.PROGRESSING:
        this.handleProgressingStatus(initialTask, status);
        break;

      case API_STATUSES.ENDED:
        this.handleEndedStatus(initialTask, status, resultsContainer);
        break;

      case API_STATUSES.VIEWED:
        const agentAnsweredResult = statuses?.results.find((result) => result.status === "agent_answered");
        this.handleViewedStatus(initialTask, agentAnsweredResult, resultsContainer);
        break;
    }
  }

  handleEndedStatus(initialTask, status, resultsContainer) {
    const taskEnded = {
      ...initialTask,
      status: {
        type: API_STATUSES.ENDED,
        title: "Completed",
        description: status.response_json.text,
        label: "View results",
      },
    };

    this.emitter.emit("taskManager:updateStatus", taskEnded.key, taskEnded.status, resultsContainer);
  }

  handleViewedStatus(initialTask, status, resultsContainer) {
    const taskViewed = {
      ...initialTask,
      status: {
        type: API_STATUSES.VIEWED,
        title: "Viewed",
        description: status?.response_json.text || "No agent response.",
        label: "View results",
      },
    };

    this.emitter.emit("taskManager:updateStatus", taskViewed.key, taskViewed.status, resultsContainer);
  }

  handleProgressingStatus(initialTask, status) {
    if (status?.awaiting) {
      const taskname = status.task_name;
      const task = {
        ...initialTask,
        workflowID: status.session_id,
        status: {
          type: API_STATUSES.INPUT_REQUIRED,
          label: "Input Required",
          title: taskname,
          description: status.response_json.text,
        },
      };
      this.emitter.emit("taskManager:updateStatus", task.key, task.status, null, task.workflowID);
    } else {
      let task;
      switch (status?.type) {
        case API_STATUSES.SOURCES:
          task = {
            ...initialTask,
            status: {
              type: API_STATUSES.PROGRESSING,
              title: "SOURCES",
              description: status.response_json.sources,
              label: "In Progress",
            },
          };
          break;

        case API_STATUSES.AGENT_INTERMEDIATE_ANSWER:
          task = {
            ...initialTask,
            status: {
              type: API_STATUSES.AGENT_INTERMEDIATE_ANSWER,
              title: "AGENT INTERMEDIATE ANSWER",
              description: status.response_json.agent_intermediate_answer,
              label: "In Progress",
            },
          };
          break;

        default:
          if (status?.response_json.domain !== "Code") {
            task = {
              ...initialTask,
              status: {
                type: API_STATUSES.PROGRESSING,
                title: status.response_json.text.split(" ")[0],
                description: status.response_json.text,
                label: "In Progress",
              },
            };
          }
          break;
      }
      if (task) this.emitter.emit("taskManager:updateStatus", task.key, task.status);
    }
  }

  async getStatusesTask({ micro_thread_id, idToken, start = 0, size = 50, order = "asc" }) {
    const params = {
      micro_thread_id,
      start,
      size,
      order,
    };
    const { data } = await fetcher({ url: URL_AGENT_STATUS, params, idToken: idToken });
    return data;
  }

  getResultsUI(statuses) {
    let result = new UIComponent();

    statuses.results.forEach((status) => {
      if (status.type === "ui") {
        const results = status.response_json;
        const uiResults = getTaskUI(results, this.emitter); // Call the function that returns UI for the task

        if (uiResults.isClass) {
          result = uiResults;
        } else {
          result = document.createElement("div");
          result.appendChild(uiResults); // Ensure it's a DOM element or append accordingly
        }
      }

      // if (status.type === "sources") {
      //   const sources = status.response_json.sources;
      //   const media = new DiscussionMedia({ container: result.getElement(), emitter: this.emitter });
      //   media.addSources(sources);
      // }

      if (status.status === API_STATUSES.ANSWERED) {
        const answerContainer = document.createElement("div");
        answerContainer.innerHTML = md.parse(status.response_json.text) || "";

        if (typeof result == HTMLDivElement) {
          result.append(answerContainer);
        } else if (result?.isClass) {
          // if result is not a dom Element but a Class instance (from UI components)
          result.addAIText(md.parse(status.response_json.text) || "");
        } else {
          console.log("No result found");
        }
      }
    });

    return result;
  }

  async getTasks(start = 0, size = 10, order = "desc") {
    const uuid = store.getState().chatId;
    const idToken = await store.getState().user.user.getIdToken(true);

    const params = {
      uuid,
      start,
      size,
      order,
    };

    // Get all elements
    const { data } = await fetcher({
      url: URL_TASK_HISTORY,
      params,
      idToken,
    });

    const tasks = data.results || [];
    tasks.forEach(async (task) => {
      // add the statuses to the task
      const statuses = await this.getStatusesTask({
        micro_thread_id: task.micro_thread_id,
        idToken: idToken,
      });
      task.statuses = statuses;

      // add the result ui to the task
      const result = this.getResultsUI(task.statuses);
      task.resultsContainer = result;

      this.addTasksUI(statuses, result);
    });

    // Remove tasks with status CANCELLED
    // data.results = data.results.filter((item) => {
    //   if (isTaskCancelled(item)) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // });

    // return data;
  }
}
