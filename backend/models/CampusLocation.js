const mongoose = require('mongoose');

const campusLocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['Academic', 'Health', 'Food', 'Hostels', 'Social', 'Entry'],
    required: true
  },
  nearbyLocations: [{
    type: String
  }],
  popularityScore: {
    type: Number,
    default: 0
  },
  activeRoutes: {
    type: Number,
    default: 0
  },
  iconType: {
    type: String,
    default: 'MapPin'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CampusLocation', campusLocationSchema);
