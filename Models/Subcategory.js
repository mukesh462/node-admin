const mongoose = require("mongoose");

const SubcategorySchema = new mongoose.Schema({
  category_id: { type: Number, required: true },
  subcategory_name: { type: String, required: true },
  status: { type: String, required: true },
});


const Subcategory = mongoose.model('Subcategory', SubcategorySchema);

module.exports = Subcategory;