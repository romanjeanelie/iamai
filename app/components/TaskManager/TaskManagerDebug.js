import { API_STATUSES } from "../constants";

const defaultValues = {
  [API_STATUSES.PROGRESSING]: {
    label: "In progress",
    title: "searching",
    description: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
  },
  [API_STATUSES.INPUT_REQUIRED]: {
    label: "Input required",
    title: "question",
    description: "Flight for 18th Mar are all fully booked. Is there any other dates you would like to try for?",
  },
  [API_STATUSES.ENDED]: {
    label: "View results",
    description: "Here's your flights to Bali!",
  },
  [API_STATUSES.VIEWED]: {
    label: "View results",
    description: "Here's your flights to Bali!",
  },
};

export default class TaskManagerDebug {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.gui = taskManager.gui;
    this.emitter = taskManager.emitter;
    this.debugTask = {
      name: `Task ${this.taskManager.tasks.length + 1}`,
      key: this.taskManager.tasks.length + 1,
      createdAt: "2024-09-23T17:45:35.000Z",
    };

    this.taskNameController = this.gui.add(this.debugTask, "name").onChange((value) => {
      this.debugTask.name = value;
    });

    this.gui.add(
      {
        addTask: () => this.addDebugTask(),
      },
      "addTask"
    );

    // Adding button to increment the creation date by one day
    this.gui.add(
      {
        incrementDate: () => this.incrementTaskDate(),
      },
      "incrementDate"
    );
  }

  // Method to increment the date of the task by one day
  incrementTaskDate() {
    const currentDate = new Date(this.debugTask.createdAt);
    currentDate.setDate(currentDate.getDate() + 1); // Increment the day by 1
    this.debugTask.createdAt = currentDate.toISOString(); // Update the task date
  }

  addDebugTask(task = null) {
    if (!task) {
      if (this.taskManager.tasks.length === 2) {
        this.debugTask.createdAt = "2024-09-24T17:45:35.000Z";
      }

      task = {
        ...this.debugTask,
        status: { type: API_STATUSES.PROGRESSING, ...defaultValues[API_STATUSES.PROGRESSING] },
      };
    }

    const folder = this.gui.addFolder(task.name);
    folder.open();

    folder.add(task.status, "type", API_STATUSES).onChange((value) => {
      const status = { type: value, ...defaultValues[value] };
      titleController.setValue(task.status.title);
      descriptionController.setValue(task.status.description);

      // Update the status of the task UI
      if (value === API_STATUSES.ENDED) {
        const container = document.createElement("div");
        container.innerHTML = "Here's your flights to Bamako!";
        this.emitter.emit("taskManager:updateStatus", task.key, status, container);
      } else if (value === API_STATUSES.INPUT_REQUIRED) {
        const workflowID = "1234";
        this.emitter.emit("taskManager:updateStatus", task.key, status, null, workflowID);
      } else {
        this.emitter.emit("taskManager:updateStatus", task.key, status);
      }
    });

    // Generate the new folders in the gui for the new task
    const titleController = folder
      .add(task.status, "title")
      .onChange((value) => {
        task.status.title = value;
      })
      .name("status title");

    const descriptionController = folder
      .add(task.status, "description")
      .onChange((value) => {
        task.status.description = value;
      })
      .name("status desc");

    folder.add(
      {
        updateStatus: () => {
          this.emitter.emit("taskManager:updateStatus", task.key, task.status);
        },
      },
      "updateStatus"
    );

    folder.add(
      {
        deleteTask: () => {
          this.emitter.emit("taskManager:deleteTask", task.key);
          this.debugTask.name = `Task ${this.taskManager.tasks.length + 1}`;
          this.debugTask.key = this.taskManager.tasks.length + 1;
          this.taskNameController.setValue(this.debugTask.name);
          this.gui.removeFolder(folder);
        },
      },
      "deleteTask"
    );

    this.emitter.emit("taskManager:createTask", task, "Debug task added");

    this.debugTask.name = `Task ${this.taskManager.tasks.length + 1}`;
    this.debugTask.key = this.taskManager.tasks.length + 1;
    this.taskNameController.setValue(this.debugTask.name);
  }

  initializeDebugTasks() {
    for (let i = 0; i < 3; i++) {
      const task = {
        name: `Task ${this.taskManager.tasks.length + 1}`,
        key: this.taskManager.tasks.length + 1,
        status: { type: API_STATUSES.PROGRESSING, ...defaultValues[API_STATUSES.PROGRESSING] },
      };
      this.addDebugTask(task);
    }

    this.taskManager.tasks.forEach((task) => {
      this.addDebugTask(task);
    });
  }
}
