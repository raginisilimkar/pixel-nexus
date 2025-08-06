const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  deadline: Date,
  status: {
    type: String,
    enum: ['Active', 'Completed'],
    default: 'Active'
  },
  techStack: {
    type: [String],
    default: [] // ✅ Add this to prevent join() crash
  },
  assignedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
