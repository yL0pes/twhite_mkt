document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded');
    fetch('/load_tasks')
        .then(response => response.json())
        .then(tasks => {
            const categoryMap = {
                'acoes-boards': 'acoes-card',
                'marketing-boards': 'marketing-card',
                'rh-boards': 'rh-card',
                'loja-boards': 'loja-card'
            };
            for (const [categoryId, taskDescriptions] of Object.entries(tasks)) {
                const cardId = categoryMap[categoryId];
                const cardElement = document.getElementById(cardId);
                if (cardElement) {
                    taskDescriptions.forEach(taskDescription => {
                        const taskElement = document.createElement('div');
                        taskElement.className = 'list-group-item d-flex justify-content-between align-items-center';
                        taskElement.innerHTML = `
                            ${taskDescription}
                            <button class="btn btn-danger btn-sm delete-task-btn">&times;</button>
                        `;
                        cardElement.querySelector('.card2').appendChild(taskElement);

                        taskElement.querySelector('.delete-task-btn').addEventListener('click', function() {
                            console.log(`Removing task: ${taskDescription}`);
                            taskElement.remove();
                            removeTaskFromLocalStorage(categoryId, taskDescription);
                        });
                    });
                }
            }
        })
        .catch(error => console.error('Error loading tasks:', error));
});

function removeTaskFromLocalStorage(category, taskDescription) {
    console.log(`Removing task from localStorage: ${taskDescription}`);
    let tasks = JSON.parse(localStorage.getItem(category)) || [];
    tasks = tasks.filter(task => task !== taskDescription);
    localStorage.setItem(category, JSON.stringify(tasks));
}
