document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel loaded');
    document.querySelector('.profile-icon').addEventListener('mouseover', function() {
        document.querySelector('.profile-options').classList.remove('d-none');
    });
    document.querySelector('.profile-icon').addEventListener('mouseout', function() {
        document.querySelector('.profile-options').classList.add('d-none');
    });

    document.querySelectorAll('.add-task-btn').forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-category');
            document.getElementById('saveTaskBtn').setAttribute('data-category', categoryId);
            $('#addTaskModal').modal('show');
        });
    });

    // Load tasks from localStorage on page load
    const categories = ['acoes-boards', 'marketing-boards', 'rh-boards', 'loja-boards'];
    categories.forEach(categoryId => {
        console.log(`Loading tasks for category: ${categoryId}`);
        const tasks = JSON.parse(localStorage.getItem(categoryId)) || [];
        const boardElement = document.getElementById(categoryId);
        tasks.forEach(taskDescription => {
            if (!boardElement.querySelector(`.list-group-item:contains("${taskDescription}")`)) {
                console.log(`Adding task: ${taskDescription}`);
                const taskItem = document.createElement('div');
                taskItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                taskItem.innerHTML = `
                    ${taskDescription}
                    <button class="noselect"><span class="text">Delete</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button>
                `;
                boardElement.appendChild(taskItem);

                taskItem.querySelector('.noselect').addEventListener('click', function() {
                    console.log(`Removing task: ${taskDescription}`);
                    taskItem.remove();
                    removeTaskFromLocalStorage(categoryId, taskDescription);
                });
            }
        });
    });
});

document.getElementById('saveTaskBtn').addEventListener('click', function() {
    const categoryId = this.getAttribute('data-category');
    const taskDescription = document.getElementById('taskDescription').value;
    if (taskDescription) {
        console.log(`Adding task: ${taskDescription} to category: ${categoryId}`);
        const taskItem = document.createElement('div');
        taskItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        taskItem.innerHTML = `
            ${taskDescription}
            <button class="noselect"><span class="text">Delete</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button>
        `;
        document.getElementById(categoryId).prepend(taskItem);
        $('#addTaskModal').modal('hide');

        taskItem.querySelector('.noselect').addEventListener('click', function() {
            console.log(`Removing task: ${taskDescription} from category: ${categoryId}`);
            taskItem.remove();
            removeTaskFromLocalStorage(categoryId, taskDescription);
        });

        // Update index.html
        updateIndexHtml(categoryId, taskDescription);
        saveTaskToLocalStorage(categoryId, taskDescription);
    }
});

function updateIndexHtml(categoryId, taskDescription) {
    console.log(`Updating index.html with task: ${taskDescription} for category: ${categoryId}`);
    const categoryMap = {
        'acoes-boards': 'acoes-card',
        'marketing-boards': 'marketing-card',
        'rh-boards': 'rh-card',
        'loja-boards': 'loja-card'
    };
    const cardId = categoryMap[categoryId];
    const cardElement = window.opener ? window.opener.document.getElementById(cardId) : null;
    if (cardElement) {
        const taskElement = document.createElement('div');
        taskElement.className = 'list-group-item d-flex justify-content-between align-items-center';
        taskElement.innerHTML = `
            ${taskDescription}
            <button class="noselect"><span class="text">Delete</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button>
        `;
        cardElement.querySelector('.card2').appendChild(taskElement);

        taskElement.querySelector('.noselect').addEventListener('click', function() {
            console.log(`Removing task: ${taskDescription} from index.html category: ${cardId}`);
            taskElement.remove();
            removeTaskFromLocalStorage(cardId, taskDescription);
        });
    } else {
        console.error(`Unable to find card element for category: ${categoryId}`);
    }
}

function saveTaskToLocalStorage(categoryId, taskDescription) {
    console.log(`Saving task: ${taskDescription} to localStorage for category: ${categoryId}`);
    const tasks = JSON.parse(localStorage.getItem(categoryId)) || [];
    tasks.push(taskDescription);
    localStorage.setItem(categoryId, JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(categoryId, taskDescription) {
    console.log(`Removing task: ${taskDescription} from localStorage for category: ${categoryId}`);
    let tasks = JSON.parse(localStorage.getItem(categoryId)) || [];
    tasks = tasks.filter(task => task !== taskDescription);
    localStorage.setItem(categoryId, JSON.stringify(tasks));
}
