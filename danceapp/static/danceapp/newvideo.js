async function getVideoAndUpdatePage(youtubeId) {
    const videoJsonData = await getVideoDataFromId(youtubeId);
    const videoObject = await createVideoObject(videoJsonData);
    updatePage(videoObject);
}

// [TODO] Error handling
async function getVideoDataFromId(youtubeId) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&key=AIzaSyBPfi6PU5j6pvvAR3sexwu8APAm_IcfNZ4&part=snippet,contentDetails,statistics,status`);
    const jsonVideoData = await response.json();
    console.log(jsonVideoData);
    return jsonVideoData;
}

async function createVideoObject(videoJsonData) {
    
    let video = videoJsonData.items[0].snippet;
    console.log(video);
    
    /* [TODO] Build a constructor for this type of object */
    let videoTitle = video.title;
    let videoDescription = video.description;
    let videoImage = video.thumbnails.medium.url;
    let videoId = videoJsonData.items[0].id;

    // Returns video object which will be used to prepopulate fields
    return {id: videoId, title: videoTitle, description: videoDescription, thumbnailUrl: videoImage};
}

function updatePage(videoObject) {
    document.getElementById('videoTitle').value = videoObject.title;
    document.getElementById('videoDescription').value = videoObject.description;
    document.getElementById('videoThumbnailUrl').value = videoObject.thumbnailUrl;
    document.getElementById('videoYoutubeId').value = videoObject.videoId;
}

document.addEventListener('DOMContentLoaded', function() {
    

    document.getElementById('newVideo').onclick = () => {
        
        const videoId = document.getElementById('videoInputLink').value;
        
        getVideoAndUpdatePage(videoId);

        document.getElementById('newVideoForm').style.display = 'block';

        console.log('hi');
    }

})