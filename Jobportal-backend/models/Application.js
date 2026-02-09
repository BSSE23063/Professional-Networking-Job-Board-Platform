const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({

    //FK:jobId
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    //FK:applicantId
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    // Enum: status
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interview', 'hired', 'rejected'],
    default: 'applied'
  },
  // String: coverLetter
  coverLetter: {
    type: String,
    default: ''
  },
  // String: resumeLink (New field you requested)
  resumeLink: {
    type: String,
    required: [true, 'Please provide a link to your resume']
  }
}, { timestamps: true });

applicationSchema.index({job:1,applicant:1},{unique:true});

module.exports = mongoose.model('Application', applicationSchema);