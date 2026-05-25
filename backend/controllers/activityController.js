const Activity = require('../models/Activity');

// @desc    Get recent community activities
// @route   GET /api/activities
// @access  Private
const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('user', 'name profilePic level')
      .sort('-createdAt')
      .limit(30);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecentActivities
};
