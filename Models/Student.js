const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true,unique : true,match: [/.+@.+\..+/, 'Please enter a valid email address']},
  pwd: { type: String, required: true },
  pnumber: { type: String, required: true },
  profile: { type: String, required: true },
  batch_id: { type: Number, required: true },
  isAdmin: { type: Number, required: true , default:0},
  dateofjoining: { type: Date, required: true },
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;