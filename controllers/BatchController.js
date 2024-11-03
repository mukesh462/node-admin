const Batch = require("../Models/Batch");
const mongoose = require("mongoose");
const Course = require("../Models/Course");

// Create a new batch
exports.createBatch = async (req, res) => {
  try {
    if (req.body.course_id) {
      req.body.course_id = new mongoose.Types.ObjectId(req.body.course_id);
    }

    const newBatch = new Batch(req.body);
    await newBatch.save();
    res
      .status(200)
      .json({
        status: true,
        message: "Batch Created Successfully",
        data: newBatch,
      });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Get all Batches
exports.getAllBatch = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const startIndex = (page - 1) * limit;
    const batch = await Batch.find().populate({path:'course_id',select:"course_name"}).skip(startIndex).limit(limit);
    console.log('Batches:', batch);

    const courses = await Course.find({}, "course_name");

    const courseMap = courses.reduce((map, course) => {
      map[course._id.toString()] = course.course_name;
      return map;
    }, {});

    const batches = await Batch.find().skip(startIndex).limit(limit);

    const batchData = batches.map((batch) => ({
      _id: batch._id,
      batch_name: batch.batch_name,
      course_name: courseMap[batch.course_id?.toString()] || null,
      status: batch.status,
    }));
    const totalBatch = await Batch.countDocuments();
    const totalPages = Math.ceil(totalBatch / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    res.status(200).json({
      status: true,
      message: "Batch Listed Successfully",
      data: batchData,
      paginate: {
        total_count: totalBatch,
        current_page: page,
        next_page: nextPage ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Get a single batch by ID
exports.getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch)
      return res
        .status(200)
        .json({ status: false, error: "Batch not found", data: [] });
    res
      .status(200)
      .json({
        status: true,
        message: "Single Batch Listed Successfully",
        data: batch,
      });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Update an Batch by ID
exports.updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!batch)
      return res
        .status(200)
        .json({ status: false, error: "Batch not found", data: [] });
    res
      .status(200)
      .json({
        status: true,
        message: "Batch Updated Successfully",
        data: batch,
      });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Delete an batch by ID
exports.deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch)
      return res.status(200).json({ status: false, error: "Batch not found" });
    res.json({ status: true, message: "Batch deleted successfully", data: [] });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

exports.getBatchAll = async (req, res) => {
  try {
    const batch = await Batch.find({ status: "1" });
    if (batch.length === 0) {
      return res
        .status(200)
        .json({ message: "No batch found", data: [], status: true });
    }
    res.status(200).json({
      status: true,
      message: "Batch Listed Successfully",
      data: batch,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};
