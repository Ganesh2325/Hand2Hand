const TravelPlan = require('../models/TravelPlan');

const findMatchingTravelers = async (pickup, drop) => {
  // Simple case-insensitive regex matching for locations
  // In a real app, this would use geospatial queries or fuzzy matching
  const pickupRegex = new RegExp(pickup, 'i');
  const dropRegex = new RegExp(drop, 'i');

  const matches = await TravelPlan.find({
    $or: [
      { startLocation: pickupRegex },
      { destination: dropRegex }
    ],
    status: 'active',
    dateTime: { $gte: new Date() }
  }).populate('traveler', 'name trustScore ratings profilePic');

  return matches;
};

module.exports = { findMatchingTravelers };
