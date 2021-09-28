function resizeScreen() {
    // Page name
    let page = window.location.pathname;
    // Notifications
    let notificationContainer = document.getElementById('notification-section');
    // Filters
    let filterContainer = document.getElementById('filter-container');
    let teacherFilterValue = document.getElementById('search_teacher').value;
    let levelFilterValue = document.getElementById('search_level').value;
    let styleFilterValue = document.getElementById('search_style').value;
    let stepFilterValue= document.getElementById('search_step').value;
    
    // If notifications are open and screen is resized to medium screen or lower, hide notifications
    if (window.innerWidth < 992 & !notificationContainer.classList.contains('d-none')) {
        notificationContainer.classList.add('d-none');
    }

    // If we are on the home page
    if (page.length === 0 || page === "/" || page.match(/^\/?index/)) {

        if (window.innerWidth <= 1199) {
        
            // Switching between side bar and central filter view
            if (filterContainer.classList.contains('filters-sidebar')) {
                filterContainer.classList.remove('mx-auto');
                filterContainer.classList.remove('filters-sidebar');
                filterContainer.classList.remove('d-block');
                
                // Only hide filters in transition if none have been applied
                if (styleFilterValue == '' && levelFilterValue == '' && teacherFilterValue == '' && stepFilterValue == '') {
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
    resizeScreen()
    window.onresize = resizeScreen;
})