const Course = require("../Models/Course");

// Create a new Course
exports.createCourse = async (req, res) => {
    try {
      const newCourse = new Course(req.body);
      await newCourse.save();
      res
        .status(201)
        .json({ message: "Course Created Successfully", data: newCourse });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Get all Course
  exports.getAllCourse = async (req, res) => {
    try {
      const course = await Course.find();
      res.status(200).json({ message: "Course Listed Successfully", data: course });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get a single Course by ID
exports.getCourseById = async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ error: "Course not found" });
      res.status(200).json({ message: "Single Course Listed Successfully", data: course });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Update an Course by ID
exports.updateCourse = async (req, res) => {
    try {
      const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!course) return res.status(404).json({ error: 'Course not found' });
      res.status(200).json({ message: "Course Updated Successfully", data: course });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Delete an Course by ID
exports.deleteCourse = async (req, res) => {
    try {
      const course = await Course.findByIdAndDelete(req.params.id);
      if (!course) return res.status(404).json({ error: 'Course not found' });
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      res.status(500)
    }}
  