const mongoose = require('mongoose');

const MyclassSchema = new mongoose.Schema({
  topic_name: { type: String, required: true },
  description: { type: String, required: true },
  short_description: { type: String, required: true },
  date: { type: Date, required: true },
  start_time: { type: Date, required: true }, 
  end_time: { type: Date, required: true },   
  instructor_id: { type: String, required: true },
  materials: { type: Array, required: true }, 
  zoomLink: { type: String, required: false },
  recordingUrl: { type: String, required: false },
  class_type: { type: Number, required: true },
  batch_or_student_id: { type: String, required: false },
});

const Myclass = mongoose.model('MyClass', MyclassSchema);

module.exports = Myclass;
