const mongoose = require('mongoose');

const MyclassSchema = new mongoose.Schema({
  topic_name: { type: String, required: true },
  description: { type: String, required: true },
  short_description: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: Date, required: true }, 
  endTime: { type: Date, required: true },   
  instructor_id: { type: String, required: true },
  materialsLinks: { type: Object, required: true }, 
  zoomLink: { type: String, required: true },
  recordingUrl: { type: String, required: true },
  classType: { type: Number, required: true },
  batchOrStudentId: { type: Number, required: true },
});

const Myclass = mongoose.model('Myclass', MyclassSchema);

module.exports = Myclass;
