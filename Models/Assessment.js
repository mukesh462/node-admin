const mongoose = require("mongoose");

const AssessmentSchema = new mongoose.Schema({
  assessment_type: { type: String, required: true },
  particular_id: { type: Object, required: true },
  questions: { type: Array, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
});

const Assessment = mongoose.model("Assessment", AssessmentSchema);

module.exports = Assessment;
