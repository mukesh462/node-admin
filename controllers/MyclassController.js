const Myclass = require("../Models/Myclass");

// Create a new myclass
exports.createMyclass = async (req, res) => {
  try {
    const newmyclass = new Myclass(req.body);
    await newmyclass.save();
    res
      .status(200)
      .json({
        status: true,
        message: "myclass Created Successfully",
        data: newmyclass,
      });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
};

// Get all myclass
exports.getAllMyclass = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const startIndex = (page - 1) * limit;
    const myclass = await Myclass.find().skip(startIndex).limit(limit);
    const totalMyclass = await Myclass.countDocuments();
    const totalPages = Math.ceil(totalMyclass / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    res.status(200).json({
      status: true,
      message: "Myclass Listed Successfully",
      data: myclass,
      paginate: {
        total_count: totalMyclass,
        current_page: page,
        next_page: nextPage ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Get a single myclass by ID
exports.getMyclassById = async (req, res) => {
  try {
    const myclass = await Myclass.findById(req.params.id);
    if (!myclass)
      return res
        .status(404)
        .json({ status: false, error: "myclass not found" });
    res
      .status(200)
      .json({
        status: true,
        message: "Single myclass Listed Successfully",
        data: myclass,
      });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Update an myclass by ID
exports.updateMyclass = async (req, res) => {
  try {
    const myclass = await Myclass.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!myclass)
      return res
        .status(404)
        .json({ status: false, error: "myclass not found" });
    res
      .status(200)
      .json({
        status: true,
        message: "myclass Updated Successfully",
        data: myclass,
      });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Delete an myclass by ID
exports.deleteMyclass = async (req, res) => {
  try {
    const myclass = await Myclass.findByIdAndDelete(req.params.id);
    if (!myclass)
      return res
        .status(404)
        .json({ status: false, error: "myclass not found" });
    res.json({ status: true, message: "myclass deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};
