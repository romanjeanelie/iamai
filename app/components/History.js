import fetcher from "../utils/fetcher.js";
import getMarked from "../utils/getMarked.js";
import DiscussionMedia from "./DiscussionMedia.js";
import { API_STATUSES, URL_AGENT_STATUS, URL_CONVERSATION_HISTORY } from "./constants.js";

const isEmpty = (obj) => Object.keys(obj).length === 0;
// const md = getRemarkable();
const md = getMarked();

const isTask = (el) => el.micro_thread_id !== "";
const isTaskViewed = (el) => isTask(el) && el.statuses?.lastStatus === API_STATUSES.VIEWED;
const isTaskCancelled = (el) => isTask(el) && el.statuses?.lastStatus === API_STATUSES.CANCELLED;
export function getPreviousDayTimestamp() {
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
    const resultsContainer = document.createElement("div");

    statuses.results.forEach((status) => {
      if (status.type === "ui") {
        const results = status.response_json;
        const uiResults = this.getTaskResultUI(results);
        resultsContainer.appendChild(uiResults);
      }
      if (status.type === "sources") {
        const sources = status.response_json.sources;
        const media = new DiscussionMedia({ container: resultsContainer, emitter: this.emitter });
        media.addSources(sources);
      }
      if (status.status === API_STATUSES.ANSWERED) {
        const answerContainer = document.createElement("div");
        answerContainer.innerHTML = md.parse(status.response_json.text) || "";
        resultsContainer.append(answerContainer);
      }
    });

    return resultsContainer;
  }

  addTasksUI(statuses, resultsContainer) {
    // Initialize the task
    const firstStatus = statuses.results.find((result) => result.status === "agent_started");
    const initialTask = this.createInitialTask(firstStatus);
    const textAI = firstStatus.response_json.text;

    // Emit the task creation
    this.emitter.emit("taskManager:createTask", initialTask, textAI);

    // put the user_viewed or agent_ended status at the end of the statuses array
    const userViewedStatus = statuses.results.find((result) => result.status === "user_viewed");
    const agentEndedStatus = statuses.results.find((result) => result.status === "agent_ended");
    if (userViewedStatus) {
      statuses.results = statuses.results.filter((result) => result.status !== "user_viewed");
      statuses.results.push(userViewedStatus);
    } else if (agentEndedStatus) {
      statuses.results = statuses.results.filter((result) => result.status !== "agent_ended");
      statuses.results.push(agentEndedStatus);
    }

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

  getTaskLastStatus(data) {
    const statuses = data.map((obj) => obj.status);
    if (statuses.includes(API_STATUSES.CANCELLED)) {
      return API_STATUSES.CANCELLED;
    } else if (statuses.includes(API_STATUSES.VIEWED)) {
      return API_STATUSES.VIEWED;
    } else if (statuses.includes(API_STATUSES.ENDED)) {
      return API_STATUSES.ENDED;
    } else if (statuses.includes(API_STATUSES.PROGRESSING)) {
      return API_STATUSES.PROGRESSING;
    } else {
      return API_STATUSES.STARTED;
    }
  }

  async getStatusesTask({ micro_thread_id, idToken, start = 0, size = 50, order = "asc" }) {
    const params = {
      micro_thread_id,
      start,
      size,
      order,
    };
    const { data, error } = await fetcher({ url: URL_AGENT_STATUS, params, idToken: idToken });
    const lastStatus = this.getTaskLastStatus(data.results);

    data.lastStatus = lastStatus;
    return data;
  }

  async getAllElements({ uuid, user, start = 0, size = 10, order = "desc" }) {
    const params = {
      uuid,
      start,
      size,
      order,
    };

    // Get all elements
    const { data } = await fetcher({
      url: URL_CONVERSATION_HISTORY,
      params,
      idToken: await user?.user?.getIdToken(true),
    });

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
        const statuses = await this.getStatusesTask({
          micro_thread_id: result.micro_thread_id,
          idToken: await user.user.getIdToken(true),
        });
        result.statuses = statuses;
      }
    }

    // Remove tasks with status CANCELLED
    data.results = data.results.filter((item) => {
      if (isTaskCancelled(item)) {
        return false;
      } else {
        return true;
      }
    });

    return data;
  }

  createUIElements(elements) {
    const container = document.createElement("div");

    elements.forEach((element) => {
      if (element.user.length > 0) {
        const userContainer = document.createElement("div");
        userContainer.classList.add("discussion__user");
        var userContainerspan = document.createElement("span");
        userContainerspan.classList.add("discussion__userspan");
        // const userTextMarkdowned = md.renderInline(element.user);
        userContainerspan.innerHTML = element.user;
        userContainer.appendChild(userContainerspan);
        container.appendChild(userContainer);

        // 1st way to figure out if an img comes from the video input - the length
        // const isImgsComingFromVideo = element.images.user_images?.length > 40000;

        // 2nd way to figure out if an img comes from the video input - the presence of 'data:image/png;base64,'
        const isImgsComingFromVideo = element.images.user_images?.includes("data:image/png;base64,");

        if (!isEmpty(element.images) && !isImgsComingFromVideo) {
          const media = new DiscussionMedia({
            container: userContainer,
            emitter: this.emitter,
          });
          if (element.images.user_images) media?.addUserImages(JSON.parse(element.images.user_images));
          container.appendChild(userContainer);
        }

        // >>>>> the element below will need to be removed eventually <<<<<
        if (isTask(element) && !isTaskViewed(element)) {
          userContainer.setAttribute("taskKey", element.micro_thread_id);
          userContainer.classList.add("discussion__user--task-created");
        }
      }

      if (element.assistant.length > 0) {
        const AIContainer = document.createElement("div");
        AIContainer.classList.add("discussion__ai");

        // Need to stringify
        const string = JSON.stringify(element.assistant);

        // Remove leading and trailing quotes
        const textWithoutQuotes = string.slice(1, -1);

        // Replace \n with <br>
        const assistantText = textWithoutQuotes.replace(/\\n/g, "<br>");

        // Render the markdown
        const assistantTextMardowned = md.parse(assistantText);

        AIContainer.innerHTML = assistantTextMardowned;
        container.appendChild(AIContainer);
        if (isTask(element)) {
          AIContainer.setAttribute("taskKey", element.micro_thread_id);
        }
        if (!isEmpty(element.sources) || !isEmpty(element.images)) {
          const media = new DiscussionMedia({
            container: AIContainer,
            emitter: this.emitter,
          });
          if (element.images.images) {
            media.initImages();
            media?.addImages(JSON.parse(element.images.images).slice(0, 8));
          }
          if (element.sources.sources) {
            media?.addSources(JSON.parse(element.sources.sources));
          }

          container.appendChild(AIContainer);
        }
      }
    });
    return container;
  }

  async getHistory({ uuid, user, size = 3 }) {
    this.isFetching = true;
    // Get elements
    const elements = await this.getAllElements({ uuid, user, size: 1, start: this.newStart });
    // Reverse the order of elements

    elements.results.reverse();

    elements.results.forEach((element) => {
      if (!isTask(element)) return;
      const statuses = element.statuses;
      // Get results container
      const resultsContainer = this.getResultsUI(statuses);
      element.resultsContainer = resultsContainer;
      this.addTasksUI(statuses, resultsContainer);
    });

    // Create UI elements
    const container = this.createUIElements(elements.results);
    container.classList.add("history__container");

    this.isSet = true;
    this.isFetching = false;
    this.newStart += size;

    return { elements: elements.results, container };
  }
}
