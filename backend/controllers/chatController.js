const Chat = require('../models/Chat');
const DeliveryRequest = require('../models/DeliveryRequest');

// @desc    Get all chat messages for a specific mission
// @route   GET /api/chat/:missionId
// @access  Private
const getMissionMessages = async (req, res) => {
  const { missionId } = req.params;

  try {
    const mission = await DeliveryRequest.findById(missionId);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    // Verify user is either sender or helper
    if (mission.sender.toString() !== req.user._id.toString() && 
        mission.helper?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }

    const messages = await Chat.find({ missionId })
      .populate('sender', 'name profilePic level')
      .sort('createdAt');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a new chat message
// @route   POST /api/chat/:missionId
// @access  Private
const sendMissionMessage = async (req, res) => {
  const { missionId } = req.params;
  const { message } = req.body;

  try {
    const mission = await DeliveryRequest.findById(missionId);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    // Verify user is either sender or helper
    if (mission.sender.toString() !== req.user._id.toString() && 
        mission.helper?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to send messages in this chat' });
    }

    const newMessage = await Chat.create({
      missionId,
      sender: req.user._id,
      message
    });

    // Populate sender details for socket broadcast and response
    const populatedMessage = await newMessage.populate('sender', 'name profilePic level');

    // Broadcast through socket io
    if (req.io) {
      req.io.to(missionId.toString()).emit('receive_message', populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMissionMessages,
  sendMissionMessage
};
