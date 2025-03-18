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

    // Load tasks from backend on page load
    fetch('/load_tasks')
        .then(response => response.json())
        .then(tasks => {
            const categories = ['acoes-boards', 'marketing-boards', 'rh-boards', 'loja-boards'];
            categories.forEach(categoryId => {
                const boardElement = document.getElementById(categoryId);
                if (tasks[categoryId]) {
                    tasks[categoryId].forEach(taskDescription => {
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
                            $.post('/delete_task', { categoryId, taskDescription }, function(data) {
                                console.log('Task deleted from backend:', data);
                            }).fail(function(error) {
                                console.error('Error:', error);
                            });
                        });
                    });
                }
            });
        })
        .catch(error => console.error('Error loading tasks:', error));
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
            $.post('/delete_task', { categoryId, taskDescription }, function(data) {
                console.log('Task deleted from backend:', data);
            }).fail(function(error) {
                console.error('Error:', error);
            });
        });

        // Send task data to the backend
        fetch('/add_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ categoryId, taskDescription })
        }).then(response => response.json())
          .then(data => console.log('Task added to backend:', data))
          .catch(error => console.error('Error:', error));
    }
});
