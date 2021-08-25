document.addEventListener('DOMContentLoaded', function() {
    
    window.onresize = hideNotificationsForMediumScreens;

    function hideNotificationsForMediumScreens() {
        let notificationContainer = document.getElementById('notification-section');
        
        // If notifications open and screen is resized to medium screen or lower, hide notifications
        if (window.innerWidth < 992 & !notificationContainer.classList.contains('d-none')) {
            notificationContainer.classList.add('d-none');
        }
    }

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