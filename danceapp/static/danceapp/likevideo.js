function updateFavourites(videoId) {
    
    try {
        let url = `/update_favourites/${videoId}`;

        fetch(url, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(result => {
            // Response will tell us if the video is in the user's likes
            const videoInUserFavourites = result.in_favourites;
            const heartIcon = document.getElementById('heart-icon');

            // Update page to reflect database change
            if (videoInUserFavourites) {
                heartIcon.className = 'fas fa-heart';
            } else {
                heartIcon.className = 'far fa-heart';
            }
        })
    } catch (err) {
        console.log(err);
    } 
}

document.querySelector('#save-video').addEventListener('click', () => {
    // Get ID of video from HTML
    let videoId = document.querySelector('#save-video').dataset.video_id;

    if (videoId) {
        updateFavourites(videoId);
    } else {
        console.error("There is no video ID provided");
    }
})