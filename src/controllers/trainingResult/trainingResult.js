import SemsterModel from "../../../DB/models/semster.model.js";
import settingModel from "../../../DB/models/setting.model.js";
import trainingmodel from "../../../DB/models/training.model.js";
import trainingResultModel from "../../../DB/models/trainingResult.model.js";
import userModel from "../../../DB/models/user.model.js";
import { roles } from "../../middleware/auth.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const createTrainingResult = asyncHandler(async (req, res, next) => {
  const { trainingId } = req.body;
  let { studentId, semsterId } = req.body;

  // Check if the training exists
  const training = await trainingmodel.findById(trainingId);
  if (!training || training.OpenForRegister == false) {
    return next(
      new Error("Invalid Training Id not found or not allow to register", {
        cause: 404,
      })
    );
  }

  const setting = await settingModel.findOne();

  // If the user is an instructor
  if (req.user.role === roles.instructor) {
    if (req.user._id.toString() !== training.instructor_id.toString()) {
      return next(
        new Error("You are not allowed to add students to this training", {
          cause: 403,
        })
      );
    }
    if (!studentId) {
      return next(new Error("StudentId is required", { cause: 400 }));
    }
    // Check if student id exists
    const student = await userModel.findById(studentId);
    if (!student) {
      return next(new Error("Student not found", { cause: 404 }));
    }
    studentId = student._id;
    semsterId = setting.MainSemsterId;
  }

  // If the user is a student
  if (req.user.role === roles.stu) {
    studentId = req.user._id;
    semsterId = setting.MainSemsterId;
  }

  // If the user is an admin
  if (req.user.role === roles.admin) {
    if (!studentId) {
      return next(new Error("StudentId is required", { cause: 400 }));
    }
    // Check if student id exists
    const student = await userModel.findById(studentId);
    if (!student) {
      return next(new Error("Student not found", { cause: 404 }));
    }
    if (semsterId) {
      const semster = await SemsterModel.findById(semsterId);
      if (!semster) {
        return next(new Error("Semester not found", { cause: 404 }));
      }
      semsterId = semster._id;
    } else {
      semsterId = setting.MainSemsterId;
    }
  }

  // Find existing training results
  const trainingResults = await trainingResultModel.find({
    semsterId: semsterId,
    studentId: studentId,
  });

  // Check if the user is allowed to register more trainings
  if (trainingResults.length >= setting.MaxAllowTrainingToRegister) {
    return next(
      new Error("This user can't register more trainings", { cause: 400 })
    );
  }

  // Check to make sure the user has not registered for this course before
  if (
    trainingResults.some(
      (ele) => ele.trainingId.toString() === trainingId.toString()
    )
  ) {
    return next(
      new Error("Student already registered for this course", { cause: 400 })
    );
  }

  const newTrainingResult = {
    studentId: studentId,
    trainingId: trainingId,
    Status: "pending",
    semsterId: semsterId,
  };

  const result = await trainingResultModel.create(newTrainingResult);
  if (!result) {
    return next(new Error("Server error. Try again later.", { cause: 500 }));
  }
  return res
    .status(201)
    .json({ message: "Done", registerTraining: result, training: training });
});

export const deleteTrainingResult = asyncHandler(async (req, res, next) => {
  const { TrainingResultId } = req.query;
  const trainingResult = await trainingResultModel
    .findById(TrainingResultId)
    .populate({
      path: "trainingId",
      select: "training_name instructor_id _id",
    });

  if (!trainingResult) {
    return next(new Error("Training result not found", { cause: 404 }));
  }

  const setting = await settingModel.findOne();

  // Check permissions based on user role
  if (req.user.role === roles.stu) {
    if (req.user._id.toString() !== trainingResult.studentId.toString()) {
      return next(
        new Error("You are not authorized to delete this training result", {
          cause: 403,
        })
      );
    }

    if (["accepted", "uploaded"].includes(trainingResult.Status)) {
      return next(
        new Error(
          "You are not allowed to delete this training result after it has been accepted or uploaded",
          { cause: 403 }
        )
      );
    }

    if (
      trainingResult.semsterId.toString() != setting.MainSemsterId.toString()
    ) {
      return next(
        new Error("not allow to delete this training result", { cause: 403 })
      );
    }
  }

  if (req.user.role === roles.instructor) {
    if (
      req.user._id.toString() !==
      trainingResult.trainingId.instructor_id.toString()
    ) {
      return next(
        new Error(
          "You are not authorized to delete this training result for this training",
          { cause: 403 }
        )
      );
    }

    if (
      trainingResult.semsterId.toString() != setting.MainSemsterId.toString()
    ) {
      return next(
        new Error("not allow to delete this training result", {
          cause: 403,
        })
      );
    }
  }

  // Delete the training result

  const result = await trainingResult.deleteOne();

  if (result.deletedCount === 0) {
    return next(
      new Error("Training result not deleted successfully", { status: 400 })
    );
  }

  return res
    .status(200)
    .json({ message: "Training result deleted successfully", result });
});

export const updateTrainingResult = asyncHandler(async (req, res, next) => {
  // get data
  const { TrainingResultId } = req.query;
  const { Status, trainingId, studentId, grade } = req.body;

  // Check if the training result exists in the database
  const trainingResult = await trainingResultModel
    .findById(TrainingResultId)
    .populate({
      path: "trainingId",
      select: "training_name instructor_id _id",
    });

  if (!trainingResult) {
    return next(new Error("Training result not found", { status: 404 }));
  }

  // Check permissions based on user role (instructor)
  if (req.user.role === roles.instructor) {
    if (
      req.user._id.toString() !==
      trainingResult.trainingId.instructor_id.toString()
    ) {
      return next(
        new Error(
          "You are not authorized to update this training result for this training",
          { status: 403 }
        )
      );
    }

    // Check if the semester matches the main semester
    if (
      trainingResult.semesterId.toString() !== setting.MainSemesterId.toString()
    ) {
      return next(
        new Error("Not allowed to update this training result", { status: 403 })
      );
    }
  }

  // Update grade and status if provided
  if (grade) trainingResult.grade = grade;
  if (Status) trainingResult.Status = Status;

  // training Id edit
  if (
    trainingId &&
    trainingId.toString() !== trainingResult.trainingId.toString()
  ) {
    const newTraining = await trainingmodel.findById(trainingId);

    if (!newTraining) {
      return next(new Error("Training not found", { status: 404 }));
    }
    // check if he instructor and he allow to edit for this
    if (req.user.role == roles.instructor) {
      if (req.user._id.toString() !== newTraining.instructor_id.toString()) {
        return next(
          new Error("you not Allow to Edit student for this training", {
            cause: 403,
          })
        );
      }
    }

    trainingResult.trainingId = newTraining._id;
  }

  // Edit student
  if (
    studentId &&
    studentId.toString() !== trainingResult.studentId.toString()
  ) {
    // check if studentId Exist
    const student = await userModel.findById(studentId);
    if (!student) {
      return next(new Error("Student not found", { status: 404 }));
    }

    trainingResult.studentId = studentId;
  }
  // Save the updated training result
  const result = await trainingResult.save();

  return res.status(200).json({ message: "Updated successfully", result });
});

export const getSingleTrainingResult = asyncHandler(async (req, res, next) => {
  // Find training results for the logged-in user
  const trainingResults = await trainingResultModel
    .find({ studentId: req.user._id })
    .populate({
      path: "trainingId",
      populate: {
        path: "instructor_id",
        select: "FullName email gender department",
      },
    });

  // Return the training results
  return res.status(200).json({
    message: "Retrieved training results successfully",
    trainingResults,
  });
});

export const SearchTrainingResult = asyncHandler(async (req, res, next) => {
  const { semsterId, studentId, trainingId } = req.body;
  const allowFields = ["studentId", "trainingId", "Status", "semsterId"];
  const searchFieldsText = ["Status"];
  const searchFieldsIds = ["_id", "studentId", "trainingId", "semsterId"];

  const optionsInstructor = {
    select: "FullName email phone gender department",
    path: "instructor_id",
  };
  const optionStudent = {
    select: "Full_Name National_Id Student_Code PhoneNumber gender department",
    path: "studentId",
  };
  const optionSemster = {
    select: "term year name",
    path: "semsterId",
  };
  const optionTraining = {
    path: "trainingId",
    select:
      "start_date training_name end_date requirements desc max_student instructor_id OpenForRegister",
    populate: optionsInstructor,
  };

  let filters = {};
  if (semsterId) filters.studentId = semsterId;
  if (trainingId) filters.trainingId = trainingId;
  if (studentId) filters.studentId = studentId;

  const apiFeatureInstance = new ApiFeature(
    trainingResultModel.find(filters),
    req.query,
    allowFields
  )
    .pagination()
    .sort()
    .select()
    .filter()
    .populate(optionTraining)
    .populate(optionSemster)
    .populate(optionStudent)
    .search({ searchFieldsText, searchFieldsIds });

  const training = await apiFeatureInstance.MongoseQuery;

  return res
    .status(200)
    .json({ message: "Done All training Information", training });
});
