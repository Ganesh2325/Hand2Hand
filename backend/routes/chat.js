const express = require('express');
const router = express.Router();
const { getMissionMessages, sendMissionMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.get('/:missionId', protect, getMissionMessages);
router.post('/:missionId', protect, sendMissionMessage);

module.exports = router;
