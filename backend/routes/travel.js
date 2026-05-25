const express = require('express');
const router = express.Router();
const { createTravelPlan, getMyTravelPlans, getAllTravelPlans, deleteTravelPlan, updateTravelPlanStatus } = require('../controllers/travelController');
const { protect } = require('../middleware/auth');

router.post('/post', protect, createTravelPlan);
router.get('/my-plans', protect, getMyTravelPlans);
router.get('/', protect, getAllTravelPlans);
router.delete('/:id', protect, deleteTravelPlan);
router.patch('/:id/status', protect, updateTravelPlanStatus);

module.exports = router;
