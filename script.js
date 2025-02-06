document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "67932aa4270cfe68c9c3ceec";

    // Form submission event
    document.getElementById("contact-submit").addEventListener("click", async function (e) {
        e.preventDefault(); // Prevent the form from submitting the default way

        // Get the form data
        const username = document.getElementById("signupusername").value.trim();
        const email = document.getElementById("signupemail").value.trim();
        const password = document.getElementById("signuppassword").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }


        // Function to check if email or username exists in RestDB
        async function checkExistingRecords() {
            const filter = `{"$or":[{"email":"${email}"},{"username":"${username}"}]}`;
            const settings = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY,
                    "Cache-Control": "no-cache",
                },
            };

            const response = await fetch(`https://mokeselldb-1246.restdb.io/rest/accounts?q=${encodeURIComponent(filter)}`, settings);
            const data = await response.json();
            return data;
        }

        // Perform the check and register if unique
        try {
            const data = await checkExistingRecords();
            if (data.length > 0) {
                // Username or email already exists
                alert("Username or email is already taken. Please choose another.");
            }
            // Validate password
            else if (password.length < 8) {
                alert("Password must be at least 8 characters long!");
            }
            else if (password !== confirmPassword) {
                alert("Passwords do not match. Please try again.");
            }
            else {
                // Create an object to send to the database
                const jsondata = {
                    email: email,
                    username: username,
                    password: password,
                    profileImageUrl: "Images/Default_pfp.jpg", // Default profile picture URL
                };

                // Fetch options for the POST request
                const settings = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-apikey": APIKEY,
                        "Cache-Control": "no-cache",
                    },
                    body: JSON.stringify(jsondata),
                };

                // Send the data to RestDB
                const response = await fetch("https://mokeselldb-1246.restdb.io/rest/accounts", settings);
                alert("Account registered successfully!");
                document.getElementById("add-contact-form").reset();
                document.getElementById("registerModal").style.display = "none";
                document.getElementById("loginModal").style.display = "block";
            }
        } catch (error) {
            console.error("Error during uniqueness check:", error);
            alert("Unable to validate uniqueness at the moment. Please try again later.");
        }
    });

    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");

    const openModalBtn = document.getElementById("openModalBtn");
    const createAccountLink = document.getElementById("createAccountLink");
    const loginAccountLink = document.getElementById("loginAccountLink");

    const closeLoginModalBtn = document.getElementById("closeModalBtn");
    const closeRegisterModalBtn = document.getElementById("closeRegisterModalBtn");

    // Modal control
    if (openModalBtn) {
        openModalBtn.addEventListener("click", () => {
            loginModal.style.display = "block";
        });
    }


    if (createAccountLink) {
        createAccountLink.addEventListener("click", (event) => {
            event.preventDefault();
            loginModal.style.display = "none";
            registerModal.style.display = "block";
        });
    }

    if (loginAccountLink) {
        loginAccountLink.addEventListener("click", (event) => {
            event.preventDefault();
            registerModal.style.display = "none";
            loginModal.style.display = "block";
        });
    }

    if (closeLoginModalBtn) {
        closeLoginModalBtn.addEventListener("click", () => {
            loginModal.style.display = "none";
        });
    }

    if (closeRegisterModalBtn) {
        closeRegisterModalBtn.addEventListener("click", () => {
            registerModal.style.display = "none";
        });
    }

    window.addEventListener("click", (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = "none";
        } else if (event.target === registerModal) {
            registerModal.style.display = "none";
        }
    });

    function toggleMenu() {
        const menu = document.getElementById("dropdownMenu");
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    }

    const categoriesToggleBtn = document.querySelector(".categories-toggle-btn");
    if (categoriesToggleBtn) {
        categoriesToggleBtn.addEventListener("click", toggleMenu);
    }

    // Login check and profile picture display
    const profilePic = document.getElementById("profilePic");
    const profilePicContainer = document.getElementById("profilePicContainer");

    // Check if user is logged in
    function checkLoginStatus() {
        const loggedInUser = localStorage.getItem("loggedInUser");
        if (loggedInUser) {
            // Replace Login button with Profile Picture
            document.getElementById("openModalBtn").style.display = "none"; // Hide login button
            document.getElementById("profilePicContainer").style.display = "block"; // Show profile picture container

            const profileImageUrl = localStorage.getItem("profileImageUrl");
            const profilePic = document.getElementById("profilePic");
    
            if (profileImageUrl) {
                profilePic.src = profileImageUrl; // Set the profile picture
            } else {
                profilePic.src = "Images/Default_pfp.jpg"; // Use default image if no profile image URL
            }
        }
    }

    // Handle login form submission
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form submission

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const filter = `{"email": "${email}"}`;
            const response = await fetch(`https://mokeselldb-1246.restdb.io/rest/accounts?q=${encodeURIComponent(filter)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY,
                    "Cache-Control": "no-cache",
                }
            });

            const users = await response.json();

            if (users.length === 0) {
                alert("Email not found. Please sign up.");
                document.getElementById("loginModal").style.display = "none";
                document.getElementById("registerModal").style.display = "block";
                return;
            }

            // Check if password matches
            const user = users[0]; // First user found with the email
            if (user.password !== password) {
                alert("Incorrect password. Please try again.");
                return;
            }

            // Successful login
            localStorage.setItem("loggedInUser", user.email); // Store login state
            localStorage.setItem("profileImageUrl", user.profileImageUrl || "Images/Default_pfp.jpg"); // Store profile picture URL
            document.getElementById("loginSuccessModal").style.display = "block";
            setTimeout(function () {
                document.getElementById("loginModal").style.display = "none"; // Hide the login modal
                window.location.href = "index.html"; // Redirect to main page
            }, 3000);

        } catch (error) {
            alert("Error connecting to server. Please try again.");
        }
    });

    checkLoginStatus();

    const profileDropdownMenu = document.getElementById("profileDropdownMenu");

    // Toggle the profile dropdown when the profile picture is clicked
    if (profilePic) {
        profilePic.addEventListener("click", function () {
            // Toggle the visibility of the profile dropdown menu
            profileDropdownMenu.style.display = (profileDropdownMenu.style.display === "block") ? "none" : "block";
        });
    }

    // Close the profile dropdown if the user clicks outside of it
    window.addEventListener("click", function (event) {
        if (!profilePic.contains(event.target) && !profileDropdownMenu.contains(event.target)) {
            profileDropdownMenu.style.display = "none";
        }
    });

    const logoutLink = document.getElementById("logoutLink");
    const logoutConfirmModal = document.getElementById("logoutConfirmModal");
    const closeLogoutConfirmModal = document.getElementById("closeLogoutConfirmModal");
    const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");
    const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
    const logoutSuccessModal = document.getElementById("logoutSuccessModal");
    const closeLogOutSuccessModal = document.getElementById("closeLogOutSuccessModal");
    const closeLoginSuccessModal = document.getElementById("closeLoginSuccessModal");
    
    if (logoutLink) {
        logoutLink.addEventListener("click", function (event) {
            event.preventDefault();
            logoutConfirmModal.style.display = "block";
        });
    }
    
    //Cancel (x) button on log out confirmation page
    if (closeLogoutConfirmModal) {
        closeLogoutConfirmModal.addEventListener("click", function () {
            logoutConfirmModal.style.display = "none";
        });
    }
    
    //Cancel button
    if (cancelLogoutBtn) {
        cancelLogoutBtn.addEventListener("click", function () {
            logoutConfirmModal.style.display = "none";
        });
    }
    
    //Log out button
    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener("click", function () {
            // Close the confirmation modal
            document.getElementById("logoutConfirmModal").style.display = "none";
    
            // Clear session data
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("profileImageUrl");
    
            // Show logout success modal
            logoutSuccessModal.style.display = "block";
    
            // Automatically redirect after showing the success message
            setTimeout(function () {
                logoutSuccessModal.style.display = "none";
                window.location.href = "index.html"; // Redirect to homepage
            }, 3000);
        });
    }

    if (closeLogOutSuccessModal) {
        closeLogOutSuccessModal.addEventListener("click", function () {
            logoutSuccessModal.style.display = "none"; 
            window.location.href = "index.html";
        });
    }    

    if (closeLoginSuccessModal) {
        closeLoginSuccessModal.addEventListener("click", function () {
            logoutSuccessModal.style.display = "none"; 
            window.location.href = "index.html";
        });
    }    

    restrictAccess();

    const notificationBtn = document.querySelector(".notificationBtn");
    const notificationBar = document.getElementById("notificationBar");
    const loggedInUser = localStorage.getItem("loggedInUser");

    // Set initial opacity for the notification button based on login status.
    if (!loggedInUser) {
        // Not logged in: set opacity to 50%
        if (notificationBtn) {
            notificationBtn.style.opacity = "0.5";
        }
    } else {
        // Logged in: ensure full opacity
        if (notificationBtn) {
            notificationBtn.style.opacity = "1";
        }
    }

    if (notificationBtn) {
        notificationBtn.addEventListener("click", function (event) {
            const loggedInUser = localStorage.getItem("loggedInUser");
            if (!loggedInUser) {
                event.preventDefault();
                alert("You must log in to access this feature.");
            } else {
                // Show notification bar if logged in
                notificationBar.style.right = "0px"; // Slide in
            }
        });
    }

    // Function to slide out (hide) the notification bar
    window.hideNotification = function () {
        if (notificationBar) {
            notificationBar.style.right = "-400px"; // Slide out
        }
    };
});



document.getElementById("search-btn").addEventListener("click", () => {
    const searchQuery = document.getElementById("search-bar").value;
    if (searchQuery) {
        alert("Searching for: " + searchQuery);
    } else {
        alert("Please enter something to search.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const boardElement = document.getElementById("board");
    const scoreElement = document.getElementById("score");
    const bestScoreElement = document.getElementById("best-score");
    let board = Array(4).fill().map(() => Array(4).fill(0));
    let tileElements = {};
    let score = 0;
    let bestScore = localStorage.getItem("bestScore") || 0;
    bestScoreElement.textContent = bestScore;

    // Tile colors based on number
    const tileColors = {
        2: "#eee4da",
        4: "#ede0c8",
        8: "#f2b179",
        16: "#f59563",
        32: "#f67c5f",
        64: "#f65e3b",
        128: "#edcf72",
        256: "#FFE600",
        512: "#edc850",
        1024: "#edc53f",
        2048: "#edc22e",
    };


    let voucherAwarded = false; // Prevent multiple popups

    function updateScore(points) {
        score += points;
        scoreElement.textContent = score;
    
        if (score > bestScore) {
            bestScore = score;
            bestScoreElement.textContent = bestScore;
            localStorage.setItem("bestScore", bestScore);
        }
    
        // ✅ Show voucher popup if 5000+ points
        if (score >= 5000 && !voucherAwarded) {
            voucherAwarded = true; // Prevent multiple alerts
            setTimeout(() => {
                alert("🎉 Congratulations! You’ve won a voucher! 🎟️"); 
            }, 300); // Small delay to prevent merge glitches
        }
    }
    

    function drawBoard() {
        Object.values(tileElements).forEach(tile => tile.remove());
        tileElements = {};
        board.forEach((row, r) => {
            row.forEach((value, c) => {
                if (value !== 0) {
                    let tile = document.createElement("div");
                    tile.classList.add("tile");
                    tile.textContent = value;
                    tile.style.transform = `translate(${c * 110}px, ${r * 110}px)`;
                    tile.style.backgroundColor = tileColors[value] || "#ccc"; // Set color based on value
                    boardElement.appendChild(tile);
                    tileElements[`${r}-${c}`] = tile;
                }
            });
        });
    }

    function updateTilePositions() {
        Object.entries(tileElements).forEach(([key, tile]) => {
            const [r, c] = key.split('-').map(Number);
            tile.style.transform = `translate(${c * 110}px, ${r * 110}px)`;
        });
    }

    function addRandomTile() {
        let emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === 0) emptyCells.push({ r, c });
            }
        }
        if (emptyCells.length > 0) {
            let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function slide(row) {
        let newRow = row.filter(val => val);
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                updateScore(newRow[i]);
                newRow[i + 1] = 0;
            }
        }
        newRow = newRow.filter(val => val);
        while (newRow.length < 4) newRow.push(0);
        return newRow;
    }

    function reverse(row) {
        return row.reverse();
    }

    function rotateBoardClockwise() {
        let newBoard = Array(4).fill().map(() => Array(4).fill(0));
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                newBoard[c][3 - r] = board[r][c];
            }
        }
        return newBoard;
    }

    function rotateBoardCounterClockwise() {
        let newBoard = Array(4).fill().map(() => Array(4).fill(0));
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                newBoard[3 - c][r] = board[r][c];
            }
        }
        return newBoard;
    }

    function moveBoard(direction) {
        let moved = false;
        if (direction === "ArrowUp") {
            board = rotateBoardCounterClockwise();
        } else if (direction === "ArrowDown") {
            board = rotateBoardClockwise();
        } else if (direction === "ArrowRight") {
            board = board.map(reverse);
        }
        
        for (let i = 0; i < 4; i++) {
            let newRow = slide(board[i]);
            if (newRow.toString() !== board[i].toString()) moved = true;
            board[i] = newRow;
        }
        
        if (direction === "ArrowUp") {
            board = rotateBoardClockwise();
        } else if (direction === "ArrowDown") {
            board = rotateBoardCounterClockwise();
        } else if (direction === "ArrowRight") {
            board = board.map(reverse);
        }
        
        if (moved) {
            addRandomTile();
            updateTilePositions();
            setTimeout(drawBoard, 150);
        }
    
        // ✅ Check for game over
        if (isGameOver()) {
            setTimeout(() => {
                document.getElementById("try-again").style.display = "block"; // Show button
                alert("Game Over! Try Again?");
            }, 300);
        }
    }
    function isGameOver() {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === 0) return false; // Empty cell exists
                if (c < 3 && board[r][c] === board[r][c + 1]) return false; // Can merge right
                if (r < 3 && board[r][c] === board[r + 1][c]) return false; // Can merge down
            }
        }
        return true; // No moves left
    }

    document.addEventListener("keydown", (event) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
            moveBoard(event.key);
        }
    });
    function restartGame() {
        board = Array(4).fill().map(() => Array(4).fill(0)); // Reset board
        score = 0;
        voucherAwarded = false; // Reset voucher flag
        scoreElement.textContent = "0";
        document.getElementById("try-again").style.display = "none"; // Hide button
    
        addRandomTile();
        addRandomTile();
        drawBoard();
    }

    addRandomTile();
    addRandomTile();
    drawBoard();
});


//If user has not logged in, prevent access to certain functions
function restrictAccess() {
    const loggedInUser = localStorage.getItem("loggedInUser");

    // Get all protected elements
    const protectedLinks = document.querySelectorAll(".protected-link");
    const sellButton = document.querySelector(".sell-btn");

    if (!loggedInUser) {
        // Disable protected links
        protectedLinks.forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                alert("You must log in to access this feature.");
            });
            link.style.opacity = "0.5"; // Grey out for visibility
        });

        // Disable the sell button
        if (sellButton) {
            sellButton.addEventListener("click", function (event) {
                event.preventDefault();
                alert("You must log in to sell items.");
            });
            sellButton.style.opacity = "0.5";
        }
    }
}


function openPopup() {
    document.getElementById('popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function uploadImage() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert("Please select a file!");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('image', file);

    // Preview the image before upload
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('preview').src = e.target.result;
        document.getElementById('preview').style.display = 'block';
    };
    reader.readAsDataURL(file);

    // Simulating an API call (Replace this with actual API URL)
    fetch('https://your-api-endpoint.com/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => alert("Upload successful: " + JSON.stringify(data)))
    .catch(error => alert("Error uploading: " + error));
}
function toggleDropdown() {
    let menu = document.getElementById("selldropdown-menu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

function selectCategory(name, imgSrc) {
    // Update the button text to show the selected category
    let selectedCategory = document.getElementById("selectedCategory");
    selectedCategory.innerHTML = `<img src="${imgSrc}" class="dropdown-img"> ${name}`;

    // Hide the dropdown menu
    document.getElementById("selldropdown-menu").style.display = "none";
}

// Close dropdown when clicking outside
document.addEventListener("click", function(event) {
    let dropdown = document.getElementById("selldropdown-menu");
    let button = document.querySelector(".sellcategories-toggle-btn");
    if (!button.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = "none";
    }
});