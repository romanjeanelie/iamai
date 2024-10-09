import fetcher from "../utils/fetcher.js";
import getMarked from "../utils/getMarked.js";
import DiscussionMedia from "./DiscussionMedia.js";
import { URL_CONVERSATION_HISTORY } from "./constants.js";

const isEmpty = (obj) => Object.keys(obj).length === 0;
// const md = getRemarkable();
const md = getMarked();

export function getPreviousDayTimestamp() {
  const currentDate = new Date();
  const previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - 1);
  return previousDate.toISOString();
}

export default class History {
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
    const elements = await this.getAllElements({ uuid, user, size, start: this.newStart });
    // Reverse the order of elements

    elements.results.reverse();

    // Create UI elements
    const container = this.createUIElements(elements.results);
    container.classList.add("history__container");

    this.isSet = true;
    this.isFetching = false;
    this.newStart += size;

    return { elements: elements.results, container };
  }
}
