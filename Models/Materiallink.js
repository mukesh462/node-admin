const mongoose = require("mongoose");

const MateriallinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  link: { type: String, required: true },
});


const Materiallink = mongoose.model('Materiallink', MateriallinkSchema);

module.exports = Materiallink;