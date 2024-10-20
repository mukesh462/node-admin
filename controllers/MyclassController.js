const Myclass = require("../Models/Myclass");

// Create a new myclass
exports.createMyclass = async (req, res) => {
    try {
      const newmyclass = new Myclass(req.body);
      await newmyclass.save();
      res
        .status(201)
        .json({ message: "myclass Created Successfully", data: newmyclass });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Get all myclass
  exports.getAllMyclass = async (req, res) => {
    try {
      const myclass = await Myclass.find();
      res.status(200).json({ message: "myclass Listed Successfully", data: myclass });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get a single myclass by ID
exports.getMyclassById = async (req, res) => {
    try {
      const myclass = await Myclass.findById(req.params.id);
      if (!myclass) return res.status(404).json({ error: "myclass not found" });
      res.status(200).json({ message: "Single myclass Listed Successfully", data: myclass });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Update an myclass by ID
exports.updateMyclass = async (req, res) => {
    try {
      const myclass = await Myclass.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!myclass) return res.status(404).json({ error: 'myclass not found' });
      res.status(200).json({ message: "myclass Updated Successfully", data: myclass });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Delete an myclass by ID
exports.deleteMyclass = async (req, res) => {
    try {
      const myclass = await Myclass.findByIdAndDelete(req.params.id);
      if (!myclass) return res.status(404).json({ error: 'myclass not found' });
      res.json({ message: 'myclass deleted successfully' });
    } catch (error) {
      res.status(500)
    }}
  