const Instructor = require("../Models/Instructor");

// Create a new instructor
exports.createInstructor = async (req, res) => {
    try {
      const newInstructor = new Instructor(req.body);
      await newInstructor.save();
      res
        .status(201)
        .json({ message: "Instructor Created Successfully", data: newInstructor });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Get all Instructor
  exports.getAllInstructor = async (req, res) => {
    try {
       
      const instructor = await Instructor.find();
      res.status(200).json({ message: "instructor Listed Successfully", data: instructor });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get a single instructor by ID
exports.getInstructorById = async (req, res) => {
    try {
      const instructor = await Instructor.findById(req.params.id);
      if (!instructor) return res.status(404).json({ error: "instructor not found" });
      res.status(200).json({ message: "Single instructor Listed Successfully", data: instructor });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Update an instructor by ID
exports.updateInstructor = async (req, res) => {
    try {
      const instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!instructor) return res.status(404).json({ error: 'instructor not found' });
      res.status(200).json({ message: "instructor Updated Successfully", data: instructor });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Delete an instructor by ID
exports.deleteInstructor = async (req, res) => {
    try {
      const instructor = await Instructor.findByIdAndDelete(req.params.id);
      if (!instructor) return res.status(404).json({ error: 'instructor not found' });
      res.json({ message: 'instructor deleted successfully' });
    } catch (error) {
      res.status(500)
    }}
  