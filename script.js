let listing = {};
document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "67a7219f4d87443a97827ffe";

    checkLoginStatus();

    const contactSubmit = document.getElementById("contact-submit");
    if (contactSubmit) {
        contactSubmit.addEventListener("click", async function (e) {
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
    
                const response = await fetch(`https://mokeselldb3-816e.restdb.io/rest/accounts?q=${encodeURIComponent(filter)}`, settings);
                const data = await response.json();
                return data;
            }
    
            // Perform the check and register if unique
            try {
                const data = await checkExistingRecords();
                if (data.length > 0) {
                    let usernameExists = data.some(user => user.username === username);
                    let emailExists = data.some(user => user.email === email);
                    if (usernameExists) {
                        alert("Username is already taken. Please choose another.");
                    } else if (emailExists) {
                        alert("Email is already taken. Please choose another.");
                    }
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
                        profilePicture: "Images/Default_pfp.jpg", // Default profile picture URL
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
                    const response = await fetch("https://mokeselldb3-816e.restdb.io/rest/accounts", settings);
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
    }
    
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
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent form submission
    
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
    
            try {
                const filter = `{"email": "${email}"}`;
                const response = await fetch(`https://mokeselldb3-816e.restdb.io/rest/accounts?q=${encodeURIComponent(filter)}`, {
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
                localStorage.setItem("profileImageUrl", user.profilePicture); // Store profile picture URL
                document.getElementById("loginSuccessModal").style.display = "block";
                setTimeout(function () {
                    document.getElementById("loginModal").style.display = "none"; // Hide the login modal
                    window.location.href = "index.html"; // Redirect to main page
                }, 3000);
    
            } catch (error) {
                alert("Error connecting to server. Please try again.");
            }
        });
    }

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

    const userEmail = localStorage.getItem("loggedInUser"); // Get email from localStorage

    if (userEmail) {
        const url = `https://mokeselldb3-816e.restdb.io/rest/accounts?q={"email":"${userEmail}"}`;
    
        fetch(url, {
            method: "GET",
            headers: {
                "x-apikey": APIKEY,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const user = data[0]; // Assuming the user is in the first element
                
                // Check if the elements exist before trying to set their properties
                const userNameElement = document.getElementById("userName");
                const profilePicElement = document.getElementById("profilePic");
    
                if (userNameElement) {
                    userNameElement.textContent = user.username;
                }
                
                if (profilePicElement) {
                    profilePicElement.src = user.profilePicture
                }
            } else {
                console.log("User not found");
            }
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
        });
    }
    
    //listings
    const RESTDB_COLLECTION_URL = "https://mokeselldb3-816e.restdb.io/rest/listings";
    
    // Image preview handling
    let fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const preview = document.getElementById('preview');
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                preview.style.display = 'none';
            }
        });
    };

    // Form submission handler
    let listingForm = document.getElementById("listingForm");
    if (listingForm) {
        listingForm.addEventListener("submit", async function (event) {
            event.preventDefault();  // Prevent default form submission
    
            let listingName = document.getElementById("listingname").value.trim();
            let description = document.getElementById("description").value.trim();
            let price = parseFloat(document.getElementById("price").value) || 0;
            let selectedCategory = listing.category;
            
            
            // Ensure an image is uploaded before submission
            if (!uploadedImageUrl) {
                alert("Please upload an image before submitting.");
                return;  // Stop submission if no image is uploaded
            }
    
            // Ensure a category is selected (not default "Categories")
            if (selectedCategory === "Categories") {
                alert("Please select a category before submitting.");
                return;  // Stop submission if no category is selected
            }
    
            try {
                // Fetch the last listing ID to generate a new unique ID
                const response = await fetch(`${RESTDB_COLLECTION_URL}?max=1&sort=listingID&dir=-1`, {
                    method: "GET",
                    headers: { "x-apikey": APIKEY, "Content-Type": "application/json" }
                });
    
                let data = await response.json();
                let newListingID = data.length > 0 ? data[0].listingID + 1 : 1;
                let createdDate = new Date().toLocaleString("en-SG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Singapore"
                });
                
                // Construct new listing object
                let newListing = {
                    listingID: newListingID,
                    title: listingName,
                    description: description,
                    price: price,
                    sellerEmail: localStorage.getItem("loggedInUser"), // Ensure user is logged in
                    status: "available",
                    bumpStatus: "none",
                    createdOn: createdDate,
                    image: [uploadedImageUrl],  // Image URL goes here
                    category: selectedCategory
                };
    
                // Submit listing to RestDB
                let postResponse = await fetch(RESTDB_COLLECTION_URL, {
                    method: "POST",
                    headers: { "x-apikey": APIKEY, "Content-Type": "application/json" },
                    body: JSON.stringify(newListing)
                });
    
                if (postResponse.ok) {
                    alert("Listing posted successfully!");
                    window.location.reload();
                } else {
                    throw new Error(`Failed to post: ${postResponse.statusText}`);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Error posting listing: " + error.message);
            }
        });
    }
    let container = document.getElementById("listingcontainer");
    if (container) {
        fetchListings();
    }
    async function fetchListings() {
        try {
            let response = await fetch("https://mokeselldb3-816e.restdb.io/rest/listings", {
                method: "GET",
                headers: { "x-apikey": APIKEY, "Content-Type": "application/json" }
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch listings: ${response.statusText}`);
            }
    
            let listings = await response.json();
    
            displayListings(listings); // Call function to display listings
        } catch (error) {
            console.error("Error:", error);
            alert("Error fetching listings: " + error.message);
        }
    }

    async function displayListings(listings) {
    // Get the container element where listings will be rendered
    const listingContainer = document.getElementById("listingcontainer");
    if (!listingContainer) {
        console.error("Listing container not found.");
        return;
    }

    // Clear any previous content
    listingContainer.innerHTML = '';

    // Loop through each listing
    for (const listing of listings) {
        try {
            // Build the query to fetch user details based on sellerEmail
            const emailQuery = encodeURIComponent(`{"email": "${listing.sellerEmail}"}`);
            const userResponse = await fetch(`https://mokeselldb3-816e.restdb.io/rest/accounts?q=${emailQuery}`, {
                method: "GET",
                headers: { 
                    "x-apikey": APIKEY, 
                    "Content-Type": "application/json" 
                },
                mode: "cors"
            });
            
            const userData = await userResponse.json();
            const user = userData[0] || {};
            
            // Use the user profilePicture if available; otherwise, use a default (ensure correct relative path and case)
            const profilePicture = (user.profilePicture && user.profilePicture.trim() !== "") 
                ? user.profilePicture 
                : "images/default_pfp.jpg";  
            const sellerUsername = user.username || "Unknown User";
            
            // Get the listing image (use a placeholder if missing)
            const listingImage = (listing.image && listing.image.length > 0) 
                ? listing.image[0] 
                : "https://dummyimage.com/220x220/cccccc/ffffff&text=No+Image";
            const timeAgo = formatTimeAgo(listing.createdOn);

            const container = document.createElement("a");
            container.className = "container";
            container.href = `listing-details.html?id=${listing._id}`;
            container.style.textDecoration = "none"; // Remove underline

            // Create the Profile + Username section (which will appear at the top)
            const userInfoDiv = document.createElement("div");
            userInfoDiv.className = "user-info";
            userInfoDiv.innerHTML = `
                <div class="profilepicture" style="
                    background-image: url('${profilePicture}');
                    background-size: cover;
                    background-position: center;
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    display: inline-block;
                    ">
                </div>
                <div class="username" style="display: inline-block; vertical-align: top; margin-left: 10px;">
                    <b>${sellerUsername}</b><br>
                    <div class="time-ago" style="font-size: small; font-weight: 100;">${timeAgo}</div>
                </div>
            `;

            // Create the Listing Image section
            const listingBox = document.createElement("div");
            listingBox.className = "listingbox";
            listingBox.style.backgroundImage = `url('${listingImage}')`;
            listingBox.style.backgroundSize = "cover";
            listingBox.style.backgroundPosition = "center";
            // Ensure listingBox dimensions match your design (adjust if needed)
            listingBox.style.width = "230px";
            listingBox.style.height = "230px";
            listingBox.style.marginTop = "5px";
            listingBox.style.borderRadius = "5px";

            // Create the Item Details section (listing title and price)
            const priceDiv = document.createElement("div");
            priceDiv.className = "itemmoney";
            priceDiv.innerHTML = `
                <div class="listing-title">${listing.title || "No Title"}</div>
                <div class="price" style="font-size: small; font-weight: 100;">$${listing.price ? listing.price.toFixed(2) : "0.00"}</div>
            `;

            container.appendChild(userInfoDiv);
            container.appendChild(listingBox);
            container.appendChild(priceDiv);

            listingContainer.appendChild(container);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }};
    

    // Get the listing ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get("id");

    // Fetch listing details
    async function fetchListingDetails() {
        try {
            const response = await fetch(`https://mokeselldb3-816e.restdb.io/rest/listings/${listingId}`, {
                method: "GET",
                headers: { "x-apikey": APIKEY }
            });

            const listing = await response.json();

            const emailQuery = encodeURIComponent(`{"email": "${listing.sellerEmail}"}`);
            const userResponse = await fetch(`https://mokeselldb3-816e.restdb.io/rest/accounts?q=${emailQuery}`, {
                method: "GET",
                headers: { 
                    "x-apikey": APIKEY, 
                    "Content-Type": "application/json" 
                },
                mode: "cors"
            });
            
            const userData = await userResponse.json();
            const user = userData[0] || {};
            
            
            // Display listing details
            document.getElementById("listing-title").innerText = listing.title;
            document.getElementById("listing-price").innerText = `$${listing.price?.toFixed(2) || "0.00"}`;
            document.getElementById("listing-image").style.backgroundImage = `url('${listing.image?.[0]}')`;
            document.getElementById("listing-time").innerText = `${formatTimeAgo(listing.createdOn)} by ${user.username}`;
            document.getElementById("listing-description").innerText = listing.description || "No description provided.";
        } catch (error) {
            console.error("Error fetching listing details:", error);
        }
    }

    // Call function to load listing details
    fetchListingDetails();

    
    
});


let searchBtn = document.getElementById("search-btn")
if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        const searchQuery = document.getElementById("search-bar").value;
        if (searchQuery) {
            alert("Searching for: " + searchQuery);
        } else {
            alert("Please enter something to search.");
        }
    });
    
}

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

function sellToggleMenu() {
    const sellMenu = document.getElementById("sellDropdownMenu");
    sellMenu.style.display = sellMenu.style.display === "block" ? "none" : "block";
}

const sellCategoriesToggleBtn = document.querySelector(".sellcategories-toggle-btn");
if (sellCategoriesToggleBtn) {
    sellCategoriesToggleBtn.addEventListener("click", sellToggleMenu);
}

function selectCategory(name, imgSrc) {
    // Update the button text to show the selected category
    let selectedCategory = document.getElementById("selectedCategory");
    selectedCategory.innerHTML = `<img src="${imgSrc}" class="dropdown-img"> ${name}`;  // Update button text with category name and image
    
    // Update the 'listing' object with the selected category
    listing.category = name; // Ensure 'listing' is defined before using this

    // Close the dropdown menu
    document.getElementById("sellDropdownMenu").style.display = "none";
}


function goBack() {
    window.history.back(); // This goes back to the previous page
};

    // Cloudinary upload function (triggered by UPLOAD BUTTON)
    async function uploadImageToCloudinary() {
        const fileInput = document.getElementById('file');
        const file = fileInput.files[0];


        if (!file) {
            alert('Please select an image first.');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'MokeSell');
        
        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dciiczqs0/image/upload', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            if (data.secure_url) {
                uploadedImageUrl = data.secure_url;
                alert('Image uploaded successfully!');
                 // Replace the seller-btn content with the uploaded image
                const sellerBtn = document.getElementById("seller-btn");
                sellerBtn.innerHTML = `<img src="${uploadedImageUrl}" style="height: 200px; width: auto; border-radius: 10px;">`;

                closePopup(); // Close the upload window
            } else {
                throw new Error(data.error.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Image upload failed: ' + error.message);
        }
    }

    function formatTimeAgo(timestamp) {
        let createdTime = new Date(timestamp);
        let now = new Date();
        let diff = Math.floor((now - createdTime) / 1000); // Difference in seconds
    
        if (diff < 60) return `${diff} seconds ago`;
        let minutes = Math.floor(diff / 60);
        if (minutes < 60) return `${minutes} minutes ago`;
        let hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        let days = Math.floor(hours / 24);
        return `${days} days ago`;
    }
    
    function openModal(imageUrl) {
        const modal = document.getElementById("imageModal");
        const modalImage = document.getElementById("modalImage");
    
        // Extract URL from background-image (removes `url("")` wrapping)
        imageUrl = imageUrl.replace('url("', '').replace('")', '');
        
        modalImage.src = imageUrl; // Set the modal image source
        modal.style.display = "flex"; // Show modal
    }
    
    function closeModal() {
        document.getElementById("imageModal").style.display = "none";
    }
   
    async function startChat() {
        const listingId = new URLSearchParams(window.location.search).get("id");
        const response = await fetch(`https://mokeselldb3-816e.restdb.io/rest/listings/${listingId}`, {
            method: "GET",
            headers: { "x-apikey": "67a7219f4d87443a97827ffe" }
        });
        const listing = await response.json();
        const emailQuery = encodeURIComponent(`{"email": "${listing.sellerEmail}"}`);
            const userResponse = await fetch(`https://mokeselldb3-816e.restdb.io/rest/accounts?q=${emailQuery}`, {
                method: "GET",
                headers: { 
                    "x-apikey": "67a7219f4d87443a97827ffe", 
                    "Content-Type": "application/json" 
                },
                mode: "cors"
            });
            
            const userData = await userResponse.json();
            const user = userData[0] || {};

        const sellerName = user.innerText;
    
        // Redirect to a chat page with seller info (or open chat modal)
        window.location.href = `chat.html?seller=${encodeURIComponent(sellerName)}&listing=${listingId}`;
    }
    
