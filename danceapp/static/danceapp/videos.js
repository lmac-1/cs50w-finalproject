/* let filter = {
    title: "",
    style: "",
    teachers: ""
}
let allVideos;
let visibleVideos; */

// Removes all child elements of a parent element
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/* function filterVideos(videos) {
    filter.title = document.getElementById('title_input').value;
    filter.style = document.getElementById('search_style').value;
    filter.teachers = document.getElementById('search_teacher').value;

    let output;
} */

function searchTitle(videos) {
    // Get search string
    let titleFilter = document.getElementById('title_input').value.toLowerCase();
        
    let searchResults = videos.filter(video => video.title.toLowerCase().includes(titleFilter) == true);
    
    getVideosHTML(searchResults);
}

async function clearTitle() {
    const titleInput = document.getElementById('title_input');
    titleInput.value = '';
    
    // TODO -  temporary - at the moment resets to showing all videos
    const videoData = await getAllVideos();
    getVideosHTML(videoData);
}

function toggleFilters() {
    // Define elements we are going to use
    let styleFilter = document.getElementById('search_style');
    let teacherFilter = document.getElementById('search_teacher');
    let filtersContainer = document.getElementById('filters_container');
    let filterButton = document.getElementById('view_filters');

    // If filters are hidden, show them
    if (filtersContainer.className.includes('d-none')) {
        filtersContainer.classList.remove('d-none');
        filterButton.innerHTML = 'Clear Filters';
    } 
    // If filters are visible, reset them and hide
    else {
        
        // Reset filters back to 'all'
        styleFilter.value = '';
        teacherFilter.value = '';

        // Hide filters container
        filtersContainer.classList.add('d-none');

        filterButton.innerHTML = 'View Filters';    
    }
}

// Fetches video JSON data of all videos visible to logged in user
async function getAllVideos() {
    const response = await fetch(`/videos`);
    const jsonVideoData = await response.json();
    console.log(jsonVideoData);
    return jsonVideoData;
}

// Produces HTML content for given video json data
async function getVideosHTML(videoJsonData) {
    // Get video container
    let videoContainer = document.getElementById("videoContainer");

    // First clear the HTML of previous search results, if any
    removeAllChildNodes(videoContainer);

    // If no videos, update HTML
    if (videoJsonData.length === 0) {
        const noResults = document.createElement('div');
        noResults.innerHTML = "No videos found.";
        videoContainer.appendChild(noResults);
    }

    // Iterate through videos
    videoJsonData.forEach(video => {

        // Create link element for video
        const videoLink = document.createElement('a');
        videoLink.className = 'text-decoration-none';
        // TODO change these links to be less hardcoded (Django)
        videoLink.href=`/video/${video.id}`;
        videoLink.id = `link_for_${video.id}`
        videoContainer.appendChild(videoLink);

        // Create enclosing DIV for video
        const videoDiv = document.createElement('div');
        videoDiv.className = 'card';
        videoDiv.style = 'width: 18rem;';
        videoDiv.id = `video_container_${video.id}`;
        videoLink.appendChild(videoDiv);

        // Create video image thumbnail
        const videoThumbnail = document.createElement('img');
        videoThumbnail.className = 'card-img-top';
        videoThumbnail.alt = `Image for ${video.title}`;
        videoThumbnail.src = video.thumbnail_url;
        videoDiv.appendChild(videoThumbnail);

        // Create other div to hold the link text
        const videoBodyDiv = document.createElement('div');
        videoBodyDiv.className = 'card-body';
        videoDiv.appendChild(videoBodyDiv);


        // Create link text
        const videoLinkText = document.createElement('p');
        videoLinkText.className = 'card-text';
        videoLinkText.innerHTML = video.title;
        videoBodyDiv.appendChild(videoLinkText);
    });

}

// TODO - check if async here is ok
document.addEventListener('DOMContentLoaded', async function() {
    
    allVideos = await getAllVideos();
    getVideosHTML(allVideos);

    // TODO - make work with enter key too
    document.getElementById('search_title').addEventListener("click", function() {
        searchTitle(allVideos);
    })

    // Hides and shows filters
    document.getElementById('view_filters').addEventListener("click", toggleFilters);

    // TODO - restore results
    document.getElementById('clear_title').addEventListener("click", clearTitle);

})