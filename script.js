document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded');
    const categories = ['acoes-card', 'marketing-card', 'rh-card', 'loja-card'];
    categories.forEach(category => {
        console.log(`Loading tasks for category: ${category}`);
        const tasks = JSON.parse(localStorage.getItem(category)) || [];
        const cardElement = document.getElementById(category);
        tasks.forEach(taskDescription => {
            console.log(`Adding task: ${taskDescription}`);
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
                removeTaskFromLocalStorage(category, taskDescription);
            });
        });
    });
});

function removeTaskFromLocalStorage(category, taskDescription) {
    console.log(`Removing task from localStorage: ${taskDescription}`);
    let tasks = JSON.parse(localStorage.getItem(category)) || [];
    tasks = tasks.filter(task => task !== taskDescription);
    localStorage.setItem(category, JSON.stringify(tasks));
}
