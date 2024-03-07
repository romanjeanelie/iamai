const STATUSES = {
  IN_PROGRESS: "inProgress",
  INPUT_REQUIRED: "inputRequired",
  COMPLETED: "completed",
};

const defaultValues = {
  [STATUSES.IN_PROGRESS]: {
    label: "In Progress",
    title: "searching",
    description: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
  },
  [STATUSES.INPUT_REQUIRED]: {
    label: "Input required",
    title: "question",
    description: "Flight for 18th Mar are all fully booked. Is there any other dates you would like to try for?",
  },
  [STATUSES.COMPLETED]: {
    label: "View results",
    title: "",
    description: "",
  },
};

export default class TaskManager {
  constructor({ pageEl, gui, emitter }) {
    // DOM Elements
    this.pageEl = pageEl;
    this.container = this.pageEl.querySelector(".task-manager__container");

    // Debug btns
    this.debugContainer = this.pageEl.querySelector(".task-manager__debug");

    this.debug = import.meta.env.VITE_DEBUG === "true";
    this.gui = gui;

    if (this.debug) {
      this.debugTasks = [];

      const debugTask = {
        name: `Task 1`,
        key: 1,
      };

      const taskNameController = this.gui.add(debugTask, "name").onChange((value) => {
        debugTask.name = value;
      });

      this.gui.add(
        {
          addTask: (e) => {
            const task = {
              ...debugTask,
              status: { type: null, title: "", description: "" },
            };
            this.addDebugTask(task);
            this.createTask(task);
            this.debugTasks.push(task);

            debugTask.name = `Task ${this.debugTasks.length + 1}`;
            debugTask.key = this.debugTasks.length + 1;
            taskNameController.setValue(debugTask.name);
          },
        },
        "addTask"
      );

      //   this.debugTasks.forEach((task) => {
      //     this.addDebugTask(task);
      //   });
    }
  }

  addDebugTask(task) {
    const copyTask = { ...task };
    const folder = this.gui.addFolder(copyTask.name);
    folder.open();
    folder.add(copyTask.status, "type", STATUSES).onChange((value) => {
      copyTask.status = { type: value, ...defaultValues[value] };
      titleController.setValue(copyTask.status.title);
      descriptionController.setValue(copyTask.status.description);
      this.onStatusUpdate(copyTask.key, copyTask.status);
    });

    const titleController = folder.add(copyTask.status, "title").onChange((value) => {
      copyTask.status.title = value;
    });

    const descriptionController = folder.add(copyTask.status, "description").onChange((value) => {
      copyTask.status.description = value;
    });
    folder.add(
      {
        updateStatus: () => {
          this.onStatusUpdate(copyTask.key, copyTask.status);
        },
      },
      "updateStatus"
    );
  }

  createTask(task) {
    console.log("task created", task);
  }

  onStatusUpdate(taskKey, status) {
    console.log("task - ", taskKey, "status updated", status);
  }
}
