const Like = require("../models/likes");

// Import any necessary modules or dependencies

// Define the videoController object
const likesController = {};

// Define the GET /api/videos/:id/likes route handler
likesController.getLikesByVideoId = (req, res) => {
    // Get the video ID from the request parameters
    const videoId = req.params.id;
    
    // Find the likes by video_id
    Like.findLikesByVideoId(videoId)
        .then(likes => {
            // If no likes are found
            if (likes.length === 0) {
                return res.status(404).json({ message: 'No likes found for this video' });
            }
            // Return the likes as JSON
            res.status(200).json(likes);
        })
        .catch(error => {
            // Return a 500 Internal Server Error response
            res.status(500).json({ message: error.message });
        });
};

// Define the GET /api/videos/:id/dislikes route handler
likesController.getDisLikesByVideoId = (req, res) => {
    // Get the video ID from the request parameters
    const videoId = req.params.id;
    
    // Find the dislikes by video_id
    Like.findDisLikesByVideoId(videoId)
        .then(dislikes => {
            // If no dislikes are found
            if (dislikes.length === 0) {
                return res.status(404).json({ message: 'No dislikes found for this video' });
            }
            // Return the dislikes as JSON
            res.status(200).json(dislikes);
        })
        .catch(error => {
            // Return a 500 Internal Server Error response
            res.status(500).json({ message: error.message });
        });
};

// Define the POST /api/videos/:id/likes route handler
likesController.addLike = async (req, res) => {
    // Create a new Like object with the data from the request body
    try {
        // Extract the video_id from the URL parameters
        const videoId = req.params.id;
        const username = req.userData.username; // Assuming username came from JWT token
        
        // Call the static method to add the like
        const newLike = await Like.addLike(username, videoId);
        res.status(201).json(newLike);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
};

// Define the POST /api/videos/:id/dislikes route handler
likesController.addDisLike = async (req, res) => {
    // Create a new DisLike object with the data from the request body
    try {
        // Extract the video_id from the URL parameters
        const videoId = req.params.id;
        const username = req.userData.username; // Assuming username came from JWT token

        // Call the static method to add the like
        const newLike = await Like.addDisLike(username, videoId);
        res.status(201).json(newLike);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
};


// Define the DELETE /api/videos/:id/likes route handler
likesController.deleteLike = async (req, res) => {
    try {
        // Extract the video_id from the URL parameters
        const videoId = req.params.id;
        const userId = req.body.user_id; // Assuming user_id is sent in the request body

        // Call the static method to delete the like
        const deletedLike = await Like.deleteLike(userId, videoId);
        
        if (!deletedLike) {
            return res.status(404).json({ message: 'Like not found' });
        }

        res.status(200).json({ message: 'Like deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Define the DELETE /api/videos/:id/dislikes route handler
likesController.deleteDisLike = async (req, res) => {
    try {
        // Extract the video_id from the URL parameters
        const videoId = req.params.id;
        const userId = req.body.user_id; // Assuming user_id is sent in the request body

        // Call the static method to delete the like
        const deletedLike = await Like.deleteDisLike(userId, videoId);
        
        if (!deletedLike) {
            return res.status(404).json({ message: 'disLike not found' });
        }

        res.status(200).json({ message: 'disLike deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// DELETE all likes
likesController.deleteAllLikes = async (req, res) => {
    try {
        // Extract the video_id from the URL parameters
        const videoId = req.params.id;

        // Call the static method to delete the likes
        const deletedLikes = await Like.deletAllLikes(videoId);
        
        if (!deletedLikes) {
            return res.status(404).json({ message: 'Likes not found in this video' });
        }

        res.status(200).json({ message: 'All likes are deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// DELETE all dislikes
likesController.deleteAllDisLikes = async (req, res) => {
    try {
        // Extract the video_id from the URL parameters
        const videoId = req.params.id;

        // Call the static method to delete the dislikes
        const deletedLikes = await Like.deleteAllDisLikes(videoId);
        
        if (!deletedLikes) {
            return res.status(404).json({ message: 'Dislikes not found in this video' });
        }

        res.status(200).json({ message: 'All dislikes are deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Export the videoController object
module.exports = likesController;