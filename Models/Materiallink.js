const mongoose = require("mongoose");

const MateriallinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  filelink: { type: String, required: true },
});


const Materiallink = mongoose.model('Materiallink', MateriallinkSchema);

module.exports = Materiallink;