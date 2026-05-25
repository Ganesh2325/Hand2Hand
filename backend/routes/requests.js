const express = require('express');
const router = express.Router();
const { 
  createRequest, 
  acceptRequest, 
  updateRequestStatus, 
  getAvailableRequests,
  getMyRequests,
  getMyMissions
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createRequest);
router.get('/available', protect, getAvailableRequests);
router.get('/my-requests', protect, getMyRequests);
router.get('/my-missions', protect, getMyMissions);
router.patch('/:id/accept', protect, acceptRequest);
router.patch('/:id/status', protect, updateRequestStatus);

module.exports = router;
