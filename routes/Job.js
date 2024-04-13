const express = require('express');
const router = express.Router();
const Job = require('../schemas/Job');
const ResHelper = require('../helper/ResponseHelper');

// Lấy danh sách công việc
router.get('/', async (req, res, next) => {
  try {
    const jobs = await Job.find({});
    ResHelper.RenderRes(res, true, jobs);
  } catch (error) {
    ResHelper.RenderRes(res, false, error);
  }
});

// Lấy thông tin công việc theo id
router.get('/:id', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    ResHelper.RenderRes(res, true, job);
  } catch (error) {
    ResHelper.RenderRes(res, false, error);
  }
});

// Thêm mới công việc
router.post('/', async (req, res, next) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    ResHelper.RenderRes(res, true, savedJob);
  } catch (error) {
    ResHelper.RenderRes(res, false, error);
  }
});

// Cập nhật thông tin công việc
router.put('/:id', async (req, res, next) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    ResHelper.RenderRes(res, true, updatedJob);
  } catch (error) {
    ResHelper.RenderRes(res, false, error);
  }
});

// Xóa công việc
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    ResHelper.RenderRes(res, true, deletedJob);
  } catch (error) {
    ResHelper.RenderRes(res, false, error);
  }
});

module.exports = router;