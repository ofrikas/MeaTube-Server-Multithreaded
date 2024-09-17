// Import the Comment model
const Comment = require("../models/comments");

// Define the commentsController object
const commentsController = {};

// Define the GET /api/comments/:id route handler
commentsController.getCommentsByVideoId = (req, res) => {
    const videoId = req.params.id;

    Comment.findCommentsByVideoId(videoId)
        .then(comments => {
            if (comments.length === 0) {
                return res.status(404).json({ message: 'No comments found for this commentId' });
            }
            res.status(200).json(comments);
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
};

// Define the DELETE /api/videos/:id/ route handler
commentsController.deleteComment = async (req, res) => {
    try {
        // Extract the _id from the URL parameters
        const commentId = req.params.id;

        // Call the static method to delete the comment
        const deletedComment = await Comment.deleteComment(commentId);
        
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Define the POST /api/videos/:id/comments route handler
commentsController.AddComment = async (req, res) => {
    try {
        // Extract the video_id from the URL parameters
        const videoId = req.params.id;
        req.body.userName = req.userData.username;
        // Call the static method to add the comment
        const newComment = await Comment.addComment(req.body, videoId);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Define the UPDATE /api/comments/:id route handler
commentsController.updateComment = async (req, res) => {
    try {
        // Extract the comment ID from the URL parameters
        const commentId = req.params.id;

        // Find the comment by _id and update it with the data from the request body
        const updatedComment = await Comment.findByIdAndUpdate(commentId, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run schema validations on update
        });

        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Define the DELETE all comments from video with videoId route handler
commentsController.deleteAllCommentsByVideoId = async (req, res) => {
    try {
        // Extract the _id from the URL parameters
        const videoId = req.params.id;

        // Call the static method to delete the comments from the video
        const deletedComment = await Comment.deleteAllCommentsByVideoId(videoId);
        
        if (!deletedComment) {
            return res.status(404).json({ message: 'video not found' });
        }

        res.status(200).json({ message: 'Comments deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Export the commentsController object
module.exports = commentsController;