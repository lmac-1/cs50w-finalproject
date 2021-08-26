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
