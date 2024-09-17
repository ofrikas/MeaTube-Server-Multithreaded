const { once } = require('events');
const mongoose = require('mongoose');
const Like = require('./likes');
const Comment = require('./comments');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: '' 
    },
    videoFile: {
        type: String,
        required: true
    },
    previewImage: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    uploadTime: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
});

videoSchema.statics.findVideoById = async function(id) {
    try {
        const video = await this.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true, runValidators: true }
        );
        
        if (!video) {
            throw new Error('Video not found');
        }
        
        return video;
    } catch (error) {
        throw new Error('Error finding video: ' + error.message);
    }
}

videoSchema.statics.findVideosBySearch = async function(searchText) {
    try {
        const video = await this.find({ title: { $regex: searchText, $options: 'i' } });
        return video;
    } catch (error) {
        throw new Error('Error finding video: ' + error.message);
    }
}

videoSchema.statics.addVideo = async function(videoData) {
    try {
        const video = new this(videoData);
        const savedVideo = await video.save();
        return savedVideo;
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw new Error('Validation Error: ' + error.message);
        } else if (error.code === 11000) {
            throw new Error('Duplicate Key Error: ' + error.message);
        } else {
            throw new Error('Error adding video: ' + error.message);
        }
    }
}

// Define a static method to delete a video by _id (videoId)
videoSchema.statics.deleteVideoById = async function(videoId, reqUsername) {
    try {
        const objectId = new mongoose.Types.ObjectId(videoId);

        const video = await this.findById(objectId);

        // If no video is found with the given ID, throw an error
        if (!video) {
            throw new Error('Video not found');
        }

        // Check if the username of the video matches the reqUsername
        if (video.username !== reqUsername) {
            throw new Error('user is not authorized to delete this video');
        }

        Like.deleteAllLikes(videoId);
        Like.deleteAllDisLikes(videoId);
        Comment.deleteAllCommentsByVideoId(videoId);

        const deletedVideo = await this.findOneAndDelete({ _id: objectId });


        // Call the method to delete all comments associated with this videoId

        return deletedVideo;
    } catch (error) {
        throw new Error('Error deleting video: ' + error.message);
    }
};

// Define a static method to delete all videos by username
videoSchema.statics.deleteVideosByUsername = async function(username) {
    try {
        const videos = await this.find({ username });

        // Delete all likes and comments associated with each video
        for (const video of videos) {
            await Like.deleteAllLikes(video._id);
            await Like.deleteAllDisLikes(video._id);
            await Comment.deleteAllCommentsByVideoId(video._id);
        }

        // Delete all videos by username
        await this.deleteMany({ username });
    } catch (error) {
        console.error(`Error deleting videos by username: ${error.message}`);
        throw new Error('Error deleting videos');
    }
};




// Define the static method for updating a video
videoSchema.statics.updateVideoById = async function(videoId, updatedData, reqUsername) {
    try {
        // Use findByIdAndUpdate to update the video by its ID
        const video = await this.findById(videoId);

        // If no video is found with the given ID, throw an error
        if (!video) {
            throw new Error('Video not found');
        }

        // Check if the username of the video matches the reqUsername
        if (video.username !== reqUsername) {
            throw new Error('user is not authorized to update this video');
        }

        const updatedVideo = await this.findByIdAndUpdate(
            videoId, 
            updatedData, 
            { new: true, runValidators: true } // Options: return the updated document, and run validation
        );

        return updatedVideo;
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw new Error('Validation Error: ' + error.message);
        } else {
            throw new Error('Error updating video: ' + error.message);
        }
    }
};


videoSchema.statics.getTop20Videos = async function() {
    try {
        const videos = await this.find({});

        // Sort videos by views in descending order
        videos.sort((a, b) => b.views - a.views);

        // Get the top 10 most viewed videos
        const top10MostViewed = videos.slice(0, 10);

        // Get the remaining videos
        const remainingVideos = videos.slice(10);

        // Shuffle the remaining videos to get 10 random videos
        const shuffledRemaining = remainingVideos.sort(() => 0.5 - Math.random());
        const top10Random = shuffledRemaining.slice(0, 10);

        // Combine the top 10 most viewed and top 10 random videos and shuffle them
        const top20Videos = [...top10MostViewed, ...top10Random];
        top20Videos.sort(() => 0.5 - Math.random());
        
        return top20Videos;
    } catch (error) {
        throw new Error('Error getting top 20 videos: ' + error.message);
    }
}

videoSchema.statics.getVideosByUsername = async function(username) {
    try {
        const videos = await this.find({ username: username });
        return videos;
    }
    catch (error) {
        throw new Error('Error getting videos by username: ' + error.message);
    }
}

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;