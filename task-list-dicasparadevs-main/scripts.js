const inputElement = document.querySelector(".new-task-input");
const addTaskButton = document.querySelector(".new-task-button");
const categoryElement = document.querySelector(".new-task-category");
const tasksContainer = document.querySelector(".tasks-container");

const socket = io('http://localhost:3000');

const fetchTasks = async () => {
  try {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();
    tasks.forEach(task => {
      addTaskToDOM(task.id, task.category_id, task.task_description);
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

const addTaskToDOM = (id, category_id, task_description) => {
  const taskItemContainer = document.createElement("div");
  taskItemContainer.classList.add("task-item");
  taskItemContainer.dataset.id = id;
  taskItemContainer.dataset.category = category_id;

  const taskContent = document.createElement("p");
  taskContent.innerText = task_description;

  taskContent.addEventListener("click", () => handleClick(taskContent));

  const deleteItemContainer = document.createElement("div");
  deleteItemContainer.classList.add("custom-checkbox-container");

  const deleteItemInput = document.createElement("input");
  deleteItemInput.classList.add("custom-checkbox-input");
  deleteItemInput.id = `checkbox-${id}`;
  deleteItemInput.type = "checkbox";

  const deleteItemLabel = document.createElement("label");
  deleteItemLabel.classList.add("custom-checkbox-label");
  deleteItemLabel.setAttribute("for", deleteItemInput.id);

  deleteItemInput.addEventListener("change", () =>
    handleDeleteClick(taskItemContainer, taskContent)
  );

  deleteItemContainer.appendChild(deleteItemInput);
  deleteItemContainer.appendChild(deleteItemLabel);

  const categoryLabel = document.createElement("span");
  categoryLabel.classList.add("task-category");
  categoryLabel.innerText = `[${category_id}] `;

  taskItemContainer.appendChild(categoryLabel);
  taskItemContainer.appendChild(taskContent);
  taskItemContainer.appendChild(deleteItemContainer);

  const categoryContainer = document.getElementById(`${category_id.toLowerCase()}-tasks`);
  categoryContainer.appendChild(taskItemContainer);
};

const validateInput = () => inputElement.value.trim().length > 0;

const handleAddTask = async () => {
  const inputIsValid = validateInput();

  if (!inputIsValid) {
    return inputElement.classList.add("error");
  }

  const category_id = categoryElement.value;
  const task_description = inputElement.value;

  try {
    const response = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ category_id, task_description })
    });

    if (response.ok) {
      const newTask = await response.json();
      addTaskToDOM(newTask.id, category_id, task_description);
    }
  } catch (error) {
    console.error('Error adding task:', error);
  }

  inputElement.value = "";
};

const handleClick = (taskContent) => {
  const tasks = document.querySelectorAll(".task-item");

  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.querySelector("p").isSameNode(taskContent);

    if (currentTaskIsBeingClicked) {
      task.querySelector("p").classList.toggle("completed");
    }
  }
};

const handleDeleteClick = async (taskItemContainer, taskContent) => {
  const taskId = taskItemContainer.dataset.id;

  try {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      taskItemContainer.remove();
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

const handleInputChange = () => {
  const inputIsValid = validateInput();

  if (inputIsValid) {
    return inputElement.classList.remove("error");
  }
};

socket.on('newTask', (task) => {
  addTaskToDOM(task.id, task.category_id, task.task_description);
});

socket.on('deleteTask', (id) => {
  const taskItemContainer = document.querySelector(`.task-item[data-id='${id}']`);
  if (taskItemContainer) {
    taskItemContainer.remove();
  }
});

fetchTasks();

addTaskButton.addEventListener("click", handleAddTask);

inputElement.addEventListener("input", handleInputChange);
