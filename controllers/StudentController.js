const Student = require("../Models/Student");
const bcrypt = require("bcryptjs");

// Create a new Student
exports.createStudent = async (req, res) => {
  try {
    const { pwd, ...studentData } = req.body;
    const hashedPassword = await bcrypt.hash(pwd, 10);
    const newStudent = new Student({
      ...studentData,
      pwd: hashedPassword,
      profile: req.file ? `uploads/${req.file.filename}` : null,
    });
    await newStudent.save();
    res.status(200).json({
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
    const student = await Student.find()
      .skip(startIndex)
      .limit(limit)
      .populate({ path: "batch_id", select: "batch_name" });
    const studentData = student.map((students) => ({
      _id: students.id,
      name: students.name,
      batch_name: students.batch_id.batch_name,
      status: students.status,
      email: students.email,
      phone_number: students.pnumber,
      profile: students.profile,
    }));
    const totalStudent = await Student.countDocuments();
    const totalPages = Math.ceil(totalStudent / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    res.status(200).json({
      status: true,
      message: "Student Listed Successfully",
      data: studentData,
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
    if (!student)
      return res.status(200).json({ error: "student not found", data: [] });
    res.status(200).json({
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
    let updatedData = { ...req.body };

    if (req.file) {
      updatedData.profile = `uploads/${req.file.filename}`;
    }

    const getOldPassword = await Student.findById(req.params.id);
    if (getOldPassword && getOldPassword.pwd !== req.body.pwd) {
      updatedData.pwd = await bcrypt.hash(req.body.pwd, 10);
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res
        .status(404)
        .json({ status: false, error: "Student not found", data: [] });
    }

    res.status(200).json({
      status: true,
      message: "Student updated successfully",
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
        .json({ status: false, error: "student not found", data: [] });
    res.json({
      status: true,
      message: "student deleted successfully",
      data: [],
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};
exports.studentAll = async (req, res) => {
  try {
    const student = await Student.find();
    if (!student)
      return res
        .status(200)
        .json({ status: false, error: "student not found", data: [] });
    res.json({
      status: true,
      message: "student listed successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};
