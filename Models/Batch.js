const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema({
  batch_name: { type: String, required: true ,unique: true},
  course_id: { type: String, required: true,ref:'Course'},
  status: { type: String, required: true },
});


const Batch = mongoose.model('Batch', BatchSchema);


module.exports = Batch;