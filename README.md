# MeaTube-Server
This project implements a dynamic web server for an online video-sharing platform. The server allows users to upload videos, manage their profiles, and interact with video content through likes, comments, and more. It provides a RESTful API and uses MongoDB for data storage.

## Table of Contents

1. [Installation](#installation)
2. [API Endpoints](#api-endpoints)
3. [Features](#features)
4. [Tech Stack](#tech-stack)

---

## Installation

1. **Clone the repository**:
   ```bash
   https://github.com/Oran-Zafrani/MeaTube-Server.git
2. **Navigate to the project directory**:
   ```bash
   cd MeaTube-Server
3. **Install dependencies:**
   ```bash
   npm install
4. **Set up MongoDB Locally**

   Ensure MongoDB is installed and running on your local machine. Follow these steps to initialize your local database:
   1. Create a new MongoDB connection:
      - Name the connection 'MeaTubeDB'
   2. Note your connection string:
      - The default is typically `mongodb://localhost:27017/MeaTubeDB`
   3. Configure your environment:
      - Create a `.env` file in the project's root directory
      - Add the following line to the `.env` file, replacing `<your-connection-string>` with your actual MongoDB connection string:
      ```bash
      MONGODB_URI=<your-connection-string>
      ```
      Example:
      ```bash
      MONGODB_URI=mongodb://localhost:27017/MeaTubeDB
5. **Set JWT secret**
   Set the JWT secret in your `.env` file.
   ```bash
   JWT_SECRET=mySuperSecretKey
6. **Set server port (Optional)**
   Set the server port in your `.env` file, default is port 8080:
   ```bash
   PORT=1234
8. **Run the server:**
   ```bash
   npm start
9. **Add the initial content to MeaTubeDB:**
   After running the server, you should get an output in the terminal `connected to MongoDB` once a connection has been successfully made to MongoDB.
   - Go to the local MongoDB on your PC, you should have the MeaTubeDB database initialized with four collections: comments, likes, users, and videos.
   
      ![image](https://github.com/user-attachments/assets/9a0fa6f3-784b-422b-b251-bdf3da9ff652)
   - Go to the [MeaTubeDB](./MeaTubeDB) folder in the repository.
   - Import `MeaTubeDB.comments.json` to the 'comments' collection.
   - Import `MeaTubeDB.users.json` to the 'users' collection.
   - Import `MeaTubeDB.videos.json` to the 'videos' collection.
   - Restart the server.
   
     The server will be running locally at http://localhost:8080. The API serves endpoints for video and user interactions, supporting CRUD operations for videos and users.

## API Endpoints

### User Routes
- `GET /users/:id`: Get details about a user by their ID
- `GET /users/username/:username`: Get details about a user by their username
- `GET /users/channel/:channelname`: Get details about a user by their channel name
- `POST /users`: Create a new user
- `POST /login`: Authenticate a user and return a JWT token
- `PUT /users/:username`: Update details of a user (protected route, requires authentication)
- `DELETE /users/:username`: Delete a user (protected route, requires authentication)

### Video Routes
- `GET /videos/:id`: Get details of a specific video by its ID (requires weak authentication)
- `GET /videos`: Get a list of the top 20 videos, sorted randomly
- `GET /search`: Search for videos by keyword
- `GET /videos/username/:username`: Get a list of all videos uploaded by a specific user
- `POST /videos`: Add a new video (protected route, requires authentication)
- `PUT /videos/:id`: Update details of a specific video (protected route, requires authentication)
- `DELETE /videos/:id`: Delete a specific video by ID (protected route, requires authentication)

### Like Routes
- `GET /videos/:id/likes`: Get the number of likes for a specific video (protected route)
- `GET /videos/:id/dislikes`: Get the number of dislikes for a specific video (protected route)
- `POST /videos/:id/likes`: Like a specific video (protected route)
- `POST /videos/:id/dislikes`: Dislike a specific video (protected route)
- `DELETE /videos/:id/likes`: Remove a like from a video (protected route)
- `DELETE /videos/:id/dislikes`: Remove a dislike from a video (protected route)

### Comment Routes
- `GET /videos/:id/comments`: Get all comments for a specific video (protected route)
- `POST /videos/:id/comments`: Add a comment to a video (protected route)
- `PUT /comments/:id`: Update a comment by its ID (protected route)
- `DELETE /comments/:id`: Delete a comment by its ID (protected route)

## Features
- Video Uploads: Users can upload, view, and manage videos.
- User Authentication: Secure login using JWT (JSON Web Tokens).
- RESTful API: Exposed API for managing users and videos.
- Dynamic Video List: Top videos are displayed in random order.
- Likes and Comments: Users can like/dislike videos and add comments.
   
## Tech Stack
- Frontend: React (HTML, CSS, JavaScript)
- Backend: Node.js, Express, Mongoose.
- Database: MongoDB (for data persistence)
- API: RESTful API built with Express
- Project Management: [Jira Platform](https://sbar1998.atlassian.net/jira/software/projects/MTS/boards/4)

## Instructions to Adv. System Programming Course Checker 
- The final src codes are wrapped under `releases/**` branches. Each one of them refers to a different part of the project.
- The static client files are included within this project. The web application is accessible directly from the server URL.
- You can also run the web project from the [MeaTube-Web](https://github.com/Oran-Zafrani/MeaTube-Web) repository simultaneously.
   
# Team:
- Ofri Kastenbaum
- Oran Zafrani
- Bar Shwartz
