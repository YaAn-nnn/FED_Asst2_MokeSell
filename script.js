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
                const result = await response.json();
                console.log("Data successfully sent:", result);
                alert("Account registered successfully!");
                document.getElementById("add-contact-form").reset(); // Clear form fields
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
            alert("Login successful!");
            window.location.href = "index.html"; // Redirect to main page

        } catch (error) {
            console.error("Login error:", error);
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

    // Handle logout
    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
        logoutLink.addEventListener("click", function (event) {
            event.preventDefault();
            // Clear the session data (e.g., localStorage or sessionStorage)
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("profileImageUrl");
            alert("Logged out successfully!");
            window.location.href = "index.html"; // Redirect to the homepage or login page
        });
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

const farmgridContainer = document.getElementById("farmgrid");

for (let i = 1; i <= 25; i++) {
    const farmbox = document.createElement("div");
    farmbox.classList.add("farmbox");
    farmgridContainer.appendChild(farmbox);
}
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


    function updateScore(points) {
        score += points;
        scoreElement.textContent = score;
        if (score > bestScore) {
            bestScore = score;
            bestScoreElement.textContent = bestScore;
            localStorage.setItem("bestScore", bestScore);
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
    }

    document.addEventListener("keydown", (event) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
            moveBoard(event.key);
        }
    });

    addRandomTile();
    addRandomTile();
    drawBoard();
});
