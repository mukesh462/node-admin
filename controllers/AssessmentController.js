const Assessment = require("../Models/Assessment");
const Student = require("../Models/Student");
const TaskSubmit = require("../Models/TaskSubmit");
exports.createTask = async (req, res) => {
  try {
    const {
      assessment_type,
      particular_id,
      start_date,
      end_date,
      start_time,
      end_time,
      questions,
    } = req.body;

    if (
      !assessment_type ||
      !particular_id ||
      !start_date ||
      !end_date ||
      !start_time ||
      !end_time ||
      !questions
    ) {
      return res
        .status(200)
        .json({ status: false, message: "All fields are required" });
    }

    const newTask = new Assessment({
      assessment_type,
      particular_id,
      start_date,
      end_date,
      start_time,
      end_time,
      questions,
    });

    await newTask.save();

    res.status(201).json({
      status: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

exports.getAllTask = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const startIndex = (page - 1) * limit;
    const category = await Assessment.find().skip(startIndex).limit(limit);
    const totalCategory = await Assessment.countDocuments();
    const totalPages = Math.ceil(totalCategory / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    res.status(200).json({
      status: true,
      message: "Assessment Listed Successfully",
      data: category,
      paginate: {
        total_count: totalCategory,
        current_page: page,
        next_page: nextPage ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.myTaskList = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res
        .status(400)
        .json({ status: false, message: "User ID is required" });
    }

    const currentDate = new Date();

    const student = await Student.findById(user_id);
    if (!student) {
      return res
        .status(404)
        .json({ status: false, message: "Student not found" });
    }

    const query = {
      $or: [
        {
          assessment_type: "student",
          "particular_id.value": user_id,
        },
        {
          assessment_type: "batch",
          "particular_id.value": student.batch_id,
        },
      ],
      start_date: { $lte: currentDate },
      end_date: { $gte: currentDate },
      start_time: { $lte: currentDate },
      end_time: { $gte: currentDate },
    };

    const tasks = await Assessment.find(query).sort({ start_date: 1 });

    if (!tasks.length) {
      return res
        .status(200)
        .json({ status: true, message: "No tasks found", data: [] });
    }

    const submittedTasks = await TaskSubmit.find({ student_id: user_id });
    const submittedTaskIds = submittedTasks.map(
      (submission) => submission.assessment_id
    );

    const finalResult = tasks.map((task) => {
      const isSubmitted = submittedTaskIds.includes(task._id.toString());
      return {
        ...task._doc,
        submission_status: isSubmitted ? 1 : 0,
      };
    });

    res.status(200).json({
      status: true,
      message: "Tasks listed successfully",
      data: finalResult,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    const category = await Assessment.findByIdAndDelete(req.params.id);
    if (!category)
      return res
        .status(500)
        .json({ status: false, message: "Assessment not found", data: [] });
    res.json({ status: true, message: "Assessment deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const batch = await Assessment.findById(req.params.id);
    if (!batch)
      return res
        .status(200)
        .json({ status: false, message: "Batch not found", data: [] });
    res.status(200).json({
      status: true,
      message: "Single Assessment Listed Successfully",
      data: batch,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.taskHistory = async (req, res) => {
  try {
    const { user_id, page = 1, limit = 10 } = req.body;

    if (!user_id) {
      return res
        .status(400)
        .json({ status: false, message: "User ID is required" });
    }

    const student = await Student.findById(user_id);
    if (!student) {
      return res
        .status(404)
        .json({ status: false, message: "Student not found" });
    }

    const currentDate = new Date();
    const startIndex = (page - 1) * limit;

    const query = {
      $or: [
        {
          assessment_type: "student",
          "particular_id.value": user_id,
        },
        {
          assessment_type: "batch",
          "particular_id.value": student.batch_id,
        },
      ],
      end_date: { $lt: currentDate },
    };

    const totalAssessments = await Assessment.countDocuments(query);
    const totalPages = Math.ceil(totalAssessments / limit);
    const nextPage = page < totalPages ? page + 1 : null;

    const expiredTasks = await Assessment.find(query)
      .sort({ end_date: -1 })
      .skip(startIndex)
      .limit(limit);

    const submittedTasks = await TaskSubmit.find({ student_id: user_id });
    const submittedTaskIds = submittedTasks.map(
      (submission) => submission.assessment_id
    );

    const finalResult = expiredTasks.map((task) => {
      const isSubmitted = submittedTaskIds.includes(task._id.toString());
      return {
        ...task._doc,
        submission_status: isSubmitted ? 1 : 0,
      };
    });

    res.status(200).json({
      status: true,
      message: "Expired tasks listed successfully",
      data: finalResult,
      paginate: {
        total_count: totalAssessments,
        current_page: page,
        next_page: nextPage ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};
