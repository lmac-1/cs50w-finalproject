let notifications = document.querySelectorAll('.notification-item');

function resetNotifications() {
    fetch('/reset_notifications', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });
}

// Marks given notification as read and redirects to video page
function readNotification(notification_id, direccionHref) {
    try {
        let url = `/read_notification/${notification_id}`;

        fetch(url, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if (result.message) location.href = `/video/${direccionHref}`;
            
        })
    } catch (err) {
        console.log(err);
    }    
}

function readAllNotificationsAndUpdatePage() {
    try {
        fetch('/read_all_notifications', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if (result.message) {
                notifications.forEach(function (notification) {
                    
                    if (notification.classList.contains('unread')) {
                        notification.classList.remove('unread');
                    }

                })
            }
        })
    } catch (err) {
        console.log(err);
    }
}

// Marks notifications as read and redirects to video page when clicked
notifications.forEach(function (notification, index) {
    notification.addEventListener('click', () => {
        readNotification(notification.dataset.notification_id, notification.dataset.video_id);
    }); 
});

document.getElementById('notification-toggle').addEventListener("click", function() {
    // Resets number of notifications to 0
    if (document.getElementById('circle').classList.contains('d-flex')) {
        resetNotifications();
        document.getElementById('circle').classList.remove('d-flex');
        document.getElementById('circle').classList.add('d-none')
    }

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

// Works for both the mobile and web view
document.querySelectorAll('.mark-read').forEach(element => {
    element.addEventListener('click', readAllNotificationsAndUpdatePage)
})