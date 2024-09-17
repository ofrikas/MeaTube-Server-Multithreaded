const mongoose = require('mongoose');
const User = require('./user');

const commentsSchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: true
    },
    commentText: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    likesNum: {
        type: Number,
        default: 0,
        required: true
    },
    dislikesNum: {
        type: Number,
        default: 0,
        required: true
    }
});

async function processComments(comments) {
    for (const element of comments) {
      const userDetails = await User.findUserByUsername(element._doc.userName);
      element._doc.userImage = userDetails._doc.image;
      element._doc.displayName = userDetails._doc.displayName;
    }
    return comments;
  }

// Static method to find comments by commentId
commentsSchema.statics.findCommentsByVideoId = async function(videoId) {
    try {
        const comments = await this.find({ videoId: videoId });
        const processedComments = await processComments(comments);

        // Sort comments by creation date in descending order
        comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return processedComments;
    } catch (error) {
        throw new Error('Error finding comments by commentId: ' + error.message);
    }
}

// Define a static method to delete a comment by _id
commentsSchema.statics.deleteComment = async function(commentId) {
    try {
        const objectId = new mongoose.Types.ObjectId(commentId);
        const deletedComment = await this.findOneAndDelete({ _id: objectId});

        if (!deletedComment) {
            throw new Error('Comment not found');
        }

        return deletedComment;
    } catch (error) {
        throw new Error('Error deleting comment: ' + error.message);
    }
};

// Define the static method for deleting all comments by username
commentsSchema.statics.deleteCommentsByUsername = async function(username) {
    try {
        // Use deleteMany to remove all comments with the given username
        const result = await this.deleteMany({ userName: username });

        console.log("deleted " + result.deletedCount + " comments");

        return result;
    } catch (error) {
        throw new Error('Error deleting comments: ' + error.message);
    }
};


// Define the static method for adding a comment
commentsSchema.statics.addComment = async function(commentData, videoId) {
    try {
        // Combine the video_id with the data from the request body
        const completeCommentData = {
            ...commentData,
            videoId: videoId
        };

        const comment = new this(completeCommentData);
        const savedComment = await comment.save();
        return savedComment;
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw new Error('Validation Error: ' + error.message);
        } else {
            throw new Error('Error adding comment: ' + error.message);
        }
    }
};



// Define the static method for updating a comment
commentsSchema.statics.updateCommentById = async function(commentId, updatedData) {
    try {
        // Use findByIdAndUpdate to update the comment by its ID
        const updatedComment = await this.findByIdAndUpdate(
            commentId, 
            updatedData, 
            { new: true, runValidators: true } // Options: return the updated document, and run validation
        );

        // If no comment is found with the given ID, throw an error
        if (!updatedComment) {
            throw new Error('Comment not found');
        }

        return updatedComment;
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw new Error('Validation Error: ' + error.message);
        } else {
            throw new Error('Error updating comment: ' + error.message);
        }
    }
};


// Define the static method for deleting all comments by videoId
commentsSchema.statics.deleteAllCommentsByVideoId = async function(videoId) {
    try {
        // Use deleteMany to remove all comments with the given videoId
        const result = await this.deleteMany({ videoId: videoId });

        console.log("deleted " + result.deletedCount + " comments");

        return result;
    } catch (error) {
        throw new Error('Error deleting comments: ' + error.message);
    }
};


const Comment = mongoose.model('Comment', commentsSchema);

module.exports = Comment;
