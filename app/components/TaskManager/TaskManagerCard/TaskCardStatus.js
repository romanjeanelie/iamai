import { API_STATUSES } from "../../constants";
import { STATUS_PROGRESS_STATES, TASK_PANELS } from "../taskManagerConstants";
import { TaskCardInput } from "./TaskCardInput";

const testDataSubStatus = [
  "lorem ipsum dolor sit amet consectetur adipiscing elit",
  "lorem ipsum dolor sit amet consectetur adipiscing elit",
  "lorem ipsum dolor sit amet consectetur adipiscing elit",
];

export default class TaskCardStatus {
  constructor({ card }) {
    this.card = card;

    // States
    this.statuses = [];

    // Dom Elements
    this.proSearchContainer = null;
    this.input = null;

    // InitMethods
    this.initProSearch();
  }

  // Update the state
  initProSearch() {
    this.proSearchContainer = this.card.accordion.addNewPanel(TASK_PANELS.PROSEARCH, "/icons/blue-sparkles.png");
  }

  handleInput(status) {
    if (status.type === API_STATUSES.INPUT_REQUIRED && !this.input) {
      this.input = new TaskCardInput({
        taskCard: this.card,
        emitter: this.card.emitter,
      });
    } else if (status.type !== API_STATUSES.INPUT_REQUIRED && this.input) {
      this.input.dispose();
      this.input = null;
    }
  }

  addSubstatusChevron(statusWrapper) {
    const header = statusWrapper.querySelector(".proSearch__status-header");
    const button = document.createElement("button");
    button.className = "proSearch__status-chevron";
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
        <path d="M11 1L6 6L1 0.999999" stroke="#676E7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    header.appendChild(button);
  }

  addSubStatus(statusContainer) {
    // HTML structure to display status
    const maxVisibleStatuses = 2; // Number of statuses to display before showing "+1 more"

    let displayedStatuses = testDataSubStatus
      .slice(0, maxVisibleStatuses)
      .map(
        (status) => `
        <div class="proSearch__substatus">
          <span class="proSearch__substatus-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 18L15.0375 15.0375M16.5 11.25C16.5 14.1495 14.1495 16.5 11.25 16.5C8.35051 16.5 6 14.1495 6 11.25C6 8.35051 8.35051 6 11.25 6C14.1495 6 16.5 8.35051 16.5 11.25Z" stroke="#959FB1" stroke-width="1.5" stroke-linecap="square"/>
            </svg>
          </span>
          <span class="proSearch__substatus-text">${status}</span>
        </div>
      `
      )
      .join("");

    // Add a "+X more" indicator if there are more hidden statuses
    const hiddenStatusCount = testDataSubStatus.length - maxVisibleStatuses;
    if (hiddenStatusCount > 0) {
      displayedStatuses += `
          <div class="proSearch__sub-status more-substatus">
            +${hiddenStatusCount} more
          </div>
        `;
    }

    statusContainer.innerHTML = `
        <h4 class="proSearch__substatus-title"> Searching...</h4>
        <div class="proSearch__substatus-list">
          ${displayedStatuses}
        </div>
      `;
  }

  updatePrecedingStatusesStates(state = null) {
    this.statuses.forEach((status) => {
      status.classList.remove(STATUS_PROGRESS_STATES.PROGRESSING);
      status.classList.add(STATUS_PROGRESS_STATES.ENDED);
    });
  }

  addStatus(status) {
    this.updatePrecedingStatusesStates();

    const statusContainer = document.createElement("div");

    statusContainer.className = `proSearch__status-container ${STATUS_PROGRESS_STATES.PROGRESSING}`;
    statusContainer.innerHTML = `
      <div class="proSearch__status-side">
        <div class="proSearch__status-progress ">
          <div></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1.25 4.5L3.25 6.5L6.75 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        </div>

        <div class="proSearch__status-line"></div>
      </div>
    `;

    const statusWrapper = document.createElement("div");
    statusWrapper.className = "proSearch__status-wrapper";
    statusWrapper.innerHTML = `
      <div class="proSearch__status-header">
        <p class="proSearch__status-description">${status?.description}</p>
      </div>
    `;

    const statusContent = document.createElement("div");
    statusContent.className = "proSearch__status-content";

    statusWrapper.appendChild(statusContent);
    statusContainer.appendChild(statusWrapper);
    this.proSearchContainer.appendChild(statusContainer);

    this.statuses.push(statusContainer);

    this.addSubstatusChevron(statusWrapper);
    this.addSubStatus(statusContent);
    this.handleInput(status);
  }
}
