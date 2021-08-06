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

        // Create link element
        const videoLink = document.createElement('a');
        videoLink.className = 'text-decoration-none';
        // TODO change these links to be less hardcoded
        videoLink.href=`/video/${video.id}`;
        videoLink.id = `link_for_${video.id}`
        document.getElementById("videoContainer").appendChild(videoLink);

        // Create enclosing DIV
        const videoDiv = document.createElement('div');
        videoDiv.className = 'card';
        videoDiv.style = 'width: 18rem;';
        videoDiv.id = `video_container_${video.id}`;
        videoLink.appendChild(videoDiv);

        // Create image thumbnail
        const videoThumbnail = document.createElement('img');
        videoThumbnail.className = 'card-img-top';
        videoThumbnail.alt = `Image for ${video.title}`;
        videoThumbnail.src = video.thumbnail_url;
        videoDiv.appendChild(videoThumbnail);

        const videoBodyDiv = document.createElement('div');
        videoBodyDiv.className = 'card-body';
        videoDiv.appendChild(videoBodyDiv);

        const videoLinkText = document.createElement('p');
        videoLinkText.className = 'card-text';
        videoLinkText.innerHTML = video.title;
        videoBodyDiv.appendChild(videoLinkText);
    });

}

document.addEventListener('DOMContentLoaded', function() {

    getVideosHTML();

})