const Assessment = require("../Models/Assessment");
const Student = require("../Models/Student");
const TaskSubmit = require("../Models/TaskSubmit");

const mongoose = require("mongoose");

exports.createTask = async (req, res) => {
  try {
    const {
      title,
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
      title,
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
    const category = await Assessment.find()
      .sort({ start_date: -1 })
      .skip(startIndex)
      .limit(limit);
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
        .status(200)
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
          "particular_id.value": {
            $in: [
              new mongoose.Types.ObjectId(student.batch_id),
              student.batch_id.toString(),
            ],
          },
        },
      ],
      start_date: { $lte: currentDate },
      end_date: { $gte: currentDate },
    };

    const tasks = await Assessment.find(query).sort({ start_date: -1 });

    // if (!tasks.length) {
    //   return res
    //     .status(200)
    //     .json({ status: true, message: "No tasks found", data: [] });
    // }

    const submittedTasks = await TaskSubmit.find({ student_id: user_id });
    const submittedTaskIds = submittedTasks.map(
      (submission) => submission.assessment_id
    );

    const finalResult = tasks.map((task) => {
      const isSubmitted = submittedTaskIds.includes(task._id.toString());

      // Time-specific validation
      // const taskStartTime = new Date(task.start_time).getHours();
      // const taskEndTime = new Date(task.end_time).getHours();
      // const currentHour = currentDate.getHours();
      // const isTimeActive =
      //   currentHour >= taskStartTime && currentHour <= taskEndTime;

      return {
        ...task._doc,
        submission_status: isSubmitted ? 1 : 0,
        // time_active: isTimeActive ? 1 : 0,
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
          "particular_id.value": {
            $in: [
              new mongoose.Types.ObjectId(student.batch_id),
              student.batch_id.toString(),
            ],
          },
        },
      ],
      start_date: { $lte: currentDate },
      end_date: { $gte: currentDate },
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
      // const isSubmitted = submittedTaskIds.includes(task._id.toString());
      const status =submittedTasks.find((data)=> data.assessment_id == task._id ) ;
      return {
        ...task._doc,
        submission_status: status != undefined ? status?.status : 0,
        mark:  status != undefined ? status.questions.filter(e=> e.review =='yes').length : null
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
exports.createTaskSubmission = async (req, res) => {
  try {
    const { questions, student_id, assessment_id, status } = req.body;

    if (!questions || !student_id || !assessment_id) {
      return res.status(400).json({
        status: false,
        message: "Questions, Student ID, and Assessment ID are required",
      });
    }

    const existingSubmission = await TaskSubmit.findOne({
      student_id,
      assessment_id,
    });

    if (existingSubmission) {
      return res.status(400).json({
        status: false,
        message:
          "Task has already been submitted by this student for this assessment",
      });
    }

    const newTaskSubmission = new TaskSubmit({
      questions: questions,
      student_id,
      assessment_id,
      status: "0",
    });

    const savedTaskSubmission = await newTaskSubmission.save();

    res.status(201).json({
      status: true,
      message: "Task submission created successfully",
      data: savedTaskSubmission,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
exports.viewSubmittedAnswer = async (req, res) => {
  try {
    const { student_id, assessment_id } = req.body;

    if (!student_id || !assessment_id) {
      return res.status(400).json({
        status: false,
        message: "Student ID and Assessment ID are required",
      });
    }

    const submission = await TaskSubmit.findOne({
      student_id,
      assessment_id,
    });

    if (!submission) {
      return res.status(404).json({
        status: false,
        message: "No submission found for the given student and assessment",
      });
    }

    res.status(200).json({
      status: true,
      message: "Submission retrieved successfully",
      data: submission,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getTaskSubmissions = async (req, res) => {
  try {
    const { assessment_id, page = 1, limit = 10 } = req.body;

    if (!assessment_id) {
      return res.status(400).json({
        status: false,
        message: "Assessment ID is required",
      });
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const submissions = await TaskSubmit.find({ assessment_id })
      .populate("student_id", "name email")
      .skip(skip)
      .limit(limitNum);

    const totalSubmissions = await TaskSubmit.countDocuments({ assessment_id });
    const totalPages = Math.ceil(totalSubmissions / limitNum);
    const nextPage = pageNum < totalPages ? pageNum + 1 : null;

    res.status(200).json({
      status: true,
      message: "Task submissions listed successfully",
      data: submissions.map((submission) => ({
        submission_id: submission._id,
        student_name: submission.student_id?.name || "Unknown",
        student_email: submission.student_id?.email || "Unknown",
        task: submission.task,
        status: submission.status,
        profile: submission.student_id?.profile || null,
        assessment_id: submission.assessment_id,
        student_id: submission.student_id?._id,
      })),
      paginate: {
        total_count: totalSubmissions,
        current_page: pageNum,
        next_page: nextPage,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.updateTaskSubmission = async (req, res) => {
  try {
    const { main_id } = req.body;

    if (!main_id) {
      return res.status(400).json({
        status: false,
        message: "Submission ID is required",
      });
    }

    const updatedFields = req.body;

    const updatedSubmission = await TaskSubmit.findByIdAndUpdate(
      main_id,
      { $set: updatedFields },
      { new: true } 
    );

    if (!updatedSubmission) {
      return res.status(404).json({
        status: false,
        message: "Task submission not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Task submission updated successfully",
      data: updatedSubmission,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
