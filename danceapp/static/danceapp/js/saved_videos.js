import {getVideosHTML} from "./getvideos.js";

// Loads all videos on page load
let savedVideos = await getSavedVideos();
getVideosHTML(savedVideos);

async function getSavedVideos() {
    try {
        let response = await fetch(`/videos/saved`);
        let jsonVideoData = await response.json();
        //console.log(jsonVideoData); // Debugging purposes
        return jsonVideoData;
    }
    catch (err) {
        console.error(err);
    }
}

