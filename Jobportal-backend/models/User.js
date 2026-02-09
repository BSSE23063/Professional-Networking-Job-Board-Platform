const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        enum: ['employer', 'candidate'],
        default: 'candidate'
    },
    
    // Common fields
    // CHANGED: Renamed to 'profilePic' to match your Controller code
    profilePic: { 
        type: String, 
        default: '' 
    },
    bio: { 
        type: String, 
        default: '' 
    },
    
    // Candidate Specific
    resume: { 
        type: String, 
        default: '' 
    },
    skills: [{ type: String }], 

    // Employer Specific
    companyName: { 
        type: String, 
        // THIS IS THE SMART PART:
        // It returns 'true' (required) only if the user is an employer
        // required: [
        //     function() { return this.role === 'employer'; },
        //     'Company name is required for employers'
        // ]
    },
    companyWebsite: { 
        type: String, 
        default: '' 
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);