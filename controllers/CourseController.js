const Course = require("../Models/Course");

// Create a new Course
exports.createCourse = async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res
      .status(200)
      .json({ status:true,message: "Course Created Successfully", data: newCourse });
  } catch (error) {
    res.status(400).json({ status:false,error: error.message });
  }
};

// Get all Course
exports.getAllCourse = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const startIndex = (page - 1) * limit;
    const courses_lists = await Course.find().skip(startIndex).limit(limit).populate({path:'category_id',select:"category_name"}).populate({path:'subcategory_id',select:"subcategory_name"});
    
    const courselist= courses_lists.map(course => ({
      _id: course._id,
      course_name: course.course_name,
      category_name: course.category_id.category_name,
      subcategory_name: course.subcategory_id.subcategory_name,
      status: course.status,
    }));
    const totalCourse = await Course.countDocuments();
    const totalPages = Math.ceil(totalCourse / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    res.status(200).json({
      status: true,
      message: "Course Listed Successfully",
      data: courselist,
      paginate: {
        total_count: totalCourse,
        current_page: page,
        next_page: nextPage ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({ status:false,error: error.message });
  }
};

// Get a single Course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({status:false, error: "Course not found" });
    res
      .status(200)
      .json({status:true, message: "Single Course Listed Successfully", data: course });
  } catch (error) {
    res.status(500).json({ status:false,error: error.message });
  }
};

// Update an Course by ID
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) return res.status(404).json({ status:false,error: "Course not found" });
    res
      .status(200)
      .json({status:true, message: "Course Updated Successfully", data: course });
  } catch (error) {
    res.status(500).json({ status:false,error: error.message });
  }
};

// Delete an Course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({status:false, error: "Course not found" });
    res.json({status:true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({status:false, error: error.message });
  }
};
