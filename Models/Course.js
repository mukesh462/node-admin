const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  course_name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  status: { type: String, required: true },
});


const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;