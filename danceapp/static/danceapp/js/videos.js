import {getVideosHTML} from "./getvideos.js";

// Creates empty filter object
let filter = {}

// Resets search filters on page load
document.getElementById('search_teacher').value = "";
document.getElementById('search_style').value = "";
document.getElementById('title_input').value = "";
document.getElementById('search_level').value = ""; 
document.getElementById('search_step').value = ""; 

// Loads all videos on page load
let allVideos = await getAllVideos();
getVideosHTML(allVideos);

// Toggles filters on smaller devices
document.getElementById('filter-toggle').addEventListener("click", function() {
    toggleFilters();
    filterVideos(allVideos,filter);
});

document.getElementById('search_title').addEventListener("click", function() {
    searchTitle();
})

document.getElementById('title_input').addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
        searchTitle();
    }
})

document.getElementById('search_teacher').addEventListener("change", function() {
    let teacherValueChosenByUser = document.getElementById("search_teacher").value;
    // Adds teacher to filter
    if (teacherValueChosenByUser != "") {
        filter.teacher = parseInt(teacherValueChosenByUser);
    } 
    // Deletes 'teacher' property if it exists and no teacher has been selected to search
    else if (filter.hasOwnProperty('teacher') && teacherValueChosenByUser == "") {
        delete filter.teacher;
    }
    // Apply filter
    filterVideos(allVideos, filter);
})

document.getElementById('search_style').addEventListener("change", function() {
    let styleValueChosenByUser = document.getElementById("search_style").value;
    let calenaStepDiv = document.getElementById("steps");

    // Adds style to filter
    if (styleValueChosenByUser != "") {
        filter.style = parseInt(styleValueChosenByUser);
    }
    // Deletes 'style' property from filter if it exists and no style has been selected to search
    else if (filter.hasOwnProperty('style') && styleValueChosenByUser == "") {
        delete filter.style;
    }

    // Unhiding salsa calena steps dropdown when Salsa Calena chosen
    if (styleValueChosenByUser == '2') { // Salsa calena
        calenaStepDiv.classList.remove('d-none');
    } 
    // Cleaning up filter and menu when a different style is selected
    else {
        document.getElementById('search_step').value = '';
        
        if (!calenaStepDiv.classList.contains('d-none')) {
            calenaStepDiv.classList.add('d-none');
        }

        if (filter.hasOwnProperty('step')) {
            delete filter.step;
        }
    }

    filterVideos(allVideos, filter);
})

document.getElementById('search_step').addEventListener("change", function() {
    let stepValueChosenByUser = document.getElementById('search_step').value;
    
    // Adds step to filter
    if (stepValueChosenByUser != "") {
        filter.step = parseInt(stepValueChosenByUser);
    }
    // Deletes 'step' property from filter if it exists and no step has been selected to search
    else if (filter.hasOwnProperty('step') && stepValueChosenByUser == "") {
        delete filter.step;
    }

    filterVideos(allVideos, filter);
})

document.getElementById('search_level').addEventListener("change", function() {
    let levelValueChosenByUser = document.getElementById("search_level").value;
    // Adds level to the filter
    if (levelValueChosenByUser != "") {
        filter.level = levelValueChosenByUser;
    }
    // Deletes 'level' property fom filter if it exists and no level has been selected to search
    else if (filter.hasOwnProperty('level') && levelValueChosenByUser == "") {
        delete filter.level;
    }
    filterVideos(allVideos, filter);
})


function toggleFilters() {
    // Defines elements we are going to use
    let filtersContainer = document.getElementById('filter-container');
    let styleFilter = document.getElementById('search_style');
    let teacherFilter = document.getElementById('search_teacher');
    let levelFilter = document.getElementById('search_level');
    let calenaStepFilter = document.getElementById('search_step');
    
    // If filters are hidden, show them
    if (filtersContainer.classList.contains('d-none')) {
        filtersContainer.classList.remove('d-none');
        filtersContainer.classList.add('d-flex');
    } 
    // If filters are visible, reset them and hide
    else if (filtersContainer.classList.contains('d-flex')) {
        filtersContainer.classList.remove('d-flex');
        filtersContainer.classList.add('d-none');

        // Reset filters back to 'all'
        styleFilter.value = '';
        teacherFilter.value = '';
        levelFilter.value = '';
        calenaStepFilter.value = '';

        // Resets filter object (if necessary)
        if (filter.hasOwnProperty('style')) {
            delete filter.style;
        }
        if (filter.hasOwnProperty('teacher')) {
            delete filter.teacher;
        }
        if (filter.hasOwnProperty('level')) {
            delete filter.level;
        }
        if (filter.hasOwnProperty('step')) {
            delete filter.step; 
        }
    }
}

// Filters video json data using given filter object
function filterVideos(videoJsonData, filter) {
    
    // Filters through the json data
    let filterSearchResults = videoJsonData.filter( (video) => {
        
        // Iterates through the keys in the filter
        for (let key in filter) {
            // Gets rid of any videos that don't contain the title given in the filter (if present in filter)
            if (key === 'title' && !video.title.toLowerCase().includes(filter.title)) {
                return false;
            }
            // Gets rid of any videos that don't match the style filter (if present in filter)
            else if (key === 'style' && video.style != filter.style) {
                return false;
            }
            // Gets rid of any videos that don't match the teacher filter (if present in filter)
            else if (key === 'teacher' && !video.teacher.some(e => e.value == filter.teacher)) {
                return false;
            }
            // Gets rid of any videos that don't match level (if set)
            else if (key === 'level' && video.level != filter.level) {
                return false;
            }
            // Gets rid of any videos that don't match calena steps (if set in filter)
            else if (key === 'step' && video.calena_steps.indexOf(filter.step) == -1) {
                return false;
            }
        }
        // If it passes all of the above tests, this video matches the search criteria and will be added to the search results
        return true;
    })
    
    // Generates HTML content for search results
    getVideosHTML(filterSearchResults);
}

// Fetches video JSON data of all videos visible to logged in user
async function getAllVideos() {
    try {
        let response = await fetch(`/videos/all`);
        let jsonVideoData = await response.json();
        //console.log(jsonVideoData); // Debugging purposes
        return jsonVideoData;
    }
    catch (err) {
        console.error(err);
    }
}

function searchTitle() {
    let titleUserSearchString = document.getElementById('title_input').value.toLowerCase();
    // Adds title to filter if non blank
    if (titleUserSearchString != "") {
        filter.title = titleUserSearchString;
    }
    // Else, reset filter
    else if (filter.hasOwnProperty('title') && titleUserSearchString == "") {
        delete filter.title;
    }
    // Apply filter
    filterVideos(allVideos, filter);
}