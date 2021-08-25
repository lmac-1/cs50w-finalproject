document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('notification-toggle').addEventListener("click", function() {
        // Desktop (large and above) will show the notifications
        if (window.innerWidth >= 992) {
            let notificationDiv = document.getElementById('notification-section');
            notificationDiv.classList.toggle('d-none');
        } 
        // Medium and below devices will take the user to the notifications page
        else {
            location.href = "/notifications";
        }
        
        
    })
});