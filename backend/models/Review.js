const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryRequest',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String
}, {
  timestamps: true
});

// Update user trust score and average rating after review is saved
reviewSchema.post('save', async function() {
  const User = mongoose.model('User');
  const reviews = await this.constructor.find({ reviewee: this.reviewee });
  
  const average = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  const count = reviews.length;
  
  await User.findByIdAndUpdate(this.reviewee, {
    'ratings.average': average.toFixed(1),
    'ratings.count': count,
    $inc: { trustScore: this.rating >= 4 ? 5 : (this.rating <= 2 ? -5 : 0) }
  });
});

module.exports = mongoose.model('Review', reviewSchema);
