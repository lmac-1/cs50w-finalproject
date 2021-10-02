let commentButtons = document.getElementById('comment-buttons');
let commentTextArea = document.getElementById('comment-textarea');
let submitButton = document.getElementById('add-comment');
let cancelButton = document.getElementById('cancel-comment');

// Clicking on text area shows the comment buttons
commentTextArea.addEventListener('focus', function() {
    showBootstrapElement(commentButtons);
})

// Submitting the comment rehides the buttons
submitButton.addEventListener('click', function() {
    hideBootstrapElement(commentButtons);
})

// Cancel button hides buttons and clears comment
cancelButton.addEventListener('click', function() {
    hideBootstrapElement(commentButtons);
    commentTextArea.value = '';
})

// Deletes comments
document.querySelectorAll('.delete-comment').forEach(deleteCommentButton => {
    deleteCommentButton.addEventListener('click', event => {
        let commentId = deleteCommentButton.dataset.comment_id;
        deleteComment(commentId);
    })
})

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

// Deletes comments (only if you are the author of the comment)
function deleteComment(commentId) {
    
    try {
        let url = `/delete_comment/${commentId}`;
        
        fetch(url, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(result => {
            // The response tells us whether the comment should be deleted or not
            const commentDeleted = result.deleted;
            const totalComments = result.total_comments;

            // Deletes the comment from the page
            if (commentDeleted) {
                document.getElementById(`comment-${commentId}`).remove();

                // Updates total number of comments
                let totalCommentsHTML = document.getElementById('comment_counter_text');
                switch(totalComments) {
                    case 0: 
                        totalCommentsHTML.innerHTML = "Be the first to leave a comment!";
                        break;
                    case 1:
                        totalCommentsHTML.innerHTML = "1 comment";
                        break;
                    default:
                        totalCommentsHTML.innerHTML = `${totalComments} comments`;
                        break;
                }
                
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