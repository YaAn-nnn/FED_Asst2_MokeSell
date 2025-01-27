document.addEventListener("DOMContentLoaded", () => {
    // Get the modals
    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");

    // Get the buttons for opening the modals
    const openModalBtn = document.getElementById("openModalBtn");
    const createAccountLink = document.getElementById("createAccountLink");
    const loginAccountLink = document.getElementById("loginAccountLink");

    // Get the close buttons for both modals
    const closeLoginModalBtn = document.getElementById("closeModalBtn");
    const closeRegisterModalBtn = document.getElementById("closeRegisterModalBtn");

    // Open the login modal when the login button is clicked
    if (openModalBtn) {
        openModalBtn.addEventListener("click", () => {
            loginModal.style.display = "block";
        });
    }

    // Open the register modal when "Create Account" is clicked
    if (createAccountLink) {
        createAccountLink.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default link behavior
            loginModal.style.display = "none"; // Close the login modal
            registerModal.style.display = "block"; // Open the register modal
        });
    }

    // Go back to the login modal when "Login Account" is clicked
    if (loginAccountLink) {
        loginAccountLink.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default link behavior
            registerModal.style.display = "none"; // Close the register modal
            loginModal.style.display = "block"; // Open the login modal
        });
    }

    // Close the login modal when the close button is clicked
    if (closeLoginModalBtn) {
        closeLoginModalBtn.addEventListener("click", () => {
            loginModal.style.display = "none";
        });
    }

    // Close the register modal when the close button is clicked
    if (closeRegisterModalBtn) {
        closeRegisterModalBtn.addEventListener("click", () => {
            registerModal.style.display = "none";
        });
    }

    // Close modals when clicking outside of them
    window.addEventListener("click", (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = "none";
        } else if (event.target === registerModal) {
            registerModal.style.display = "none";
        }
    });

    // Handle form submission and password validation for register form
    const registerForm = document.querySelector("#registerModal form");
    const passwordField = document.getElementById("register-password");
    const confirmPasswordField = document.getElementById("confirm-password");
    const errorMessage = document.createElement("p");
    errorMessage.style.color = "red"; // Red color for error messages
    registerForm.appendChild(errorMessage); // Append error message below the form

    // When the user submits the form
    registerForm.addEventListener("submit", (event) => {
        // Clear any previous error message
        errorMessage.textContent = "";

        // Check if password and confirm password match
        if (passwordField.value !== confirmPasswordField.value) {
            // Display error message if passwords don't match
            errorMessage.textContent = "Passwords do not match!";
            event.preventDefault(); // Prevent form submission
            return; // Exit the function early
        }

        // Check if password is at least 8 characters long
        if (passwordField.value.length < 8) {
            errorMessage.textContent = "Password must be at least 8 characters long!";
            event.preventDefault(); // Prevent form submission
        }
    });

    // Function to toggle the dropdown menu for categories
    function toggleMenu() {
        const menu = document.getElementById('dropdownMenu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }

    // Handle category dropdown menu toggle
    const categoriesToggleBtn = document.querySelector('.categories-toggle-btn');
    if (categoriesToggleBtn) {
        categoriesToggleBtn.addEventListener('click', toggleMenu);
    }
});

document.getElementById("search-btn").addEventListener("click", () => {
    const searchQuery = document.getElementById("search-bar").value;
    if (searchQuery) {
        alert("Searching for: " + searchQuery);
    } else {
        alert("Please enter something to search.");
    }
});


