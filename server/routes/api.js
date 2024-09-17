const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middleware/auth');
const weakAuthMiddleware = require('../middleware/weakAuth');
const likesController = require('../controllers/likesController');
const commentsController = require('../controllers/commentsController');

/* USER ROUTES */
router.get('/users/:id', userController.getUserById);
router.get('/users/username/:username', userController.getUserByUsername);
router.get('/users/channel/:channelname', userController.getUserByChannelName);
router.post('/users', userController.createUser);
router.post('/login', authController.login);
router.put('/users/:username', authMiddleware, userController.updateUser); 
router.delete('/users/:username', authMiddleware, userController.deleteUser); 


/* VIDEO ROUTES */
router.get('/videos/:id', weakAuthMiddleware, videoController.getVideoById);
router.get('/videos', videoController.getTop20Videos);
router.get('/search', videoController.getResultsBySearch);
router.get('/videos/username/:username', videoController.getVideosByUsername);
router.post('/videos',authMiddleware, videoController.addVideo);
router.delete('/videos/:id',authMiddleware, videoController.deleteVideoById);
router.put('/videos/:id',authMiddleware , videoController.updateVideo);



/* LIKES ROUTES */

router.get('/videos/:id/likes', authMiddleware, likesController.getLikesByVideoId);
router.get('/videos/:id/dislikes', authMiddleware, likesController.getDisLikesByVideoId);
router.post('/videos/:id/likes', authMiddleware, likesController.addLike);
router.post('/videos/:id/dislikes', authMiddleware, likesController.addDisLike);
router.delete('/videos/:id/likes', authMiddleware, likesController.deleteLike);
router.delete('/videos/:id/dislikes', authMiddleware, likesController.deleteDisLike);


/* COMMENTS ROUTES */

router.get('/videos/:id/comments', authMiddleware, commentsController.getCommentsByVideoId);
router.delete('/comments/:id', authMiddleware, commentsController.deleteComment);
router.post('/videos/:id/comments', authMiddleware, commentsController.AddComment);
router.put('/comments/:id', authMiddleware, commentsController.updateComment);

module.exports = router;