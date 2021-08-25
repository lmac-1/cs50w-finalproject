let commentButtons = document.getElementById('comment-buttons');
let submitButton = document.getElementById('add-comment')
let cancelButton = document.getElementById('cancel-comment')
let commentTextArea = document.getElementById('comment-textarea');

// Shows a given Bootstrap element
function showElement(element) {
    if (element.classList.contains('d-none')) {
        console.log(element.classList)
        element.classList.remove('d-none');
        console.log(element.classList)
    }
}

// Hides a given Bootstrap element
function hideElement(element) {
    if (!element.classList.contains('d-none')) {
        element.classList.add('d-none');
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