/* Bio Modal */
function initBioModal () {

    function showBio(divId) {
        const div = document.getElementById(divId);
        if (div) {
            hideBioFromAll();
            div.classList.add('active-bio');
            div.ariaHidden = "false";
        }
    }

    function hideBio(divId) {
        const div = document.getElementById(divId);
        if (div) {
            div.classList.remove('active-bio');
            div.ariaHidden = "true";
        }
    }

    function hideBioFromAll() {
        const elements = document.querySelectorAll('.active-bio');
        
        elements.forEach(element => {
        element.classList.remove('active-bio');
        element.ariaHidden = "true";
        });
    }

    // Attach the function(s) to the global window object to be accessible globally
    window.showBio = showBio;
    window.hideBio = hideBio;
}

/* Mobile Navigation */
function initMenu() {    
    const elNavigation = document.getElementById('navigation');

    function hideMobileNav(ariaHidden = "true") {
        if (elNavigation) {
            elNavigation.classList.remove('active-navigation');
            elNavigation.ariaHidden = ariaHidden;
        }
    }

    function showMobileNav() {
        if (elNavigation) {
            elNavigation.classList.add('active-navigation');
            elNavigation.ariaHidden = "false";
        }
    }

    function handleResize() {
        if (window.innerWidth > 640) {
            hideMobileNav("false");
        } else if (elNavigation) {
            if(!elNavigation.classList.contains('active-navigation')) {
                hideMobileNav("true");
            }
        }
    }
    
    // Attach the resize event listener to the window
    window.addEventListener('resize', handleResize);
    // Call the function on page load to ensure the class is removed if the window starts at a large width
    handleResize();

    // Attach the function(s) to the global window object to be accessible globally 
    window.hideMobileNav = hideMobileNav;
    window.showMobileNav = showMobileNav;
}

document.addEventListener('DOMContentLoaded', function () {
    initBioModal();
    initMenu();
});


