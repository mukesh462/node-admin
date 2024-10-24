const Subcategory = require("../Models/Subcategory");

// Create a new Subcategory
exports.createSubcategory = async (req, res) => {
  try {
    const newSubcategory = new Subcategory(req.body);
    await newSubcategory.save();
    res.status(200).json({
      status: true,
      message: "Subcategory Created Successfully",
      data: newSubcategory,
    });
  } catch (error) {
    res.status(500).json({ status: true, error: error.message });
  }
};

// Get all Subcategory
exports.getAllSubcategory = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const startIndex = (page - 1) * limit;
    const subcategories = await Subcategory.find().skip(startIndex).limit(limit).populate({path:'category_id',select:"category_name"});

    const subcategory= subcategories.map(subcategory => ({
        _id: subcategory._id,
        category_name: subcategory.category_id.category_name,
        subcategory_name: subcategory.subcategory_name,
        status: subcategory.status,
      }));

    const totalSubcategory = await Subcategory.countDocuments();
    const totalPages = Math.ceil(totalSubcategory / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    res.status(200).json({
      status: true,
      message: "Subcategory Listed Successfully",
      data: subcategory,
      paginate: {
        total_count: totalSubcategory,
        current_page: page,
        next_page: nextPage ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Get a single Subcategory by ID
exports.getSubcategoryById = async (req, res) => {
  try {
    const SubCategory = await Subcategory.findById(req.params.id);
    if (!SubCategory)
      return res.status(200).json({status: false, error: "Subcategory not found" ,data:[]});
    res.status(200).json({
      status: true,
      message: "Single Subcategory Listed Successfully",
      data: SubCategory,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Update an Subcategory by ID
exports.updateSubcategory = async (req, res) => {
  try {
    const SubCategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!SubCategory)
      return res
        .status(200)
        .json({ status: false, error: "Subcategory not found",data:[] });
    res.status(200).json({
      status: true,
      message: "Subcategory Updated Successfully",
      data: SubCategory,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Delete an Subcategory by ID
exports.deleteSubcategory = async (req, res) => {
  try {
    const SubCategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!SubCategory)
      return res
        .status(200)
        .json({ status: false, error: "Subcategory not found",data:[] });
    res.json({ status: true, message: "Subcategory deleted successfully" ,data:[]});
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

exports.getallsubcategory_by_id = async(req,res)=>{

  try{
    const subCategories = await Subcategory.find({ "category_id": req.body.category_id });

    if (subCategories.length === 0) {
      return res.status(200).json({ message: 'No subcategories found for this category',data:[],status:true });
    }
    res.json({ status: true, data: subCategories });

  }
  catch(error){
    res.status(500).json({ status: false, error: error.message });

  }
}