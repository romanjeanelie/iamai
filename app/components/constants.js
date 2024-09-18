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
const BASE_URL = import.meta.env.VITE_API_HOST || "https://api.asterizk.ai";
export const URL_CONVERSATION_HISTORY = `${BASE_URL}/search/conversation_history`;
export const URL_AGENT_STATUS = `${BASE_URL}/search/agent_status`;
export const URL_DELETE_STATUS = `${BASE_URL}/workflows/tasks`;
