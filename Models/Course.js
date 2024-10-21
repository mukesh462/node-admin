const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  course_name: { type: String, required: true },
  category_id: { type: String, required: true,ref:'Category'},
  subcategory_id: { type: String, required: true,ref:'Subcategory'},
  status: { type: String, required: true },
});


const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;