const express = require('express');
const router = express.Router();
const { getUserProfile, getLeaderboard, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
