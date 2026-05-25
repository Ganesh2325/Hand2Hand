const mongoose = require('mongoose');

const deliveryRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemName: {
    type: String,
    required: [true, 'Please add an item name']
  },
  pickupLocation: {
    type: String,
    required: [true, 'Please add a pickup location']
  },
  dropLocation: {
    type: String,
    required: [true, 'Please add a drop location']
  },
  urgency: {
    type: String,
    enum: ['Normal', 'Important', 'Emergency'],
    default: 'Normal'
  },
  parcelType: {
    type: String,
    enum: ['Documents', 'Food', 'Electronics', 'Books', 'Essentials', 'Others'],
    default: 'Others'
  },
  rewardPoints: {
    type: Number,
    default: 100
  },
  expectedDeliveryTime: {
    type: String
  },
  routeVisibility: {
    type: String,
    enum: ['Public', 'Campus Only', 'Trusted Users Only'],
    default: 'Public'
  },
  itemImage: String,
  description: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'picked_up', 'delivered', 'cancelled'],
    default: 'pending'
  },
  helper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  otp: {
    type: String,
    select: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DeliveryRequest', deliveryRequestSchema);
