const Materiallink = require("../Models/Materiallink");
const Myclass = require("../Models/Myclass");
const Student = require("../Models/Student");

// Create a new myclass
exports.createMyclass = async (req, res) => {
  try {
    const newmyclass = new Myclass(req.body);
    await newmyclass.save();
    res.status(200).json({
      status: true,
      message: "myclass Created Successfully",
      data: newmyclass,
    });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
};

// Get all myclass
exports.getAllMyclass = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const startIndex = (page - 1) * limit;
    const myclass = await Myclass.find().skip(startIndex).limit(limit);
    const totalMyclass = await Myclass.countDocuments();
    const totalPages = Math.ceil(totalMyclass / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    res.status(200).json({
      status: true,
      message: "Myclass Listed Successfully",
      data: myclass,
      paginate: {
        total_count: totalMyclass,
        current_page: page,
        next_page: nextPage ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Get a single myclass by ID
exports.getMyclassById = async (req, res) => {
  try {
    const myclass = await Myclass.findById(req.params.id);
    if (!myclass) {
      return res.status(200).json({ status: false, error: "myclass not found", data: [] });
    }

    // Use $in to find all materials that match the IDs in myclass.materials
    const material_ids = await Materiallink.find({
      _id: { $in: myclass.materials }
    }).select("name _id");

    // Map the materials to label-value pairs
    const materialList = material_ids.map((e) => ({ label: e.name, value: e._id }));
    myclass.materials = materialList;

    res.status(200).json({
      status: true,
      message: "Single myclass Listed Successfully",
      data: myclass,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};


// Update an myclass by ID
exports.updateMyclass = async (req, res) => {
  try {
    const myclass = await Myclass.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!myclass)
      return res
        .status(200)
        .json({ status: false, error: "myclass not found", data: [] });
    res.status(200).json({
      status: true,
      message: "myclass Updated Successfully",
      data: myclass,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Delete an myclass by ID
exports.deleteMyclass = async (req, res) => {
  try {
    const myclass = await Myclass.findByIdAndDelete(req.params.id);
    if (!myclass)
      return res
        .status(200)
        .json({ status: false, error: "myclass not found", data: [] });
    res.json({
      status: true,
      message: "myclass deleted successfully",
      data: [],
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

//My classes
exports.Myclasses = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(200).json({ message: "user_id are required" });
    }
    const check_student = await Student.findOne({ _id: user_id });

    if (!check_student) {
      return res.status(200).json({ message: "user_id Invalid" });
    }
    //get calsses for particular student
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const studentClasses = await Myclass.find({
      $or: [
        {
          class_type: "1",
          batch_or_student_id: check_student.batch_id,
          date: { $gte: startOfDay, $lt: endOfDay },
        },
        {
          class_type: "2",
          batch_or_student_id: user_id,
          date: { $gte: startOfDay, $lt: endOfDay },
        },
      ],
    }).populate({path:"instructor_id"});

    if (!studentClasses) {
      return res
        .status(200)
        .json({ status: false, message: "data listed successfully", data: [] });
    }

    const material_ids = studentClasses.flatMap(
      (studentclass) => studentclass.materials
    );
    const materials = await Materiallink.find({
      _id: { $in: material_ids },
    });

    const materialsMap = materials.reduce((map, material) => {
      map[material._id.toString()] = material;
      return map;
    }, {});

    const finalResult = studentClasses.map((studentClass) => {
      return {
        ...studentClass._doc,
        materials: studentClass.materials.map((id) => materialsMap[id]),
      };
    });

    return res
      .status(200)
      .json({
        status: true,
        message: "data listed successfully",
        data: finalResult,
      });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

//My Records
exports.MyRecords = async (req, res) => {
  try {
    const { user_id } = req.body;
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const startIndex = (page - 1) * limit;

    if (!user_id) {
      return res.status(200).json({ message: "user_id is required", status: false });
    }

    const check_student = await Student.findOne({ _id: user_id });
    if (!check_student) {
      return res.status(200).json({ message: "user_id is invalid", status: false });
    }

    const query = {
      $and: [
        {
          $or: [
            { class_type: "1", batch_or_student_id: check_student.batch_id },
            { class_type: "2", batch_or_student_id: user_id },
          ],
        },
        { recordingUrl: { $ne: null } }, // recordingUrl is not null
        { recordingUrl: { $ne: "" } },  // recordingUrl is not an empty string
      ],
    };

    const studentClasses = await Myclass.find(query)
      .skip(startIndex)
      .limit(limit)
      .populate({path:"instructor_id"}); // Populate instructor's name

    const totalMyclass = await Myclass.countDocuments(query);
    const totalPages = Math.ceil(totalMyclass / limit);
    const nextPage = page < totalPages ? page + 1 : null;

    if (!studentClasses || studentClasses.length === 0) {
      return res.status(200).json({
        status: true,
        message: "Data listed successfully",
        data: [],
      });
    }

    const material_ids = studentClasses.flatMap((studentClass) => studentClass.materials);
    const materials = await Materiallink.find({ _id: { $in: material_ids } });

    const materialsMap = materials.reduce((map, material) => {
      map[material._id.toString()] = material;
      return map;
    }, {});

    const finalResult = studentClasses.map((studentClass) => {
      return {
        ...studentClass._doc,
        materials: studentClass.materials.map((id) => materialsMap[id]),
        instructor_name: studentClass.instructor?.name, // Add instructor name if populated
      };
    });

    return res.status(200).json({
      status: true,
      message: "Data listed successfully",
      data: finalResult,
      paginate: {
        total_count: totalMyclass,
        current_page: page,
        next_page: nextPage,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

