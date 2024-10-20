const Category = require("../Models/Category");

// Create a new category
exports.createCategory = async (req, res) => {
    try {
      const newCategory = new Category(req.body);
      await newCategory.save();
      res
        .status(201)
        .json({ message: "Category Created Successfully", data: newCategory });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Get all category
  exports.getAllCategory = async (req, res) => {
    try {
      const category = await Category.find();
      res.status(200).json({ message: "Category Listed Successfully", data: category });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get a single Category by ID
exports.getCategoryById = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).json({ error: "Category not found" });
      res.status(200).json({ message: "Single Category Listed Successfully", data: category });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Update an Category by ID
exports.updateCategory = async (req, res) => {
    try {
      const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!category) return res.status(404).json({ error: 'Category not found' });
      res.status(200).json({ message: "Category Updated Successfully", data: category });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Delete an Category by ID
exports.deleteCategory = async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) return res.status(404).json({ error: 'Category not found' });
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500)
    }}
  