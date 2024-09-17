const mongoose = require('mongoose');


const likesSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    video_id: {
        type: String,
        required: true
    },
    action: {
        type: String,
        enum: ['like', 'dislike']
    },
});

// Create a unique index on the combination of user_id and video_id
likesSchema.index({ username: 1, video_id: 1 }, { unique: true });


// Define a static method to find likes by video_id
likesSchema.statics.findLikesByVideoId = async function(videoId) {
    try {
        // Search for all documents with the given video_id
        const likes = await this.find({ video_id: videoId, action: 'like'});
        return likes;
    } catch (error) {
        throw new Error('Error finding likes by video_id: ' + error.message);
    }
}

// Define a static method to find likes by video_id
likesSchema.statics.findDisLikesByVideoId = async function(videoId) {
    try {
        // Search for all documents with the given video_id
        const likes = await this.find({ video_id: videoId, action: 'dislike'});
        return likes;
    } catch (error) {
        throw new Error('Error finding likes by video_id: ' + error.message);
    }
}

likesSchema.statics.addLike = async function(username, videoId) {
    // Extract the user_id from likeData
    const userId = username;

    try {
        // Combine the video_id with the data from the request body
        const completeLikeData = {
            username,
            video_id: videoId,
            action: 'like'
        };

        const Like = new this(completeLikeData);
        const savedLike = await Like.save();
        return savedLike;
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw new Error('Validation Error: ' + error.message);
        } else if (error.code === 11000) {
            this.deleteLike(username, videoId)
            throw new Error('Delete the like');
        } else {
            throw new Error('Error adding video: ' + error.message);
        }
    }
}


likesSchema.statics.addDisLike = async function(username, videoId) {
    // Extract the user_id from likeData
    const userId = username;

    try {
        // Combine the video_id with the data from the request body
        const completeLikeData = {
            username,
            video_id: videoId,
            action: 'dislike'
        };

        const DisLike = new this(completeLikeData);
        const savedLike = await DisLike.save();
        return savedLike;
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw new Error('Validation Error: ' + error.message);
        } else if (error.code === 11000) {
            this.deleteDisLike(username, videoId)
            throw new Error('Delete the dislike');
        } else {
            throw new Error('Error adding video: ' + error.message);
        }
    }
}

likesSchema.statics.deleteLike = async function(username, videoId) {
    try {
        const deletedLike = await this.findOneAndDelete({username: username, video_id: videoId, action: 'like' });

        if (!deletedLike) {
            throw new Error('Like not found');
        }

        return deletedLike;
    } catch (error) {
        throw new Error('Error deleting like: ' + error.message);
    }
};


likesSchema.statics.deleteDisLike = async function(username, videoId) {
    try {
        const deletedLike = await this.findOneAndDelete({ username: username, video_id: videoId, action: 'dislike' });

        if (!deletedLike) {
            throw new Error('DisLike not found');
        }

        return deletedLike;
    } catch (error) {
        throw new Error('Error deleting like: ' + error.message);
    }
};


// Delete all likes for a specific video
likesSchema.statics.deleteAllLikes = async function(videoId) {
    try {
        const result = await this.deleteMany({ video_id: videoId, action: 'like' });

        console.log("deleted " + result.deletedCount + " likes");

        return result;
    } catch (error) {
        throw new Error('Error deleting likes: ' + error.message);
    }
};

// Delete all Dislikes for a specific video
likesSchema.statics.deleteAllDisLikes = async function(videoId) {
    try {
        const result = await this.deleteMany({ video_id: videoId, action: 'dislike' });

        console.log("deleted " + result.deletedCount + " dislikes");

        return result;
    } catch (error) {
        throw new Error('Error deleting dislikes: ' + error.message);
    }
};

// Define the static method for deleting all likes and dislikes by username
likesSchema.statics.deleteLikesByUsername = async function(username) {
    try {
        // Use deleteMany to remove all likes and dislikes with the given username
        const result = await this.deleteMany({ username });

        console.log("deleted " + result.deletedCount + " likes and dislikes");

        return result;
    } catch (error) {
        throw new Error('Error deleting likes and dislikes: ' + error.message);
    }
};


const Like = mongoose.model('Like', likesSchema);

module.exports = Like;