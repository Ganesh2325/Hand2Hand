const TravelPlan = require('../models/TravelPlan');

// @desc    Create a travel plan
// @route   POST /api/travel/post
// @access  Private
const createTravelPlan = async (req, res) => {
  const { startLocation, destination, dateTime, capacity, notes } = req.body;

  try {
    const travelPlan = await TravelPlan.create({
      traveler: req.user._id,
      startLocation,
      destination,
      dateTime,
      capacity,
      notes
    });

    res.status(201).json(travelPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's travel plans
// @route   GET /api/travel/my-plans
// @access  Private
const getMyTravelPlans = async (req, res) => {
  try {
    const plans = await TravelPlan.find({ traveler: req.user._id }).sort('-createdAt');
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a travel plan
// @route   DELETE /api/travel/:id
// @access  Private
const deleteTravelPlan = async (req, res) => {
  try {
    const plan = await TravelPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Travel plan not found' });
    if (plan.traveler.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    
    await TravelPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Travel plan removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update travel plan status
// @route   PATCH /api/travel/:id/status
// @access  Private
const updateTravelPlanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const plan = await TravelPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Travel plan not found' });
    if (plan.traveler.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    
    plan.status = status;
    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active travel plans
// @route   GET /api/travel
// @access  Public
const getAllTravelPlans = async (req, res) => {
  try {
    const plans = await TravelPlan.find({ status: 'active' }).populate('traveler', 'name trustScore').sort('-createdAt');
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTravelPlan,
  getMyTravelPlans,
  getAllTravelPlans,
  deleteTravelPlan,
  updateTravelPlanStatus
};
