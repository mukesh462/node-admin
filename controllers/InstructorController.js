const Instructor = require("../Models/Instructor");

// Create a new instructor
exports.createInstructor = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ status: false, message: 'File upload is required' });
      }
      const instructorData = {
        ...req.body,
        profile: `uploads/${req.file.filename}`
      };
      const newInstructor = new Instructor(instructorData);
      await newInstructor.save();
      res
        .status(201)
        .json({ status : true, message: "Instructor Created Successfully", data: newInstructor });
    } catch (error) {
      res.status(400).json({ status : false, error: error.message });
    }
  };

  // Get all Instructor
  exports.getAllInstructor = async (req, res) => {
    try {
     const page = parseInt(req.body.page) || 1;
     const limit = parseInt(req.body.limit) || 10;
     const startIndex = (page - 1) * limit;
     const instructors = await Instructor.find().skip(startIndex).limit(limit);
     const totalInstructors = await Instructor.countDocuments();
     const totalPages = Math.ceil(totalInstructors / limit);
     const nextPage = page < totalPages ? page + 1 : null;
     res.status(200).json({
       status: true,
       message: "Instructors Listed Successfully",
       data: instructors,
       paginate: {
         total_count: totalInstructors,
         current_page: page,
         next_page: nextPage ?? null,
       }
     });
    } catch (error) {
      res.status(500).json({ status : false, error: error.message });
    }
  };

  // Get a single instructor by ID
exports.getInstructorById = async (req, res) => {
    try {
      const instructor = await Instructor.findById(req.params.id);
      if (!instructor) return res.status(404).json({ error: "instructor not found" });
      res.status(200).json({ status : true, message: "Single instructor Listed Successfully", data: instructor });
    } catch (error) {
      res.status(500).json({ status : false, error: error.message });
    }
  };

// Update an instructor by ID
exports.updateInstructor = async (req, res) => {
  try {
    let updatedData = { ...req.body };
    if (req.file) {
      updatedData.profile = `uploads/${req.file.filename}`;
    }
    const instructor = await Instructor.findByIdAndUpdate(req.params.id,updatedData,{ new: true, runValidators: true });
    if (!instructor) {
      return res.status(404).json({ status: false, error: 'Instructor not found' });
    }
    res.status(200).json({
      status: true,
      message: 'Instructor Updated Successfully',
      data: instructor,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};


// Delete an instructor by ID
exports.deleteInstructor = async (req, res) => {
    try {
      const instructor = await Instructor.findByIdAndDelete(req.params.id);
      if (!instructor) return res.status(404).json({ error: 'instructor not found' });
      res.json({  status : true,message: 'instructor deleted successfully' });
    } catch (error) {
      res.status(500).json({ status : false, error: error.message });
    }}
  