const mongoose = require('mongoose');

const MyclassSchema = new mongoose.Schema({
  topic_name: { type: String, required: true },
  description: { type: String, required: true },
  short_description: { type: String, required: false },
  date: { type: Date, required: true },
  start_time: { type: Date, required: true }, 
  end_time: { type: Date, required: true },   
  instructor_id: { type: String, required: true,ref:"Instructor" },
  materials: { type: Array, required: true,default:[] }, 
  zoomLink: { type: String, required: false,default:null },
  recordingUrl: { type: String, required: false,default:null },
  class_type: { type: Number, required: true },
  batch_or_student_id: { type: String, required: false },
});

const Myclass = mongoose.model('MyClass', MyclassSchema);

module.exports = Myclass;
