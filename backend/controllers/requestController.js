const DeliveryRequest = require('../models/DeliveryRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { findMatchingTravelers } = require('../services/matchingService');

// Helper to check for level ups
const checkLevelUp = (xp) => {
  if (xp >= 10000) return 'Campus Legend';
  if (xp >= 5000) return 'Elite Courier';
  if (xp >= 2000) return 'Trusted Runner';
  if (xp >= 500) return 'Campus Carrier';
  return 'Beginner Helper';
};

// @desc    Create a delivery request
// @route   POST /api/requests/create
// @access  Private
const createRequest = async (req, res) => {
  const { 
    itemName, pickupLocation, dropLocation, urgency, description,
    parcelType, rewardPoints, expectedDeliveryTime, routeVisibility
  } = req.body;

  try {
    const request = await DeliveryRequest.create({
      sender: req.user._id,
      itemName,
      pickupLocation,
      dropLocation,
      urgency,
      description,
      parcelType,
      rewardPoints: rewardPoints || 100,
      expectedDeliveryTime,
      routeVisibility
    });

    // Create activity for global feed if Public
    if (!routeVisibility || routeVisibility === 'Public') {
      await Activity.create({
        user: req.user._id,
        type: 'NEW_REQUEST',
        text: `posted a new ${urgency === 'Emergency' ? '🚨 emergency' : ''} delivery request for a ${parcelType || 'parcel'}`,
        relatedId: request._id
      });
    }

    // Find matches and notify user (optional, can be done on frontend)
    const matches = await findMatchingTravelers(pickupLocation, dropLocation);

    res.status(201).json({ request, matches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept a delivery request
// @route   PATCH /api/requests/:id/accept
// @access  Private
const acceptRequest = async (req, res) => {
  try {
    const request = await DeliveryRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already accepted or processed' });
    }

    request.helper = req.user._id;
    request.status = 'accepted';
    await request.save();

    // Create Notification for sender
    const notification = await Notification.create({
      user: request.sender,
      message: `${req.user.name} has accepted your delivery request for ${request.itemName}`,
      type: 'request_accepted',
      relatedId: request._id
    });

    // Send real-time notification
    if (req.io) {
      req.io.to(request.sender.toString()).emit('notification', notification);
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request status (picked_up, delivered)
// @route   PATCH /api/requests/:id/status
// @access  Private
const updateRequestStatus = async (req, res) => {
  const { status, otp } = req.body;

  try {
    const request = await DeliveryRequest.findById(req.params.id).select('+otp');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is the helper
    if (request.helper.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (status === 'picked_up') {
      request.status = 'picked_up';
      // Generate OTP for delivery completion
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      request.otp = generatedOtp;
      
      await request.save();

      // Notify sender with OTP
      const notification = await Notification.create({
        user: request.sender,
        message: `Your item ${request.itemName} has been picked up. Share this OTP with the receiver: ${generatedOtp}`,
        type: 'otp_generated',
        relatedId: request._id
      });

      if (req.io) {
        req.io.to(request.sender.toString()).emit('notification', notification);
      }
    } else if (status === 'delivered') {
      // Strict OTP verification:
      if (otp !== request.otp) {
        return res.status(400).json({ message: 'Invalid OTP! Please ask the sender/receiver for the correct 4-digit code.' });
      }
      
      request.status = 'delivered';
      await request.save();

      // Increment helper's completed deliveries and XP
      const helper = await User.findById(request.helper);
      helper.completedDeliveries += 1;
      helper.xp += (request.rewardPoints || 100);
      helper.trustScore += 5; // Flat trust score boost per delivery
      
      const newLevel = checkLevelUp(helper.xp);
      let levelUpMessage = null;
      if (newLevel !== helper.level) {
        helper.level = newLevel;
        levelUpMessage = `reached rank: ${newLevel}!`;
        
        await Activity.create({
          user: helper._id,
          type: 'RANK_UP',
          text: levelUpMessage
        });
      }
      
      await helper.save();

      // Broadcast completion activity
      await Activity.create({
        user: helper._id,
        type: 'MISSION_COMPLETED',
        text: `completed a delivery mission (+${request.rewardPoints || 100} XP)`,
        relatedId: request._id
      });

      // Notify sender
      const notification = await Notification.create({
        user: request.sender,
        message: `Your item ${request.itemName} has been delivered successfully!`,
        type: 'delivered',
        relatedId: request._id
      });

      if (req.io) {
        req.io.to(request.sender.toString()).emit('notification', notification);
        req.io.to(helper._id.toString()).emit('mission_completed', { 
          xp: request.rewardPoints || 100,
          levelUp: levelUpMessage 
        });
      }
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all available pending requests
// @route   GET /api/requests/available
// @access  Private
const getAvailableRequests = async (req, res) => {
  try {
    const requests = await DeliveryRequest.find({ status: 'pending' })
      .populate('sender', 'name trustScore ratings')
      .sort('-createdAt');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's delivery requests
// @route   GET /api/requests/my-requests
// @access  Private
const getMyRequests = async (req, res) => {
  try {
    const requests = await DeliveryRequest.find({ sender: req.user._id })
      .select('+otp')
      .populate('helper', 'name trustScore')
      .sort('-createdAt');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get requests where user is the helper
// @route   GET /api/requests/my-missions
// @access  Private
const getMyMissions = async (req, res) => {
  try {
    const requests = await DeliveryRequest.find({ helper: req.user._id })
      .populate('sender', 'name trustScore')
      .sort('-createdAt');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  acceptRequest,
  updateRequestStatus,
  getAvailableRequests,
  getMyRequests,
  getMyMissions
};
