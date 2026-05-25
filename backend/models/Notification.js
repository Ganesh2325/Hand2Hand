const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['request_accepted', 'picked_up', 'delivered', 'otp_generated', 'new_match'],
    required: true
  },
  relatedId: mongoose.Schema.Types.ObjectId, // Can be DeliveryRequest or TravelPlan ID
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
