const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  studentId: {
    type: String,
    required: [true, 'Please add a student ID'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  bio: String,
  department: String,
  profilePic: {
    type: String,
    default: 'default-profile.png'
  },
  trustScore: {
    type: Number,
    default: 100
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: String,
    enum: ['Beginner Helper', 'Campus Carrier', 'Trusted Runner', 'Elite Courier', 'Campus Legend'],
    default: 'Beginner Helper'
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date
  },
  completedDeliveries: {
    type: Number,
    default: 0
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  badges: [{
    type: String,
    enum: [
      'Newcomer',
      'Speed Hero', 
      'Trusted Student', 
      'Night Delivery Expert', 
      'Emergency Responder', 
      'Community Champion'
    ]
  }]
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
