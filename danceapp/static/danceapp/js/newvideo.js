// Comes from other script just above this one in the HTML template
const apiKey = YOUTUBE_API_KEY;

// Clear form on page load
document.getElementById('videoInputLink').value = "";

// Reset form fields
document.getElementById('video_form').reset()

// When user submits the 'Load Video' button
document.getElementById('add-new-video').addEventListener("click", function() {
    // Results in an error if no API key in settings
    if (!apiKey) {
        generateInvalidIdErrorMessages('No API key', 'You do not have an API key configured. Please see the instructions in the repository in order to set up.') 
    }
    else {
        // Rehides form
        hideBootstrapElement(document.getElementById('newVideoForm'));
        // Resets form (clears all fields)
        document.getElementById('video_form').reset()

        // Gets YouTube URL from the form input
        const youtubeUrl = document.getElementById('videoInputLink').value;
        processYoutubeUrlAndUpdatePage(youtubeUrl);
    }

})

async function processYoutubeUrlAndUpdatePage(url) {
    
    // Extracts any potential YouTube IDs from the URL, creating an array
    let potentialYouTubeIds = getPotentialYouTubeIds(url);

    if (potentialYouTubeIds != null) {
        try {
            // Here we process the potential Ids to try to get an object with the video information
            let videoData = await getValidVideoObject(potentialYouTubeIds);
            
            // If a video object is created, update the form with relevant details
            if (videoData != null) {
                prepopulateVideoForm(videoData);
            }
            else {
                generateInvalidIdErrorMessages('The URL did not contain a valid ID');
            }
        } 
        catch (err) {
            console.log(err);
            generateInvalidIdErrorMessages('Fetch failed', 'A system error has occurred. Please try a different browser and if the error continues, contact the site owner.');
        }    
    }
    // We didn't find any possible YouTube IDs in the URL
    else {
        generateInvalidIdErrorMessages('The URL does not contain a parameter with 11 characters that could potentially be an ID');
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
        
        // Check if the ID is valid
        if (jsonResponse.hasOwnProperty('pageInfo') && jsonResponse.pageInfo.totalResults === 1 && jsonResponse.items[0].kind==='youtube#video') {
            // If the results give a youtube video, we will create the youtube object
                return createVideoObject(jsonResponse);
        }
    }

    return null;
}

function createVideoObject(videoJsonData) {

    // This part of the JsonData holds all info about the youtube video
    let video = videoJsonData.items[0].snippet;

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

// This will hold our error handling for invalid ids / no response
function generateInvalidIdErrorMessages(devMessage, visibleMessage) {
    
    let errorDiv = document.getElementById('error_message');

    // Updates the error message on page
    if (visibleMessage) {
        errorDiv.innerHTML = visibleMessage;
    } else {
        errorDiv.innerHTML = 'The link you provided did not contain a valid YouTube ID. Please make sure that you are copying the link directly from YouTube and try again.';
    }

    // Show error message
    document.getElementById('error_container').classList.remove('d-none');
    
    // Print console error for debugging uses
    console.error(devMessage);
}

function prepopulateVideoForm(videoData) {
    
    // Hides error message
    hideBootstrapElement(document.getElementById('error_container'));
    
    // Prepopulates form based on data returned from YouTube API
    document.getElementById('videoTitle').value = videoData.title;
    document.getElementById('videoDescription').value = videoData.description;
    document.getElementById('videoThumbnailUrl').value = videoData.thumbnailUrl;
    document.getElementById('videoYoutubeId').value = videoData.id;
    showBootstrapElement(document.getElementById('newVideoForm'));
}

// Shows a given Bootstrap element
function showBootstrapElement(element) {
    if (element.classList.contains('d-none')) {
        element.classList.remove('d-none');
    }
}

// Hides a given Bootstrap element
function hideBootstrapElement(element) {
    if (!element.classList.contains('d-none')) {
        element.classList.add('d-none');
    }
}