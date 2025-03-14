document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin panel loaded');
    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.querySelector('.sidebar');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('expanded');
        toggleBtn.classList.toggle('expanded');
    });
    // ...future admin scripts...
});
