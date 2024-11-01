const Materiallink = require("../Models/Materiallink");

// Create a new materiallink
exports.createMateriallink = async (req, res) => {
  try {
    console.log(req.file, "dddd");
    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, message: "File upload is required" });
    }
    const materiallinkData = {
      name: req.body.material_name,
      filelink: `uploads/${req.file.filename}`,
    };
    const newMateriallink = new Materiallink(materiallinkData);
    await newMateriallink.save();
    res.status(200).json({
      status: true,
      message: "Materiallink Created Successfully",
      data: newMateriallink,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Delete an materiallink by ID
exports.deleteMateriallink = async (req, res) => {
  try {
    const materiallink = await Materiallink.findByIdAndDelete(req.params.id);
    if (!materiallink)
      return res
        .status(200)
        .json({ status: false, error: "Materiallink not found" });
    res.json({
      status: true,
      message: "Materiallink deleted successfully",
      data: [],
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

exports.listData = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const startIndex = (page - 1) * limit;

    const batches = await Materiallink.find().skip(startIndex).limit(limit);

    const totalBatch = await Materiallink.countDocuments();
    const totalPages = Math.ceil(totalBatch / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    res.status(200).json({
      status: true,
      message: "Materials Listed Successfully",
      data: batches,
      paginate: {
        total_count: totalBatch,
        current_page: page,
        next_page: nextPage ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};


exports.searchMaterialByName = async (req, res) => {
  try {
    const searchTerm = req.body.search; // Get the search term from query parameters

    if (!searchTerm) {
      return res.status(400).json({ status: false, message: "Search term is required" });
    }

    const materials = await Materiallink.find({
      name: { $regex: searchTerm, $options: 'i' } // Case-insensitive search
    });

    res.status(200).json({
      status: true,
      message: "Materials fetched successfully",
      data: materials,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};
