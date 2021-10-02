// Gets all users notifications
let notifications = document.querySelectorAll('.notification-item');

// Resets notification counter in nav and also in database
function resetNotificationCounter() {
    try {
        fetch('/reset_notifications_counter', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
        });
    }
    catch(err) {
        console.log(err);
    }
    
}

// Marks given notification as read and redirects to video related to notification
function readNotificationAndRedirectToPage(notificationId, videoId) {
    try {
        let url = `/read_notification/${notificationId}`;

        fetch(url, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if (result.message) location.href = `/video/${videoId}`;
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
notifications.forEach(function (notification) {
    notification.addEventListener('click', () => {
        let notificationId = notification.dataset.notification_id;
        let videoId = notification.dataset.video_id;
        readNotificationAndRedirectToPage(notificationId, videoId);
    }); 
});

document.getElementById('notification-toggle').addEventListener("click", function() {
    if (document.getElementById('circle').classList.contains('d-flex')) {
        // Resets notification counter in nav and also in database
        resetNotificationCounter();
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