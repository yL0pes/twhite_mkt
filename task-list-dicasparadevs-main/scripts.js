const inputElement = document.querySelector(".new-task-input");
const addTaskButton = document.querySelector(".new-task-button");
const categoryElement = document.querySelector(".new-task-category");
const tasksContainer = document.querySelector(".tasks-container");

const validateInput = () => inputElement.value.trim().length > 0;

const handleAddTask = () => {
  const inputIsValid = validateInput();

  if (!inputIsValid) {
    return inputElement.classList.add("error");
  }

  const taskItemContainer = document.createElement("div");
  taskItemContainer.classList.add("task-item");

  const taskContent = document.createElement("p");
  taskContent.innerText = inputElement.value;

  taskContent.addEventListener("click", () => handleClick(taskContent));

  const deleteItemContainer = document.createElement("div");
  deleteItemContainer.classList.add("custom-checkbox-container");

  const deleteItemInput = document.createElement("input");
  deleteItemInput.classList.add("custom-checkbox-input");
  deleteItemInput.id = `checkbox-${Date.now()}`;
  deleteItemInput.type = "checkbox";

  const deleteItemLabel = document.createElement("label");
  deleteItemLabel.classList.add("custom-checkbox-label");
  deleteItemLabel.setAttribute("for", deleteItemInput.id);

  deleteItemInput.addEventListener("change", () =>
    handleDeleteClick(taskItemContainer, taskContent)
  );

  deleteItemContainer.appendChild(deleteItemInput);
  deleteItemContainer.appendChild(deleteItemLabel);

  const category = categoryElement.value || "general";
  taskItemContainer.dataset.category = category;

  const categoryLabel = document.createElement("span");
  categoryLabel.classList.add("task-category");
  categoryLabel.innerText = `[${category}] `;

  taskItemContainer.appendChild(categoryLabel);
  taskItemContainer.appendChild(taskContent);
  taskItemContainer.appendChild(deleteItemContainer);

  tasksContainer.appendChild(taskItemContainer);

  inputElement.value = "";

  updateLocalStorage();
};

const handleClick = (taskContent) => {
  const tasks = tasksContainer.childNodes;

  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.querySelector("p").isSameNode(taskContent);

    if (currentTaskIsBeingClicked) {
      task.querySelector("p").classList.toggle("completed");
    }
  }

  updateLocalStorage();
};

const handleDeleteClick = (taskItemContainer, taskContent) => {
  const tasks = tasksContainer.childNodes;

  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.querySelector("p").isSameNode(taskContent);

    if (currentTaskIsBeingClicked) {
      taskItemContainer.remove();
    }
  }

  updateLocalStorage();
};

const handleInputChange = () => {
  const inputIsValid = validateInput();

  if (inputIsValid) {
    return inputElement.classList.remove("error");
  }
};

const updateLocalStorage = () => {
  const tasks = document.querySelectorAll(".task-item");

  const localStorageTasks = [...tasks].map((task) => {
    const content = task.querySelector("p");
    const isCompleted = content.classList.contains("completed");
    const category = task.dataset.category;

    return { description: content.innerText, isCompleted, category };
  });

  localStorage.setItem("tasks", JSON.stringify(localStorageTasks));
};

const refreshTasksUsingLocalStorage = () => {
  const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));

  if (!tasksFromLocalStorage) return;

  for (const task of tasksFromLocalStorage) {
    const taskItemContainer = document.createElement("div");
    taskItemContainer.classList.add("task-item");
    taskItemContainer.dataset.category = task.category;

    const taskContent = document.createElement("p");
    taskContent.innerText = task.description;

    if (task.isCompleted) {
      taskContent.classList.add("completed");
    }

    taskContent.addEventListener("click", () => handleClick(taskContent));

    const deleteItemContainer = document.createElement("div");
    deleteItemContainer.classList.add("custom-checkbox-container");

    const deleteItemInput = document.createElement("input");
    deleteItemInput.classList.add("custom-checkbox-input");
    deleteItemInput.id = `checkbox-${Date.now()}`;
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
    categoryLabel.innerText = `[${task.category}] `;

    taskItemContainer.appendChild(categoryLabel);
    taskItemContainer.appendChild(taskContent);
    taskItemContainer.appendChild(deleteItemContainer);

    tasksContainer.appendChild(taskItemContainer);
  }
};

refreshTasksUsingLocalStorage();

addTaskButton.addEventListener("click", () => handleAddTask());

inputElement.addEventListener("change", () => handleInputChange());
