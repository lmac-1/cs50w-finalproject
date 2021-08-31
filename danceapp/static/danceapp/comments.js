let commentButtons = document.getElementById('comment-buttons');
let submitButton = document.getElementById('add-comment')
let cancelButton = document.getElementById('cancel-comment')
let commentTextArea = document.getElementById('comment-textarea');

// Shows a given Bootstrap element
function showElement(element) {
    if (element.classList.contains('d-none')) {
        element.classList.remove('d-none');
    }
}

// Hides a given Bootstrap element
function hideElement(element) {
    if (!element.classList.contains('d-none')) {
        element.classList.add('d-none');
    }
}

// Deletes comments (only if you are the author of the comment)
function deleteComment(commentId) {
    
    try {
        let url = `/delete_comment/${commentId}`;
        
        fetch(url, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(result => {
            const deleted = result.deleted;

            // Deletes the comment from the page if we have successfully deleted the comment from the database
            if (deleted) {
                document.getElementById(`comment-${commentId}`).remove();
            } 
            // If POST request returns an error, then show this in the console
            else if (result.error) {
                console.error(result.error);
            }
            else {
                console.error('We couldnt delete your comment, as you are not the author');
            }
        })
    } catch (err) {
        console.log(err);
    } 
    
}

// Clicking on text area shows the comment buttons
commentTextArea.addEventListener('focus', function() {
    showElement(commentButtons);
})

// Submitting the comment rehides the buttons
submitButton.addEventListener('click', function() {
    hideElement(commentButtons);
})

// Cancel button hides buttons and clears comment
cancelButton.addEventListener('click', function() {
    hideElement(commentButtons);
    commentTextArea.value = '';
})

// Deletes comments
document.querySelectorAll('.delete-comment').forEach(item => {
    item.addEventListener('click', event => {
        let commentId= item.dataset.comment_id;
        deleteComment(commentId);
    })
})

/* TODO people should be able to delete (maybe edit) comments */