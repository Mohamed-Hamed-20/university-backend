import trainingmodel from "../../../DB/models/training.model.js";
import TrainingRegisterModel from "../../../DB/models/trainingRegister.model.js";
import trainingResultModel from "../../../DB/models/trainingResult.model.js";
import userModel from "../../../DB/models/user.model.js";
import { roles } from "../../middleware/auth.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const uploadTrainingResult = asyncHandler(async (req, res, next) => {
  const { trainingId, studentId, grade } = req.body;
  // check if he allow to upload grates to this training
  if (req.user.role == roles.instructor) {
    if (!req.user.Training.includes(trainingId)) {
      return next(
        new Error("you not allow to upload Grates to this training", {
          cause: 403,
        })
      );
    }
  }

  // Check if the training exists
  const Register = await TrainingRegisterModel.findOne({
    studentId: studentId,
    trainingRegisterd: { $in: trainingId },
  });
  if (!Register || !Register.trainingRegisterd.includes(trainingId)) {
    return next(
      new Error("This user didn't Register this Training", {
        cause: 404,
      })
    );
  }

  // filter trainingRegisterd and delete trainingId from Register
  const newtrainingRegisterd = Register.trainingRegisterd.filter((ele) => {
    return ele.toString() != trainingId.toString();
  });
  Register.trainingRegisterd = newtrainingRegisterd;

  // create object for result
  const TrainingResult = {
    studentId,
    trainingId,
    grade,
  };
  const result = await trainingResultModel.create(TrainingResult);
  if (!result) {
    return next(new Error("server Error", { cause: 500 }));
  }
  // update Register training document
  await Register.save();
  return res.status(201).json({ message: "Done", TrainingResult: result });
});

export const deleteTrainingResult = asyncHandler(async (req, res, next) => {
  const { TrainingResultId, BackToRegister } = req.query;

  const TrainingResult = await trainingResultModel.findById(TrainingResultId);

  if (!TrainingResult) {
    return next(new Error("Training result not found", { cause: 404 }));
  }

  // check if he allow to upload grates to this training
  if (req.user.role == roles.instructor) {
    if (!req.user.Training.includes(TrainingResult.trainingId.toString())) {
      return next(
        new Error("you not allow to delete Grates to this training", {
          cause: 403,
        })
      );
    }
  }

  //delete this TrainingResult
  const result = await TrainingResult.deleteOne();
  if (result.deletedCount == 0) {
    return next(
      new Error("server error Try later Not deleted successfully", {
        cause: 500,
      })
    );
  }

  let newregister;
  if (BackToRegister === "yes") {
    const register = await TrainingRegisterModel.findOne({
      studentId: TrainingResult.studentId,
    });
    if (!register) {
      return next(
        new Error("register documant for user Not found", { cause: 404 })
      );
    }

    register.trainingRegisterd.push(TrainingResult.trainingId);
    newregister = await register.save();
    if (!newregister) {
      return next(new Error("Not updated successfully"));
    }
  }
  // response
  return res.status(200).json({
    message: "Training result deleted successfully",
    result: result,
  });
});

export const updateTrainingResult = asyncHandler(async (req, res, next) => {
  // get data
  const { TrainingResultId } = req.query;
  const { trainingId, studentId, grade } = req.body;

  // Check if the training result exists in the database
  const trainingResult = await trainingResultModel.findById(TrainingResultId);

  if (!trainingResult) {
    return next(new Error("Training result not found", { status: 404 }));
  }

  // check if he allow to upload grates to this training
  if (req.user.role == roles.instructor) {
    if (!req.user.Training.includes(trainingResult.trainingId)) {
      return next(
        new Error("you not allow to delete update to this training", {
          cause: 403,
        })
      );
    }
  }

  // Update grade and status if provided
  if (grade) trainingResult.grade = grade;

  // training Id edit
  if (
    trainingId &&
    trainingId.toString() !== trainingResult.trainingId.toString()
  ) {
    const newTraining = await trainingmodel.findById(trainingId);

    if (!newTraining || newTraining.OpenForRegister == false) {
      return next(
        new Error("Training not found or not availabe to register", {
          status: 404,
        })
      );
    }

    // check if he instructor and he allow to edit for this
    if (req.user.role == roles.instructor) {
      if (!req.user.Training.includes(newTraining._id)) {
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
  const { TrainingResultId } = req.query;
  const optionTraining = {
    path: "trainingId",
    select:
      "start_date training_name end_date requirements desc max_student instructor_id OpenForRegister",
  };
  const optionStudent = {
    select: "Full_Name National_Id Student_Code PhoneNumber gender department",
    path: "studentId",
  };

  const trainingResults = await trainingResultModel
    .findById(TrainingResultId)
    .populate(optionStudent)
    .populate(optionTraining);

  if (!trainingResults) {
    return next(new Error("Invalid Training Result Id", { cause: 404 }));
  }

  // if he is instructor
  if (req.user.role == roles.instructor) {
    if (
      !req.user.Training.includes(trainingResults.trainingId._id.toString())
    ) {
      return next(new Error("Not allow to view this result", { cause: 403 }));
    }
  }
  // if he is student
  if (req.user.role == roles.stu) {
    if (req.user._id.toString() !== trainingResults.studentId._id.toString()) {
      return next(new Error("Not allow to view this result", { cause: 403 }));
    }
  }

  // Return the training results
  return res.status(200).json({
    message: "Retrieved training results successfully",
    trainingResults,
  });
});

export const SearchTrainingResult = asyncHandler(async (req, res, next) => {
  const { studentId, trainingId } = req.body;
  const allowFields = ["studentId", "trainingId", "grade"];
  const searchFieldsText = ["grade"];
  const searchFieldsIds = ["_id", "studentId", "trainingId"];

  //Apply Filters
  const filters = {};
  if (trainingId) filters.trainingId = trainingId;
  if (studentId) filters.studentId = studentId;

  // check he allow to view this result
  if (req.user.role == roles.instructor) {
    if (!trainingId) {
      return next(new Error("trainingId must Be provided", { cause: 400 }));
    }

    if (!req.user.Training.includes(trainingId.toString())) {
      return next(
        new Error("You not Allow to view this training Result", { cause: 403 })
      );
    }
    filters.trainingId = trainingId;
  }

  // if he is user
  if (req.user.role == roles.stu) {
    if (studentId) {
      return next(new Error("studentId not allowed", { cause: 400 }));
    }
    filters.studentId = req.user._id;
  }

  const optionStudent = {
    select: "Full_Name National_Id Student_Code PhoneNumber gender department",
    path: "studentId",
  };

  const optionTraining = {
    path: "trainingId",
    select:
      "start_date training_name end_date requirements desc max_student instructor_id OpenForRegister",
  };

  const apiFeatureInstance = new ApiFeature(
    trainingResultModel.find(filters).lean(),
    req.query,
    allowFields
  )
    .pagination()
    .sort()
    .select()
    .filter()
    .populate(optionTraining)
    .populate(optionStudent)
    .search({ searchFieldsText, searchFieldsIds });

  const training = await apiFeatureInstance.MongoseQuery;

  return res
    .status(200)
    .json({ message: "Done All training Information", training });
});
