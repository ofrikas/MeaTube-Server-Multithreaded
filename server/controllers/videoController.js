const Comment = require("../models/comments");
const Like = require("../models/likes");
const User = require("../models/user");
const Video = require("../models/video");

// Import any necessary modules or dependencies

// Define the videoController object
const videoController = {};

// Define the GET /api/videos/:id route handler
videoController.getVideoById = (req, res) => {
    // Get the video ID from the request parameters
    const id = req.params.id;
    // Find the video by ID
    Video.findVideoById(id)
        .then(video => {
            // If the video is not found
            if (!video) {
                // Return a 404 Not Found response
                return res.status(404).json({ message: 'Video not found' });
            }

            const videoLikes = Like.findLikesByVideoId(id);
            const videoDislikes = Like.findDisLikesByVideoId(id);
            const Comments = Comment.findCommentsByVideoId(id);
            const user = User.findUserByUsername(video.username);

            //waiting for all promises to resolve
            Promise.all([videoLikes, videoDislikes, Comments, user])
                .then((values) => {
                    //assigning the values to the video object
                    video._doc.likes = values[0].length || 0;
                    video._doc.dislikes = values[1].length || 0;
                    video._doc.comments = [...values[2]] || [];
                    video._doc.channel = values[3].displayName;

                    if(req.userData) {
                        video._doc.userLiked = values[0].some(like => like.username === req.userData.username);
                        video._doc.userDisliked = values[1].some(dislike => dislike.username === req.userData.username);
                    }
                    // Return the video as JSON
                    res.json(video);
                })
        })
        .catch(error => {
            // Return a 500 Internal Server Error response
            res.status(500).json({ message: error.message });
        });
};

// Define the POST /api/videos route handler
videoController.addVideo = async (req, res) => {
    // Create a new video object with the data from the request body
    req.body.username = req.userData.username;
    req.body.channel = req.userData.displayName;
    try {
        await Video.addVideo(req.body).then((newVideo) => {
        res.status(201).json(newVideo)});
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
};

// Controller function to get the top 20 videos in random order
videoController.getTop20Videos = async (req, res) => {
    try {
        const videos = await Video.getTop20Videos();
        const videoPromises = videos.map(async video => {
            const userDetail = await User.findUserByUsername(video.username);
            video.channel = userDetail.displayName;
            return video;
        });

        const updatedVideos = await Promise.all(videoPromises);
        res.json(updatedVideos);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller function to get the top 20 videos in random order
videoController.getResultsBySearch = async (req, res) => {
    try {
        const videos = await Video.findVideosBySearch(req.query.search_text);
        videos.forEach(video => {
            video.channel = User.findUserByUsername(video.username).displayName;
        });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

videoController.getVideosByUsername = async (req, res) => {
    try {
        const userDetails = await User.findUserByUsername(req.params.username);
        const videos = await Video.getVideosByUsername(req.params.username).then((videos) => {
        videos.forEach(video => {
            video.channel = userDetails.displayName;
        });
        return videos;
    });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
// Define the DELETE /api/videos/:id route handler
videoController.deleteVideoById = async (req, res) => {
        try {    
        // Extract the videoId from the URL parameters
        const videoId = req.params.id; 
        const reqUsername = req.userData.username;

        // Call the static method to delete the video and associated comments
        const deletedVideo = await Video.deleteVideoById(videoId, reqUsername);

        if (!deletedVideo) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.status(200).json({ message: 'Video and associated comments deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Define the UPDATE /api/videos/:id route handler
videoController.updateVideo = async (req, res) => {
    try {
        // Extract the video ID from the URL parameters
        const videoId = req.params.id;
        const reqUsername = req.userData.username;

        // Find the video by _id and update it with the data from the request body
        const updatedVideo = await Video.updateVideoById(videoId, req.body, reqUsername)

        if (!updatedVideo) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.status(200).json(updatedVideo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// Export the videoController object
module.exports = videoController;