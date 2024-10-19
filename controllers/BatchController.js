const Batch = require("../Models/Batch");

// Create a new batch
exports.createBatch = async (req, res) => {
  try {
    const newBatch = new Batch(req.body);
    await newBatch.save();
    res
      .status(201)
      .json({ message: "Batch Created Successfully", data: newBatch });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Batches
exports.getAllBatch = async (req, res) => {
  try {
    const batch = await Batch.find();
    res.status(200).json({ message: "Batch Listed Successfully", data: batch });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single batch by ID
exports.getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ error: "Batch not found" });
    res.status(200).json({ message: "Single Batch Listed Successfully", data: batch });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update an Batch by ID
exports.updateBatch = async (req, res) => {
    try {
      const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!batch) return res.status(404).json({ error: 'Batch not found' });
     res.status(200).json({ message: "Batch Updated Successfully", data: batch });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Delete an batch by ID
exports.deleteBatch = async (req, res) => {
    try {
      const batch = await Batch.findByIdAndDelete(req.params.id);
      if (!batch) return res.status(404).json({ error: 'Batch not found' });
      res.json({ message: 'Batch deleted successfully' });
    } catch (error) {
      res.status(500)
    }}
