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
    // Makes button disabled if input field blank to prevent blank submission
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

// When the style field is updated, carry out the following actions:
document.getElementById('style').onchange = () => {
    
    let stepsContainer = document.getElementById('steps-container');

    // If salsa calena is selected, show the salsa calena steps field
    if (document.getElementById('style').value == 2) {
        stepsContainer.classList.remove('d-none');
    } else {
        // Hides calena steps field
        if (!stepsContainer.classList.contains('d-none')) {
            stepsContainer.classList.add('d-none');
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