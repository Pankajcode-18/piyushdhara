const Video = require('../models/Video');

// @desc    Get videos by chapter ID
// @route   GET /api/chapters/:chapterId/videos
// @access  Public
const getVideos = async (req, res) => {
    try {
        const videos = await Video.find({ chapter: req.params.chapterId }).sort({ order: 1 });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a video
// @route   POST /api/chapters/:chapterId/videos
// @access  Private/Admin
const createVideo = async (req, res) => {
    try {
        const { title, description, isFree, isPublished, order } = req.body;
        const chapterId = req.params.chapterId;

        // The actual file URL would be in req.file.path if using multer local storage
        // or a cloud URL if using S3/Cloudinary upload middleware
        const videoUrl = req.file ? req.file.path.replace(/\\/g, '/') : req.body.videoUrl;

        if (!videoUrl) {
            return res.status(400).json({ message: 'Video file or URL is required' });
        }

        const video = new Video({
            title,
            description,
            videoUrl,
            isFree,
            isPublished,
            chapter: chapterId,
            order
        });

        const createdVideo = await video.save();
        res.status(201).json(createdVideo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a video
// @route   PUT /api/videos/:id
// @access  Private/Admin
const updateVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (video) {
            video.title = req.body.title || video.title;
            video.description = req.body.description !== undefined ? req.body.description : video.description;
            video.isFree = req.body.isFree !== undefined ? req.body.isFree : video.isFree;
            video.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : video.isPublished;
            video.order = req.body.order !== undefined ? req.body.order : video.order;
            
            if (req.file) {
                video.videoUrl = req.file.path;
            } else if (req.body.videoUrl) {
                video.videoUrl = req.body.videoUrl;
            }

            const updatedVideo = await video.save();
            res.json(updatedVideo);
        } else {
            res.status(404).json({ message: 'Video not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Private/Admin
const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (video) {
            await Video.deleteOne({ _id: video._id });
            res.json({ message: 'Video removed' });
        } else {
            res.status(404).json({ message: 'Video not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getVideos,
    createVideo,
    updateVideo,
    deleteVideo
};
