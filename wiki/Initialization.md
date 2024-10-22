# Getting Started - Initialization
In this following tutorial, we'll initialize and run MeaTube on web/android client and API/TCP server platforms.

## Web

**ATTENTION!** 

This instructions will initialize the web application without Back-End Server, that makes meatube not able to read/store data. for launching fullly working web, refer to launching API Server.

### Prerequisites

- Git
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- React

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/Oran-Zafrani/FooTube-Web.git
   cd FooTube-Web
   ```

2. Install dependencies:
   - npm node modules
   ```
   npm install
   ```
   - bootstrap icons
   ```
   npm install bootstrap-icons
   ```

### Running the Project

Start the React development server:
```
npm start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Android

**ATTENTION!** 

This instructions will initialize the android application without Back-End Server, that makes meatube not able to read/store data. for launching fullly working android application, refer to launching API Server, and then launch the android application.

### Prerequisites

- Git
- Android Studio (latest version recommended)
- Java Development Kit (JDK) 11 or later
- Android SDK (will be managed by Android Studio)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/Oran-Zafrani/FooTube-Android.git
   cd FooTube-Android
   ```

2. Open Android Studio

3. Select "Open an Existing Project" and navigate to the cloned repository folder

4. Android Studio will automatically download necessary dependencies and build the project

### Running the Project

1. In Android Studio, select an emulator or connect a physical Android device

2. Click the "Run" button (green play icon) or use the keyboard shortcut (usually Shift + F10)

This will build the app and install it on the selected emulator or device.

## API Server

**ATTENTION!** 

This instructions will initialize the Back-End Server without TCP Server, that makes meatube not able to read/store data. for launching fullly working web, refer to launching TCP Server ant then launch API Server.

**FYI**: The static web client files are included in this project. The web application is accessible directly from the server URL.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Oran-Zafrani/MeaTube-Server.git
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


## TCP Server
**ATTENTION!**

Running TCP Server is available only throught linux OS!

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ofrikas/MeaTube-Server-Multithreaded.git
2. **Navigate to the cpp project directory**:
   ```bash
   cd MeaTube-Server-Multithreaded/Cpp_Server
3. **run the TCP Server:**
The server is already compiled and can be ran without additional actions.

   The TCP Server runs on port 5555, make sure the port is available.
   ```bash
   ./server
After launching the TCP Server you can go back to launch API Server