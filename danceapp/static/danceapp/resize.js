function screenWidth() {
    let notificationContainer = document.getElementById('notification-section');
    let page = window.location.pathname;
    
    // If notifications are open and screen is resized to medium screen or lower, hide notifications
    if (window.innerWidth < 992 & !notificationContainer.classList.contains('d-none')) {
        notificationContainer.classList.add('d-none');
    }

    // If we are on the home page
    if (page.length === 0 || page === "/" || page.match(/^\/?index/)) {
        let filterContainer = document.getElementById('filter-container');
        let teacherFilter = document.getElementById('search_teacher').value;
        let levelFilter = document.getElementById('search_level').value;
        let styleFilter = document.getElementById('search_style').value;
        let stepFilter = document.getElementById('search_step').value;

        if (window.innerWidth <= 1199) {
        
            // Switching between side bar and central filter view
            if (filterContainer.classList.contains('filters-sidebar')) {
                filterContainer.classList.remove('mx-auto');
                filterContainer.classList.remove('filters-sidebar');
                filterContainer.classList.remove('d-block');
                
                // Only hide filters in transition if none have been applied
                if (styleFilter == '' && levelFilter == '' && teacherFilter == '' && stepFilter == '') {
                    filterContainer.classList.add('d-none');
                }
            }
            // Only adds d-flex property if not already set to be hidden
            if (!filterContainer.classList.contains('d-none')) {
                filterContainer.classList.add('d-flex');
            }
            
        } else {
            filterContainer.classList.remove('d-flex');
            filterContainer.classList.remove('d-none');
            filterContainer.classList.add('d-block');
            filterContainer.classList.add('filters-sidebar');
            filterContainer.classList.add('mx-auto');
        }
    }
}   

document.addEventListener('DOMContentLoaded', function() {
    // I have done this instead of window.onload as it seems to be faster
    screenWidth()
    
    window.onresize = screenWidth;
})