const express = require('express');
const router = express.Router();
const CV = require('../schemas/CV');
const ResHelper = require('../helper/ResponseHelper');
const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const path = require('path'); // Import module path để sử dụng

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

// Route API để tải xuống CV dưới dạng tập tin Word
router.get('/download/:id', async (req, res, next) => {
  try {
    // Tìm CV theo ID
    const cv = await CV.findById(req.params.id);
    if (!cv) {
      return ResHelper.RenderRes(res, false, "Không tìm thấy CV");
    }

    // Đọc template Word
    const templatePath = path.join(__dirname, '../CV/template.docx');
    const templateContent = fs.readFileSync(templatePath, 'binary');
    
    // Khởi tạo Docxtemplater với nội dung template
    const doc = new Docxtemplater();
    doc.loadZip(templateContent);

    // Điền dữ liệu từ CV vào template
    doc.setData({
      fullName: cv.personalInfo.fullName,
      email: cv.personalInfo.email,
      phone: cv.personalInfo.phone,
      address: cv.personalInfo.address,
      // Thêm các trường dữ liệu khác tương ứng
    });

    // Compile template
    doc.render();

    // Lưu tập tin đã được tạo ra
    const outputPath = path.join(__dirname, `../CV/generated_cv_${cv._id}.docx`);
    const outputContent = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(outputPath, outputContent);

    // Gửi tập tin tải xuống về phía client
    res.download(outputPath, `generated_cv_${cv._id}.docx`, (err) => {
      if (err) {
        console.error('Lỗi khi tải xuống CV:', err);
        ResHelper.RenderRes(res, false, "Lỗi khi tải xuống CV");
      } else {
        // Xóa tập tin đã tạo ra sau khi đã gửi thành công về phía client
        fs.unlinkSync(outputPath);
      }
    });
  } catch (error) {
    console.error('Lỗi khi tạo và tải xuống CV:', error);
    ResHelper.RenderRes(res, false, error.message);
  }
});



module.exports = router;