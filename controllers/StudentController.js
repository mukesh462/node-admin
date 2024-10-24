const Student = require("../Models/Student");
const bcrypt = require("bcryptjs");

// Create a new Student
exports.createStudent = async (req, res) => {
  try {
    const { pwd, ...studentData } = req.body;
    const hashedPassword = await bcrypt.hash(pwd, 10);
    const newStudent = new Student({ ...studentData, pwd: hashedPassword });
    await newStudent.save();
    res
      .status(200)
      .json({
        status: true,
        message: "Student Created Successfully",
        data: newStudent,
      });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Get all Student
exports.getAllStudent = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const startIndex = (page - 1) * limit;
    const student = await Student.find().skip(startIndex).limit(limit);
    const totalStudent = await Student.countDocuments();
    const totalPages = Math.ceil(totalStudent / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    res.status(200).json({
      status: true,
      message: "Student Listed Successfully",
      data: student,
      paginate: {
        total_count: totalStudent,
        current_page: page,
        next_page: nextPage ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Get a single Student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(200).json({ error: "student not found",data:[] });
    res
      .status(200)
      .json({
        status: true,
        message: "Single student Listed Successfully",
        data: student,
      });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Update an Student by ID
exports.updateStudent = async (req, res) => {
  try {
    if (req.body.pwd) {
      req.body.pwd = await bcrypt.hash(req.body.pwd, 10);
    }
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student)
      return res
        .status(200)
        .json({ status: false, error: "student not found",data:[] });
    res
      .status(200)
      .json({
        status: true,
        message: "student Updated Successfully",
        data: student,
      });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Delete an Student by ID
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student)
      return res
        .status(200)
        .json({ status: false, error: "student not found",data:[] });
    res.json({ status: true, message: "student deleted successfully" ,data:[]});
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};
