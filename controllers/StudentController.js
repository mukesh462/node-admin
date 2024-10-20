const Student = require("../Models/Student");
const bcrypt = require('bcryptjs');

// Create a new Student
exports.createStudent = async (req, res) => {
    try {
        const { pwd, ...studentData } = req.body;
        const hashedPassword = await bcrypt.hash(pwd, 10);
        const newStudent = new Student({ ...studentData, pwd: hashedPassword });
        await newStudent.save();
      res
        .status(201)
        .json({ message: "Student Created Successfully", data: newStudent });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Get all Student
  exports.getAllStudent = async (req, res) => {
    try {
      const student = await Student.find();
      res.status(200).json({ message: "student Listed Successfully", data: student });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get a single Student by ID
exports.getStudentById = async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) return res.status(404).json({ error: "student not found" });
      res.status(200).json({ message: "Single student Listed Successfully", data: student });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Update an Student by ID
exports.updateStudent = async (req, res) => {
    try {
      if (req.body.pwd) {
        req.body.pwd = await bcrypt.hash(req.body.pwd, 10);
       }
      const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!student) return res.status(404).json({ error: 'student not found' });
      res.status(200).json({ message: "student Updated Successfully", data: student });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Delete an Student by ID
exports.deleteStudent = async (req, res) => {
    try {
      const student = await Student.findByIdAndDelete(req.params.id);
      if (!student) return res.status(404).json({ error: 'student not found' });
      res.json({ message: 'student deleted successfully' });
    } catch (error) {
      res.status(500)
    }}
  