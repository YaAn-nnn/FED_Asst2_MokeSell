# Mokesell - A gamified marketplace

Our marketplace allows people to sell whatever they no longer want or need at their desired prices. Buyers can chat with the sellers to either negotiate the price or organise a meetup to obtain the product. This allows for easy communication between both parties so that meetups and selling can happen quickly and easily. We also have a game that gives vouchers to our users to help them sell their products. 

With Mokesell, you will never have to worry about having to throw away barely used items you have because there could always be someone who wants it. This helps to reduce waste and carbon dioxide used to make the item as they are reused and given another chance at "life". This can also help small local businesses start up without having to make a whole website by themselves and just seeing the interest that their products get. 

# Design Process

This website was made for people who have items they went to get rid of but don't want to throw away, maybe because it was barely used or it is new but they decided they do not want it anymore. It's also for people who prefer to buy second hand items because they cannot afford buying a completely new product, so they can come to our website and find people who want to sell a product they want. This can also help artists to take commissions or kickstart small businesses, like jewellery or trinket making.

Our project can help them to find interested buyers who can look through each category to see what product catches their eye. Buyers can also look into the seller's profile to see any other products they are selling and continue browsing through. 

Figma link - https://www.figma.com/design/i1yE4cbTLNxjG9KM1hL8Q2/FED-Asst-2?node-id=0-1&t=rAICVt7YVDQy8t6Q-1

# Design Rationale

Primary Color: White
- Provides a clean, modern backdrop for clarity and readability.
- Creates a professional and minimalistic aesthetic.

Accent Color: #5271FF (Blue)
- Used for buttons, links, and interactive elements.
- Conveys trust, reliability, and enhances brand recognition.
- Draws attention to key actions.

Simplicity and Straightforwardness
- Clean and easy-to-navigate layout.
- Focuses on content and functionality, avoiding clutter.

Hover Effects
- Enhances user interactivity by providing feedback.
- Improves the overall user experience with subtle transitions.

Visual Hierarchy
- White as a neutral background and blue for emphasis on key elements.
- Ensures a cohesive and easy-to-follow layout.

Brand Confidence
- Blue, a color associated with security, instills trust in users.

User-Centric Experience
- Designed for accessibility, clarity, and intuitive navigation.
- Smooth interactions for a pleasant user journey.

# Features

### Existing Features

Sell listing - It allows users to upload a picture of the product they wish to sell and picka  category that the product will fall under. User also is required to fill out the name of the product, the description of the product, such as the dimensions, size, colour, whether it was well used or barely used, and whatever the user sees fit. The price is set by the user as well, the user only needs to enter in the float and not the dollar sign in front as the amount the user inputs will be converted into currency via our program. 

Login - A popup modal will allow the user to either register a new account or log into one that is already in our database. In register, the user has to fill out their username, email, password and confirming their password. For logging in, user has to fill in their email and their password, if it is found in our database, user will be logged in, if not user will have to redo the log in form.

Game - Our game allows users to play and gain points. Once the user hits a certain number of points (eg, 1000 / 5000) the game will send an alert informing the user that they have won a free bump for their listing. The user can keep playing from there and at every interval of 5000 points, the user will get a free bump. 

Categories - This allows users to find products under a certain category by selecting their desired category. 

Listing details - By clicking on one of the listings that you are intereste din, you can get a more indepth view of the product. In the main page, you are only able to see the listings, their prices and when it was posted by who but when you click on it, it gives the full description of the product and allows you to chat with the seller if you are interested in buying the product.

User profile - User can see their own profile and listings by clicking on their profile icon and clicking on "Profile".

Logout - By clicking on the user's profile and clicking "Log out", the program will double check on whether user wants to log out or not. Once user clicks yes again, user will be successfully logged out. Once logged out, user will no longer have access to sell, games, following and favourites.

### Features Left to Implement

Seller profile - User can see the seller's profile by clicking on the seller's username on listing details, which will then lead to a page where user can see all the seller's listing and choose whether they want to follow them.

Following - User can see the listings of the people the user followed.

Favourites - User can see the listings which has been liked before.

Bumping Listings - User can get the voucher from playing the game to get a discount on listing bumps. Once the listing is bumped, it will be prioritized on the listings page to gain more viewers.

Settings - User can edit their profile, which can change their username, profile picture and password.

# Technologies Used

RestDB 
The project uses RestDB as our database to keep all our api data, for example, listings (photo, sellerEmail, listingID, title, createdON, description, price etc.) and accounts (username, useremail, profile picture and password). Using RestDB, we could fetch the data from there to make the user profile page and listing detail page.
https://restdb.io/

Github
The project uses github so that we can collate our codes and change it. With github, we can check the commits to see the generalisation of what has been done and to check what changes has been done to the code when we click into each of the commits.
https://github.com/

Figma
The project uses Figma to design our website and brainstorm how to connect pages and just the overall look. We can use it scroll to see how the listings would look and how the overall website would be planned out, as well as the different buttons and divisions needed to make parts such as the navigation bar.
https://www.figma.com/

LottieFiles
The project uses Lottie animations for the success message once user is successfully loggen in or logged out.
https://lottiefiles.com/

Cloudinary
The project uses cloudinary to be able to upload photos that were input by the user by getting the image url and uploading it into our database and on the website.
https://cloudinary.com/

# Assistive AI
Listing API: Deepseek was used to help with the implementation of the Listing API.
![a9e4a7ff-462b-47f5-9c41-974055196cd4](https://github.com/user-attachments/assets/c35f37cb-1067-41e6-8c96-7bcb95b14885)

Chat API: Deepseek was used to help with the implementation of the Chat API
![Screenshot 2025-02-09 181419](https://github.com/user-attachments/assets/6ca75e24-a2cc-49e7-988d-dd3424faffa9)


# Testing
For any scenarios that have not been automated, test the user stories manually and provide as much detail as is relevant. A particularly useful form for describing your testing process is via scenarios, such as:

Login:
1. Click the "Login" button
2. If unregistered, click "Register" and enter in the required details
3. If registered, enter in the required details, test if the success message appears

Logout
1. Click the Profile 

2. Click "Logout"
3. Affirm that you want to log out and check for a success message

Listing
1. Click Upload photo
2. A pop up should appear where you can enter your files and choose a photo
3. Choose a category
4. Enter title, description and price
5. If posted successfullly, a success message should appear at the top

Search bar
1. Click on the search bar
2. Type in whatever you are looking for
3. The listings that are similar to what has been searched should appear

Categories
1. Click on Categories
2. Choose desired category
3. The listings under that category should appear

# Credits

Media
The photos used in this site were obtained from flaticon.

Acknowledgements
We received inspiration for this project from Carousell
