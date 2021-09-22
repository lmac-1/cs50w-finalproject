export async function getVideosHTML(videoJsonData) {
    // Gets video container
    let allVideosContainer = document.getElementById("videoContainer");

    // First clear the HTML of previous search results, if any
    removeAllChildNodes(allVideosContainer);

    // If no videos, update HTML
    if (videoJsonData.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'align-self-start mt-3';
        noResults.innerHTML = "No videos found.";
        allVideosContainer.appendChild(noResults);
    }

    // Iterate through videos
    videoJsonData.forEach(video => {

        // Create link element for video
        const videoLinkElement = document.createElement('a');
        videoLinkElement.className = 'text-decoration-none';
        videoLinkElement.href=`/video/${video.id}`;
        videoLinkElement.id = `link_for_${video.id}`
        allVideosContainer.appendChild(videoLinkElement);

        // Creates container for video
        const videoContainer = document.createElement('div');
        videoContainer.className = 'card m-2 text-dark card-box-shadow border-0';
        videoContainer.style = 'width: 18rem;';
        videoContainer.id = `video_container_${video.id}`;
        videoLinkElement.appendChild(videoContainer);

        // Create video image thumbnail
        const videoThumbnail = document.createElement('img');
        videoThumbnail.className = 'card-img-top card-thumbnail';
        videoThumbnail.alt = `Image for ${video.title}`;
        videoThumbnail.src = video.thumbnail_url;
        videoContainer.appendChild(videoThumbnail);

        // Create other div to hold the card body
        const videoBodyDiv = document.createElement('div');
        videoBodyDiv.className = 'card-homepage card-body';
        videoContainer.appendChild(videoBodyDiv);

        // Create other div to hold the title section
        const videoTitleDiv = document.createElement('div');
        videoTitleDiv.className = 'card-video-title card-text font-weight-bold text-left d-flex align-items-center px-3';
        videoTitleDiv.innerHTML = video.title;
        videoBodyDiv.appendChild(videoTitleDiv);

        // Create another div to hold the date, level and teachers
        const videoDetailsDiv = document.createElement('div');
        videoDetailsDiv.className = 'card-subtext d-flex justify-content-between align-items-center px-3 bg-light rounded-bottom';
        videoBodyDiv.appendChild(videoDetailsDiv);

        // Create div for level
        const videoLevelDiv = document.createElement('div');
        videoLevelDiv.innerHTML = `<i class="fab fa-deezer card-icon"></i> ${video.level}`;
        videoDetailsDiv.appendChild(videoLevelDiv);

        // Create div for date
        const videoDateDiv = document.createElement('div');
        videoDateDiv.innerHTML = `<i class="far fa-calendar-alt card-icon"></i> ${video.class_date}`;
        videoDetailsDiv.appendChild(videoDateDiv);

        // Create div for teachers
        const videoTeachersContainer = document.createElement('div');
        videoTeachersContainer.classList = 'd-flex flex-column justify-content-center align-items-center';
        videoDetailsDiv.appendChild(videoTeachersContainer);

        // Create div for each teacher (sometimes there are two)
        video.teacher.forEach(teacher => {
            const teacherDiv = document.createElement('div');
            teacherDiv.classList = 'pb align-self-start';
            teacherDiv.innerHTML = `<i class="fas fa-user card-icon pr-1"></i>${teacher.name}`;
            videoTeachersContainer.appendChild(teacherDiv); 
        })

    });

}

function removeAllChildNodes(parent) { // Removes all child elements of a parent DOM element
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
