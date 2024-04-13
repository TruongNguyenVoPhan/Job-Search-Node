const express = require('express');
const router = express.Router();
const CV = require('../schemas/CV');
const ResHelper = require('../helper/ResponseHelper');

// Lấy danh sách CV
router.get('/', async (req, res, next) => {
  try {
    const cvs = await CV.find({});
    ResHelper.RenderRes(res, true, cvs);
  } catch (error) {
    ResHelper.RenderRes(res, false, error);
  }
});

// Lấy thông tin CV theo id
router.get('/:id', async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);
    ResHelper.RenderRes(res, true, cv);
  } catch (error) {
    ResHelper.RenderRes(res, false, error);
  }
});

// Thêm mới CV
router.post('/', async (req, res, next) => {
  try {
    const newCV = new CV(req.body);
    const savedCV = await newCV.save();
    ResHelper.RenderRes(res, true, savedCV);
  } catch (error) {
    ResHelper.RenderRes(res, false, error);
  }
});

// Cập nhật thông tin CV
router.put('/:id', async (req, res, next) => {
  try {
    const updatedCV = await CV.findByIdAndUpdate(req.params.id, req.body, { new: true });
    ResHelper.RenderRes(res, true, updatedCV);
  } catch (error) {
    ResHelper.RenderRes(res, false, error);
  }
});

// Xóa CV
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedCV = await CV.findByIdAndDelete(req.params.id);
    ResHelper.RenderRes(res, true, deletedCV);
  } catch (error) {
    ResHelper.RenderRes(res, false, error);
  }
});

module.exports = router;