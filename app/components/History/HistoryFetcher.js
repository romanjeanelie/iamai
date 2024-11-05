import fetcher from "../../utils/fetcher.js";
import { URL_CONVERSATION_HISTORY } from "../constants.js";

export function getPreviousDayTimestamp() {
  const currentDate = new Date();
  const previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - 1);
  return previousDate.toISOString();
}

export default class HistoryFetcher {
  constructor({ emitter }) {
    this.emitter = emitter;

    this.elements = null;
    this.isSet = false;
    this.isFetching = false;
    this.newStart = 0;
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

    return data;
  }

  async getHistory({ uuid, user, size = 3 }) {
    this.isFetching = true;
    // Get elements
    const data = await this.getAllElements({ uuid, user, size, start: this.newStart });
    // Reverse the order of elements

    data.results.reverse();

    this.isSet = true;
    this.isFetching = false;
    this.newStart += size;

    return data.results;
  }
}
