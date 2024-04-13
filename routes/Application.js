var express = require('express');
var router = express.Router();
const Application = require('../schemas/Application');

// Route to create a new Application
router.get('/', async (req, res) => {
    try {
      const applications = await Application.find().populate('job candidate');
      res.json(applications);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
router.post('/', async (req, res) => {
  try {
    const { jobId, candidateId, coverLetter, resume } = req.body;

    // Create a new instance of Application
    const newApplication = new Application({
      job: jobId,
      candidate: candidateId,
      coverLetter,
      resume
    });

    // Save the new application to the database
    const savedApplication = await newApplication.save();
    
    // Respond with the saved application
    res.status(201).json(savedApplication);
  } catch (err) {
    // Handle errors
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
