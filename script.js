// Get the modal and the buttons
var modal = document.getElementById("loginModal");
var openModalBtn = document.getElementById("openModalBtn");
var closeModalBtn = document.getElementById("closeModalBtn");

// When the user clicks on the login button, open the modal
openModalBtn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on the close button, close the modal
closeModalBtn.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks outside of the modal, close the modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Function to toggle the dropdown menu for categories
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}
