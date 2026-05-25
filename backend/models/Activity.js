const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['MISSION_COMPLETED', 'BADGE_EARNED', 'RANK_UP', 'NEW_REQUEST'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId, // Could be mission id, badge id etc.
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);
