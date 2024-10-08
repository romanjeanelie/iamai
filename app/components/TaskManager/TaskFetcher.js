import fetcher from "../../utils/fetcher";
import { API_STATUSES, URL_AGENT_STATUS, URL_CONVERSATION_HISTORY, URL_TASK_HISTORY } from "../constants";
import { store } from "../store";

const isTaskCancelled = (el) => el.statuses?.lastStatus === API_STATUSES.CANCELLED;

export default class TaskFetcher {
  constructor() {
    this.getTasks();
  }

  // async getStatusesTask({ micro_thread_id, idToken, start = 0, size = 50, order = "asc" }) {
  //   const params = {
  //     micro_thread_id,
  //     start,
  //     size,
  //     order,
  //   };
  //   const { data } = await fetcher({ url: URL_AGENT_STATUS, params, idToken: idToken });
  //   return data;
  // }

  async getTasks(start = 0, size = 10, order = "desc") {
    const user = store.getState().chatId;
    console.log(user);

    // const params = {
    //   uuid,
    //   start,
    //   size,
    //   order,
    // };

    // Get all elements
    // const { data } = await fetcher({
    //   url: URL_TASK_HISTORY,
    //   params,
    //   idToken: await this.user?.user?.getIdToken(true),
    // });

    // // Remove duplicate tasks
    // const uniqueMicroThreadId = [];
    // const removedDuplicate = data?.results.filter((item) => {
    //   if (item.micro_thread_id === "") return true;
    //   if (!uniqueMicroThreadId.includes(item.micro_thread_id)) {
    //     uniqueMicroThreadId.push(item.micro_thread_id);
    //     return true;
    //   }
    //   return false;
    // });
    // data.results = removedDuplicate;

    // // Get statuses tasks
    // for (const result of data?.results || []) {
    //   if (result.micro_thread_id !== "") {
    //     const statuses = await this.getStatusesTask({
    //       micro_thread_id: result.micro_thread_id,
    //       idToken: await this.user.user.getIdToken(true),
    //     });
    //     result.statuses = statuses;
    //   }
    // }

    // // Remove tasks with status CANCELLED
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
