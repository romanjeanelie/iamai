import { API_STATUSES } from "../constants";

export const STATUS_COLORS = {
  [API_STATUSES.PROGRESSING]: "rgba(149, 159, 177, 0.14)",
  [API_STATUSES.INPUT_REQUIRED]:
    "linear-gradient(70deg, rgba(227, 207, 28, 0.30) -10.29%, rgba(225, 135, 30, 0.30) 105%)",
  [API_STATUSES.ENDED]: "linear-gradient(70deg, rgba(116, 225, 30, 0.30) -10.29%, rgba(28, 204, 227, 0.30) 105%)",
  [API_STATUSES.VIEWED]: "linear-gradient(70deg, rgba(116, 225, 30, 0.30) -10.29%, rgba(28, 204, 227, 0.30) 105%)",
};

export const TASK_PANELS = {
  PROSEARCH: "Pro Search",
  SOURCES: "Sources",
  ANSWER: "Answer",
};

export const STATUS_PROGRESS_STATES = {
  IDLE: "idle",
  PROGRESSING: "progressing",
  ENDED: "ended",
};
