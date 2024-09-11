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
