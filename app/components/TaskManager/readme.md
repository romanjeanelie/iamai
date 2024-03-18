# Task Manager

**In the Chat class:**

- Add a task in a queue :

```jsx
const task = {	key: {uuid}, 
				name: {name-of-the-task}, 
				status: {
					type, TASK_STATUSES.IN_PROGRESS,
					label:"searching",
					title: "searching", 
					description: "searching for flight tickets"
				}
			}

const textAI = "Certainly! I'm currently searching for the best flight options to Bali for you"

await this.createTask(task, textAI)
```

- Update a task status :

```jsx
this.callbacks.emitter.emit("taskManager:updateStatus", task.key, 
					status: {
						type, TASK_STATUSES.INPUT_REQUIRED,
						label:"Enter the city name",
						title: "question", 
						description: "what time do you want to leave ?",
					},
					container || null, 
					{workflowID: 1234}
				);
```

- Complete the task :

```jsx
const taskAnswer: "You have a flight tomorrow at 2pm booked."

this.callbacks.emitter.emit("taskManager:updateStatus", task.key, 
					status: {
						type, TASK_STATUSES.COMPLETED,
						title: "results :", 
						description: taskAnswer
				});
		
```