const filterContainer = document.getElementById('filter-container');

function changeIndexPageToSmallerScreenView(filters) {
    filterContainer.classList.remove('mx-auto');
    filterContainer.classList.remove('filters-sidebar');
    filterContainer.classList.remove('d-block');

    // Don't hide filters if one has been applied
    if (filters.styleFilterValue == '' && filters.levelFilterValue == '' && filters.teacherFilterValue == '' && filters.stepFilterValue == '') {
        filterContainer.classList.add('d-none');
    }
    // Only adds d-flex property if not already set to be hidden
    if (!filterContainer.classList.contains('d-none')) {
        filterContainer.classList.add('d-flex');
    }
}

function changeIndexPageToLargeScreenView() {
    filterContainer.classList.remove('d-flex');
    filterContainer.classList.remove('d-none');
    filterContainer.classList.add('d-block');
    filterContainer.classList.add('filters-sidebar');
    filterContainer.classList.add('mx-auto');
}

function resizeScreen() {
    // Page name
    let page = window.location.pathname;
    // Notifications
    let notificationContainer = document.getElementById('notification-section');
    
    // If notifications are open and screen is resized to medium screen or lower, hide notifications
    if (window.innerWidth < 992 & !notificationContainer.classList.contains('d-none')) {
        notificationContainer.classList.add('d-none');
    }

    // If we are on the home page
    if (page.length === 0 || page === "/" || page.match(/^\/?index/)) {
        // Filters
        let filters = {
            teacherFilterValue: document.getElementById('search_teacher').value,
            levelFilterValue: document.getElementById('search_level').value,
            styleFilterValue: document.getElementById('search_style').value,
            stepFilterValue: document.getElementById('search_step').value
        }
        
        if (window.innerWidth <= 1199) {
            changeIndexPageToSmallerScreenView(filters)
        } else {
            changeIndexPageToLargeScreenView()
        }
    }
}   
resizeScreen()
window.onresize = resizeScreen;