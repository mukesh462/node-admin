const Student = require("../Models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginStudent = async (req, res) => {
  const { email, pwd } = req.body;

  try {
    if (!email || !pwd) {
      return res.status(200).json({ status: false, message: "Email and password are required" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(200).json({ status: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(pwd, student.pwd);
    if (!isMatch) {
      return res.status(200).json({ status: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { pwd: _, ...studentData } = student._doc;

    res.status(200).json({
      status: true,
      message: "Login successful",
      data: { student: studentData, token },
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};
