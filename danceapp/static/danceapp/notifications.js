document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('notification-toggle').addEventListener("click", function() {
        let notificationDiv = document.getElementById('notification-section');

        notificationDiv.classList.toggle('d-none');
    })
});