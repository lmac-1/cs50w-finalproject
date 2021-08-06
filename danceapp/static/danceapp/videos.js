// Fetches video JSON data
async function getAllVideos() {
    const response = await fetch(`/videos`);
    const jsonVideoData = await response.json();
    console.log(jsonVideoData);
    return jsonVideoData;
}

async function getVideosHTML() {

    const videos = await getAllVideos();

    // If no videos, update HTML
    if (videos.length === 0) {
        const noResults = document.createElement('div');
        noResults.innerHTML = "No videos found.";
        document.getElementById("videoContainer").appendChild(noResults);
    }

    videos.forEach(video => {

        const videoLink = document.createElement('a');
        videoLink.className = 'text-decoration-none';
        // TODO change these links to be less hardcoded
        videoLink.href=`/video/${video.id}`;
        videoLink.innerHTML = video.title;
        
        document.getElementById("videoContainer").appendChild(videoLink);
    });

}

document.addEventListener('DOMContentLoaded', function() {

    getVideosHTML();

})