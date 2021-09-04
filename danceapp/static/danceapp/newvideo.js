// TODO - mask and change this for public github repository
const apiKey = 'AIzaSyDqJKAoUhSpbuEZrWCTwgkxgiA7tFcKPEw';

async function processYoutubeUrl(url) {
    
    // Extracts any potential YouTube IDs from the URL, creating an array
    let potentialYouTubeIds = getPotentialYouTubeIds(url);

    if (potentialYouTubeIds != null) {
        try {
            // Here we process the potential Ids to try to get an object with the video information
            let videoData = await getValidVideoObject(potentialYouTubeIds);
            
            // If a video object is craeted, update the form with relevant details
            if (videoData != null) {
                updatePage(videoData);
            }
            else {
                invalidId('The URL did not contain a valid ID');
            }
        } 
        catch (err) {
            console.log(err);
            invalidId('Fetch failed');
        }    
    }
    // We didn't find any possible YouTube IDs in the URL
    else {
        invalidId('The URL does not contain a parameter with 11 characters that could potentially be an ID');
    }
}

function getPotentialYouTubeIds(url) {
    
    // At the time of writing, YouTube IDs have 11 characters
    let lengthOfValidYouTubeID = 11;
    
    // This separates the URL into parts using delimiters / . ? & and =
    let urlParameters = url.split(/\/|\.|\?|&|=/);
    
    // We create an empty array to hold the potential YouTube Ids
    let potentialYouTubeIds = [];

    // We iterate through the urlParameters checking for any with length 11, pushing them into potentialYouTubeIds
    for (const parameter of urlParameters) {
        if (parameter.length === lengthOfValidYouTubeID) {
            potentialYouTubeIds.push(parameter);
        }
    }

    // If we found some potential IDs, return these, else return null
    if (potentialYouTubeIds.length >= 1) return potentialYouTubeIds;
    else return null;
}

async function getValidVideoObject(ids) {

    for (const id of ids) {
        let url = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${apiKey}&part=snippet,contentDetails,statistics,status`;

        // We try to call the YouTube API with the given id and convert to JSON
        let response = await fetch(url);
        let jsonResponse = await response.json();
        console.log(jsonResponse);
        
        // Here we are checking if the ID is valid
        if (jsonResponse.hasOwnProperty('pageInfo') && jsonResponse.pageInfo.totalResults === 1 && jsonResponse.items[0].kind==='youtube#video') {
            // If the results give a youtube video, we will create the youtube object
                return createVideoObject(jsonResponse);
        }
    }

    return null;
}

function createVideoObject(videoJsonData) {

    // This part of the JsonData holds all info about the youtube video
    // We have previously verified that this is the only result in the JsonData
    let video = videoJsonData.items[0].snippet;

    /* [TODO] Build a constructor for this type of object */
    // We pull the title, description, thumbnail url and id of the youtube video from the youtube API
    let id = videoJsonData.items[0].id;
    let title = video.title;
    let description = video.description;
    let thumbnailUrl = video.thumbnails.medium.url;

    // Returns video object which will be used to prepopulate fields on page
    return {
            id, 
            title, 
            description, 
            thumbnailUrl
        };
}

// this will hold our error handling for invalid ids / no response
function invalidId(errorMessage) {
    
    let errorDiv = document.getElementById('error_message');

    if (errorMessage == "Fetch failed") {
        errorDiv.innerHTML = 'A system error has occurred. Please try a different browser and if the error continues, contact your teacher.';
    } else {
        errorDiv.innerHTML = 'The link you provided did not contain a valid YouTube ID. Please make sure that you are copying the link directly from YouTube and try again.';
    }

    // Show error message
    document.getElementById('error_container').classList.remove('d-none');
    
    // Print console error for debugging uses
    console.error(errorMessage);
}

function updatePage(videoData) {
    // Hides error message
    let errorContainer = document.getElementById('error_container');
    errorContainer.classList.add('d-none');
    
    document.getElementById('videoTitle').value = videoData.title;
    document.getElementById('videoDescription').value = videoData.description;
    document.getElementById('videoThumbnailUrl').value = videoData.thumbnailUrl;
    document.getElementById('videoYoutubeId').value = videoData.id;
    document.getElementById('newVideoForm').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {

    // Clear form on page load
    document.getElementById('videoInputLink').value = "";
    
    // Reset form fields
    document.getElementById('video_form').reset()
    
    // When the style field is updated, carry out the following actions:
    document.getElementById('style').onchange = () => {
        
        let stepsField = document.getElementById('steps');

        // If salsa calena is selected, show the salsa calena steps field
        if (document.getElementById('style').value == 1) {
            stepsField.classList.remove('d-none');
        } else {
            // Hides calena steps field
            if (!stepsField.classList.contains('d-none')) {
                stepsField.classList.add('d-none');
            }
            // Unticks any checkboxes in the calena step field
            document.querySelectorAll('#steps input').forEach(checkbox => {
                checkbox.checked = false;
            });
        }
    }

    // When user submits the 'New Video' button
    document.getElementById('newVideo').onclick = () => {
        
        // Rehides form
        document.getElementById('newVideoForm').style.display = 'none';
        // Resets form (clears all fields)
        document.getElementById('video_form').reset()

        // Gets YouTube URL from the form input
        const youtubeUrl = document.getElementById('videoInputLink').value;
        processYoutubeUrl(youtubeUrl);

    }

})