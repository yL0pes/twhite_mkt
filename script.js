$(document).ready(function() {
    console.log('Page loaded');
    $.get('/load_tasks', function(tasks) {
        const categoryMap = {
            'acoes-boards': 'acoes-card',
            'marketing-boards': 'marketing-card',
            'rh-boards': 'rh-card',
            'loja-boards': 'loja-card'
        };
        $.each(tasks, function(categoryId, taskDescriptions) {
            const cardId = categoryMap[categoryId];
            const cardElement = $('#' + cardId + ' .new-card-content');
            if (cardElement.length) {
                $.each(taskDescriptions, function(index, taskDescription) {
                    const taskElement = $(`
                        <div class="list-group-item d-flex justify-content-between align-items-center">
                            ${taskDescription}
                            <button class="btn btn-danger btn-sm delete-task-btn">&times;</button>
                        </div>
                    `);
                    cardElement.append(taskElement);

                    taskElement.find('.delete-task-btn').on('click', function() {
                        console.log(`Removing task: ${taskDescription}`);
                        taskElement.remove();
                        $.post('/delete_task', { categoryId, taskDescription }, function(data) {
                            console.log('Task deleted from backend:', data);
                        }).fail(function(error) {
                            console.error('Error:', error);
                        });
                    });
                });
            }
        });
    }).fail(function(error) {
        console.error('Error loading tasks:', error);
    });
});

function removeTaskFromLocalStorage(category, taskDescription) {
    console.log(`Removing task from localStorage: ${taskDescription}`);
    let tasks = JSON.parse(localStorage.getItem(category)) || [];
    tasks = tasks.filter(task => task !== taskDescription);
    localStorage.setItem(category, JSON.stringify(tasks));
}
