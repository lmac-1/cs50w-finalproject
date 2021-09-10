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
                prepopulateVideoForm(videoData);
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
        errorDiv.innerHTML = 'A system error has occurred. Please try a different browser and if the error continues, contact the site owner.';
    } else {
        errorDiv.innerHTML = 'The link you provided did not contain a valid YouTube ID. Please make sure that you are copying the link directly from YouTube and try again.';
    }

    // Show error message
    document.getElementById('error_container').classList.remove('d-none');
    
    // Print console error for debugging uses
    console.error(errorMessage);
}

function prepopulateVideoForm(videoData) {
    // Hides error message
    let errorContainer = document.getElementById('error_container');
    hideBootstrapElement(errorContainer);
    
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

function addNewStepFormHTML() {

    let stepsContainer = document.querySelector('#steps-container');

        // Create container to add new step
        let addNewStepContainer = document.createElement('div');
        addNewStepContainer.className = 'mb-2';
        addNewStepContainer.id = 'new-step-container';
        stepsContainer.appendChild(addNewStepContainer);

        // Create form group to hold the input
        let stepFormGroup = document.createElement('div');
        stepFormGroup.className = 'form-group';
        addNewStepContainer.appendChild(stepFormGroup);

        // Create label
        let labelForInput = document.createElement('label');
        labelForInput.setAttribute("for",'new-step-name');
        labelForInput.innerHTML = 'Step name';
        stepFormGroup.appendChild(labelForInput);

        // Create input
        let inputNewStep = document.createElement('input');
        inputNewStep.type = 'text';
        inputNewStep.className = 'form-control';
        inputNewStep.id = 'new-step-name';
        // Makes button disabled if input field blank to prevent submission
        inputNewStep.addEventListener('keyup', () => {
            if (inputNewStep.value.length > 0) {
                saveButton.classList.remove('disabled')
            }
            else {
                
                saveButton.classList.add('disabled');
            }
        })
        stepFormGroup.appendChild(inputNewStep);

        // Create button container
        let buttonContainer = document.createElement('div');
        buttonContainer.className = 'd-flex justify-content-end my-2';
        addNewStepContainer.appendChild(buttonContainer);

        // Create cancel button
        let cancelButton = document.createElement('a');
        cancelButton.className = 'btn btn-pink-outline';
        cancelButton.innerHTML = 'Cancel';
        // Add event listener for the button  
        cancelButton.addEventListener('click', function() {
            addNewStepContainer.remove();
            showBootstrapElement(document.querySelector('#add-new-step-button'));
        })
        buttonContainer.appendChild(cancelButton);

        // Create save button
        let saveButton = document.createElement('a');
        saveButton.className = 'btn btn-pink ml-2 disabled';
        saveButton.innerHTML = 'Save';
        saveButton.disabled = true;
        saveButton.addEventListener('click', () => {
            saveNewStep(inputNewStep.value);
        })
        buttonContainer.appendChild(saveButton);

}

function addNewStepCheckboxHTML(jsonData) {
    
    let listItem = document.createElement('li');
    listItem.className = 'pr-3 pb-2';
    document.querySelector('#all-steps').append(listItem);

    let label = document.createElement('label');
    label.setAttribute("for",`id_calena_steps_${jsonData.value}`);
    label.innerHTML = `<input id="id_calena_steps_${jsonData.value}" 
                        name="calena_steps" type="checkbox" value="${jsonData.value}">
                        ${jsonData.name}`;
    listItem.append(label);
}

// Saves new step to the database
async function saveNewStep(stepName) {
    try {
        let url = '/add_step';

        let response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                step_name: stepName
            })
        })
        let jsonResponse = await response.json();
        console.log(jsonResponse);

        // Only adds a new checkbox to 'calena steps' if it receives a successful response
        if (jsonResponse.value) {
            addNewStepCheckboxHTML(jsonResponse);
        }
        else {
            // If the JSON respone returns with an error, we will show to the client
            if (jsonResponse.error) {
                let errorMessage = document.getElementById('steps-error');
            errorMessage.innerHTML = `<small>${jsonResponse.error}</small>`;
            }   
        }
        
        // Remove the container to add a new step from the DOM
        document.querySelector('#new-step-container').remove();
        // Reshow the 'add new step' button
        showBootstrapElement(document.querySelector('#add-new-step-button'));
    }
    catch(err) {
        console.log(err);
    }
}

document.addEventListener('DOMContentLoaded', function() {

    // Clear form on page load
    document.getElementById('videoInputLink').value = "";
    
    // Reset form fields
    document.getElementById('video_form').reset()

    // When user submits the 'Load Video' button
    document.getElementById('add-new-video').addEventListener("click", function() {
        
        // Rehides form
        hideBootstrapElement(document.getElementById('newVideoForm'));
        // Resets form (clears all fields)
        document.getElementById('video_form').reset()

        // Gets YouTube URL from the form input
        const youtubeUrl = document.getElementById('videoInputLink').value;
        processYoutubeUrl(youtubeUrl);

    })
    
    // When the style field is updated, carry out the following actions:
    document.getElementById('style').onchange = () => {
        
        let stepsField = document.getElementById('steps-container');

        // If salsa calena is selected, show the salsa calena steps field
        if (document.getElementById('style').value == 2) {
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

    document.querySelector('#add-new-step-button').addEventListener("click", function() {
        // Clears error message
        document.getElementById('steps-error').innerHTML = '';
        hideBootstrapElement(document.querySelector('#add-new-step-button'));
        addNewStepFormHTML();
    })

})