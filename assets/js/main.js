import { addCopyToClipboardButtons } from './copy-to-clipboard';

/* Bio Modal */
const initBioModal = () => {

    const showBio = (divId) => {
        const div = document.getElementById(divId);
        if (div) {
            hideBioFromAll();
            div.classList.add('active-bio');
            div.ariaHidden = "false";
        }
    }

    const hideBio = (divId) => {
        const div = document.getElementById(divId);
        if (div) {
            div.classList.remove('active-bio');
            div.ariaHidden = "true";
        }
    }

    const hideBioFromAll = () => {
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
const initMenu = () => {    
    const elNavigation = document.getElementById('navigation');

    const hideMobileNav = (ariaHidden = "true") => {
        if ((elNavigation && window.innerWidth < 640) || (elNavigation && ariaHidden === "false")) {
            elNavigation.classList.remove('active-navigation');
            elNavigation.ariaHidden = ariaHidden;
        }
    }

    const showMobileNav = () => {
        if (elNavigation) {
            elNavigation.classList.add('active-navigation');
            elNavigation.ariaHidden = "false";
        }
    }

    const handleResize = () => {
        if (window.innerWidth >= 640) {
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
    addCopyToClipboardButtons('highlight');
});


