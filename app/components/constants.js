export const API_STATUSES = {
  STARTED: "agent_started",
  PROGRESSING: "agent_progressing",
  ENDED: "agent_ended",
  ANSWERED: "agent_answered",
  VIEWED: "user_viewed",
  CANCELLED: "agent_cancelled",
  SOURCES: "sources",
  INPUT_REQUIRED: "agent_input_required",
  AGENT_INTERMEDIATE_ANSWER: "agent_intermediate_answer",
};
export const TASK_LABELS = {
  [API_STATUSES.STARTED]: "Agent Started",
  [API_STATUSES.PROGRESSING]: "Agent Progressing",
  [API_STATUSES.ENDED]: "Agent Ended",
  [API_STATUSES.ANSWERED]: "Agent Answered",
  [API_STATUSES.VIEWED]: "User Viewed",
  [API_STATUSES.CANCELLED]: "Agent Cancelled",
  [API_STATUSES.SOURCES]: "Sources",
  [API_STATUSES.INPUT_REQUIRED]: "Agent Input Required",
  [API_STATUSES.AGENT_INTERMEDIATE_ANSWER]: "Agent Intermediate Answer",
};

const BASE_URL = import.meta.env.VITE_API_HOST || "https://api.asterizk.ai";
export const URL_CONVERSATION_HISTORY = `${BASE_URL}/search/conversation_history`;
export const URL_AGENT_STATUS = `${BASE_URL}/search/agent_status`;
export const URL_DELETE_STATUS = `${BASE_URL}/workflows/tasks`;
