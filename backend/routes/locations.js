const express = require('express');
const router = express.Router();
const CampusLocation = require('../models/CampusLocation');

// @desc    Get all campus locations
// @route   GET /api/locations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const locations = await CampusLocation.find(query).sort('-popularityScore');
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get popular locations sorted by score
// @route   GET /api/locations/popular
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const locations = await CampusLocation.find().sort('-popularityScore').limit(12);
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
