document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "67932aa4270cfe68c9c3ceec";

    // Form submission event
    document.getElementById("contact-submit").addEventListener("click", function (e) {
        e.preventDefault(); // Prevent the form from submitting the default way

        // Get the form data
        const username = document.getElementById("signupusername").value.trim();
        const email = document.getElementById("signupemail").value.trim();
        const password = document.getElementById("signuppassword").value.trim();

        // Validate password length
        if (password.length < 8) {
            alert("Password must be at least 8 characters long!");
            return; // Stop submission
        }

        // Function to check if email or username exists in RestDB
        function checkExistingRecords() {
            const filter = `{"$or":[{"email":"${email}"},{"username":"${username}"}]}`;
            const settings = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY,
                    "Cache-Control": "no-cache",
                },
            };

            return fetch(`https://mokeselldb-1246.restdb.io/rest/accounts?q=${encodeURIComponent(filter)}`, settings)
                .then((response) => response.json());
        }

        // Perform the check and register if unique
        checkExistingRecords()
            .then((data) => {
                if (data.length > 0) {
                    // Username or email already exists
                    alert("Username or email is already taken. Please choose another.");
                } else {
                    // Create an object to send to the database
                    const jsondata = {
                        email: email,
                        username: username,
                        password: password,
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
                    fetch("https://mokeselldb-1246.restdb.io/rest/accounts", settings)
                        .then((response) => response.json())
                        .then((data) => {
                            console.log("Data successfully sent:", data);
                            alert("Account registered successfully!");
                            document.getElementById("add-contact-form").reset(); // Clear form fields
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                            alert("There was an error creating your account."); // Optional: Show error message
                        });
                }
            })
            .catch((error) => {
                console.error("Error during uniqueness check:", error);
                alert("Unable to validate uniqueness at the moment. Please try again later.");
            });
    });

    // Modal handling and validation logic
    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");

    const openModalBtn = document.getElementById("openModalBtn");
    const createAccountLink = document.getElementById("createAccountLink");
    const loginAccountLink = document.getElementById("loginAccountLink");

    const closeLoginModalBtn = document.getElementById("closeModalBtn");
    const closeRegisterModalBtn = document.getElementById("closeRegisterModalBtn");

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

    const registerForm = document.querySelector("#registerModal form");
    const passwordField = document.getElementById("register-password");
    const confirmPasswordField = document.getElementById("confirm-password");
    const errorMessage = document.createElement("p");
    errorMessage.style.color = "red";
    registerForm.appendChild(errorMessage);

    registerForm.addEventListener("submit", (event) => {
        errorMessage.textContent = "";

        if (passwordField.value !== confirmPasswordField.value) {
            errorMessage.textContent = "Passwords do not match!";
            event.preventDefault();
            return;
        }

        if (passwordField.value.length < 8) {
            errorMessage.textContent = "Password must be at least 8 characters long!";
            event.preventDefault();
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
