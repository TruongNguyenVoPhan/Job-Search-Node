const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  description: { type: String, required: true },
  requirements: [String],
  benefits: [String],
  salary: {
    min: Number,
    max: Number
  },
  employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'] },
  postDate: { type: Date, default: Date.now },
  expirationDate: Date
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;