const Category = require("../Models/Category");

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res
      .status(200)
      .json({ status: true, message: "Category Created Successfully", data: newCategory });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Get all category
exports.getAllCategory = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const startIndex = (page - 1) * limit;
    const category = await Category.find().skip(startIndex).limit(limit);
    const totalCategory = await Category.countDocuments();
    const totalPages = Math.ceil(totalCategory / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    res.status(200).json({
      status: true,
      message: "Category Listed Successfully",
      data: category,
      paginate: {
        total_count: totalCategory,
        current_page: page,
        next_page: nextPage ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({  status: false,error: error.message });
  }
};

// Get a single Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res
      .status(200)
      .json({ status: true, message: "Single Category Listed Successfully", data: category });
  } catch (error) {
    res.status(500).json({  status: false,error: error.message });
  }
};

// Update an Category by ID
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(404).json({  status: false,error: "Category not found" });
    res
      .status(200)
      .json({ status: true, message: "Category Updated Successfully", data: category });
  } catch (error) {
    res.status(500).json({  status: false,error: error.message });
  }
};

// Delete an Category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ status: false, error: "Category not found" });
    res.json({ status: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({  status: false,error: error.message });
  }
};
