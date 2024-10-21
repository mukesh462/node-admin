const mongoose = require("mongoose");

const SubcategorySchema = new mongoose.Schema({
  category_id: { type: String, required: true,ref:'Category'},
  subcategory_name: { type: String, required: true },
  status: { type: String, required: true },
});


const Subcategory = mongoose.model('Subcategory', SubcategorySchema);

module.exports = Subcategory;