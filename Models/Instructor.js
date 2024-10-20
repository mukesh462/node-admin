const mongoose = require("mongoose");

const InstructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profile: { type: String, required: true },
  role: { type: String, required: true },
  ratings: { type: Number, required: true },
});


const Instructor = mongoose.model('Instructor', InstructorSchema);

module.exports = Instructor;