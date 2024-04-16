const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');

// Đường dẫn đến tệp mẫu Word
const templatePath = path.join(__dirname, 'template.docx');

// Đường dẫn đến thư mục lưu trữ tệp CV
const cvFilesPath = path.join(__dirname, 'cv_files');

// Đọc nội dung tệp mẫu
const templateContent = fs.readFileSync(templatePath, 'binary');

// Tạo một bảng điều khiển Docxtemplater từ tệp mẫu
const doc = new Docxtemplater();
doc.loadZip(templateContent);

// Dữ liệu CV
const cvData = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '123456789',
  address: '123 Main Street',
  dateOfBirth: 'January 1, 1990',
  education: [
    {
      school: 'University of Example',
      degree: "Bachelor's Degree",
      fieldOfStudy: 'Computer Science',
      startDate: 'September 2010',
      endDate: 'June 2014',
    },
  ],
  experience: [
    {
      company: 'ABC Company',
      position: 'Software Engineer',
      startDate: 'July 2015',
      endDate: 'December 2020',
      responsibilities: [
        'Developed and maintained web applications',
        'Collaborated with cross-functional teams',
      ],
    },
  ],
  skills: ['JavaScript', 'HTML', 'CSS', 'Node.js'],
  certifications: [
    {
      name: 'Certified ScrumMaster',
      issuingOrganization: 'Scrum Alliance',
      issueDate: 'May 15, 2018',
    },
  ],
  languages: [
    {
      language: 'English',
      proficiency: 'Fluent',
    },
    {
      language: 'Spanish',
      proficiency: 'Intermediate',
    },
  ],
};

// Đặt dữ liệu CV vào tệp mẫu
doc.setData(cvData);

// Render tệp mẫu với dữ liệu CV
doc.render();

// Tạo tên tệp CV dựa trên thông tin của CV
const fileName = `cv_${cvData.fullName.replace(/\s/g, '_')}.docx`;

// Đường dẫn đến tệp CV đã tạo
const filePath = path.join(cvFilesPath, fileName);

// Ghi tệp CV vào đường dẫn đã chỉ định
const generatedCV = doc.getZip().generate({ type: 'nodebuffer' });
fs.writeFileSync(filePath, generatedCV);

console.log(`Tệp CV đã tạo: ${filePath}`);