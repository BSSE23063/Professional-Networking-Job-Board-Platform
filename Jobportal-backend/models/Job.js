const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  salary: {
    type: String, 
    required: [true, 'Please add salary range'],
  },
  location: {
    type: String,
    required: [true, 'Please add location'],
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Remote'],
    default: 'Full-time'
  },

  companyName: {
    type: String,
    required: [true, 'Please add company name'],
  },

  // RELATIONSHIP 1: The User (Who posted it?)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // RELATIONSHIP 2: The Company (Which company is it for?)
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    optional: true, // Not all jobs may be linked to a company in our system
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);