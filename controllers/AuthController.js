const Student = require("../Models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginStudent = async (req, res) => {
  const { email, pwd } = req.body;

  try {
    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(pwd, student.pwd);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("JWT Secret:", process.env.JWT_SECRET);

    // Generate JWT token
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with token
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
