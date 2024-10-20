const Subcategory = require("../Models/Subcategory");

// Create a new Subcategory
exports.createSubcategory = async (req, res) => {
    try {
      const newSubcategory = new Subcategory(req.body);
      await newSubcategory.save();
      res
        .status(201)
        .json({ message: "Subcategory Created Successfully", data: newSubcategory });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Get all Subcategory
  exports.getAllSubcategory = async (req, res) => {
    try {
       
      const SubCategory = await Subcategory.find();
      res.status(200).json({ message: "Subcategory Listed Successfully", data: SubCategory });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get a single Subcategory by ID
exports.getSubcategoryById = async (req, res) => {
    try {
      const SubCategory = await Subcategory.findById(req.params.id);
      if (!SubCategory) return res.status(404).json({ error: "Subcategory not found" });
      res.status(200).json({ message: "Single Subcategory Listed Successfully", data: SubCategory });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Update an Subcategory by ID
exports.updateSubcategory = async (req, res) => {
    try {
      const SubCategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!SubCategory) return res.status(404).json({ error: 'Subcategory not found' });
      res.status(200).json({ message: "Subcategory Updated Successfully", data: SubCategory });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Delete an Subcategory by ID
exports.deleteSubcategory = async (req, res) => {
    try {
      const SubCategory = await Subcategory.findByIdAndDelete(req.params.id);
      if (!SubCategory) return res.status(404).json({ error: 'Subcategory not found' });
      res.json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
      res.status(500)
    }}
  