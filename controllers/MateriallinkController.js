const Materiallink = require("../Models/Materiallink");

// Create a new materiallink
exports.createMateriallink = async (req, res) => {
  try {
    const newMateriallink = new Materiallink(req.body);
    await newMateriallink.save();
    res
      .status(200)
      .json({ status:true, message: "Materiallink Created Successfully", data: newMateriallink });
  } catch (error) {
    res.status(500).json({ status:false,error: error.message });
  }
};

// Delete an materiallink by ID
exports.deleteMateriallink = async (req, res) => {
    try {
      const materiallink = await Materiallink.findByIdAndDelete(req.params.id);
      if (!materiallink) return res.status(200).json({ status:false,error: "Materiallink not found" });
      res.json({ status:true,message: "Materiallink deleted successfully" ,data:[]});
    } catch (error) {
      res.status(500).json({status:false, error: error.message });
    }
  };