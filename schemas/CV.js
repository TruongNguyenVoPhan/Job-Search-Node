const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  personalInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    dateOfBirth: Date
  },
  education: [{
    school: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date
  }],
  experience: [{
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: Date,
    endDate: Date,
    responsibilities: [String]
  }],
  skills: [String],
  certifications: [{
    name: { type: String, required: true },
    issuingOrganization: String,
    issueDate: Date
  }],
  languages: [{
    language: { type: String, required: true },
    proficiency: { type: String, enum: ['Basic', 'Intermediate', 'Advanced', 'Fluent'] }
  }]
}, { timestamps: true });

const CV = mongoose.model('CV', cvSchema);

module.exports = CV;