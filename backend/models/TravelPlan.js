const mongoose = require('mongoose');

const travelPlanSchema = new mongoose.Schema({
  traveler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startLocation: {
    type: String,
    required: [true, 'Please add a starting location']
  },
  destination: {
    type: String,
    required: [true, 'Please add a destination']
  },
  dateTime: {
    type: Date,
    required: [true, 'Please add a travel date and time']
  },
  capacity: {
    type: String,
    required: [true, 'Please add carrying capacity (e.g., Small bag, Backpack)']
  },
  notes: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TravelPlan', travelPlanSchema);
