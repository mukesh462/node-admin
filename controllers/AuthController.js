const Student = require("../Models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginStudent = async (req, res) => {
  const { email, pwd } = req.body || {};
  // console.log(req.body, "bodyyyy");
  if (!email || !pwd) {
    return res
      .status(200)
      .json({ status: false, message: "Email and password are required" });
  }
  try {
    // Find student and populate batch details
    const student = await Student.findOne({ email }).populate({ path: "batch", strictPopulate: false });
    if (!student) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(pwd, student.pwd);
    if (!isMatch) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid email or password" });
    }

    if (student.status != 1) {
      return res
        .status(200)
        .json({ status: false, message: "Temporary Inactive. Contact Admin." });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Prepare response data
    const {  ...studentData } = student._doc;
    const batchName = student?.batch_id;
    // console.log(batchName,'ddd')

    res.status(200).json({
      status: true,
      message: "Login successful",
      data: { student: { ...studentData, batchName }, token },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
