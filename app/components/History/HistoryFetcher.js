import fetcher from "../../utils/fetcher.js";
import { URL_CONVERSATION_HISTORY } from "../constants.js";

export default class HistoryFetcher {
  constructor({ emitter }) {
    this.emitter = emitter;

    this.defaultSize = 10;
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
      mode: "cors",
    };

    // Get all elements
    const { data } = await fetcher({
      url: URL_CONVERSATION_HISTORY,
      params,
      idToken: await user?.user?.getIdToken(true),
    });

    return data;
  }

  async getHistory({ uuid, user, size = this.defaultSize }) {
    this.isFetching = true;
    let filteredData = [];
    let remainingSize = size;

    while (filteredData.length < size) {
      const data = await this.getAllElements({ uuid, user, size: remainingSize, start: this.newStart });

      if (!data.results.length) break; // Stop if no more data is available

      const validElements = data.results.filter((el) => el.micro_thread_id === "");
      console.log(validElements);
      filteredData = [...filteredData, ...validElements];

      remainingSize = size - filteredData.length;
      this.newStart += data.results.length; // Update start for next fetch
    }

    this.isSet = true;
    this.isFetching = false;

    return filteredData; // Ensure we only return `size` elements
  }
}
