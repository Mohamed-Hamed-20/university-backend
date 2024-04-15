import settingModel from "../../../DB/models/setting.model.js";
import trainingmodel from "../../../DB/models/training.model.js";
import TrainingRegisterModel from "../../../DB/models/trainingRegister.model.js";
import { roles } from "../../middleware/auth.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { arrayofstring } from "../../utils/arrayobjectIds.js";
import { GetsingleImg } from "../../utils/aws.s3.js";
import { calclevel, calculateGPA } from "../../utils/calcGrates.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const addTraining = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { trainingId } = req.query;

  // check trainingId
  const training = await trainingmodel.findById(trainingId);
  if (!training || training.OpenForRegister == false) {
    return next(
      new Error("Training not found or not Open For Register", { cause: 404 })
    );
  }

  //=======================================EDIT I THINK=============================
  // check if he allow to take this course
  const { TotalGpa, totalCreditHours } = await calculateGPA({
    studentId: req.user._id,
  });
  const { level } = await calclevel({ totalCreditHours });

  if (!training.AllowLevel?.includes(level)) {
    return next(
      new Error("student level not Allow to Register this course", {
        cause: 401,
      })
    );
  }

  const TrainingRegister = await TrainingRegisterModel.findOne({
    studentId: userId,
  });

  const setting = await settingModel.findOne();

  // check if have enough to Register Training
  if (
    setting.MaxAllowTrainingToRegister <=
    (TrainingRegister?.trainingRegisterd?.length || 0)
  ) {
    return next(
      new Error("you not allow to Register more Training", { cause: 403 })
    );
  }

  let result;
  // if not TrainingRegister
  if (!TrainingRegister) {
    const newTrainingRegister = {
      studentId: userId,
      trainingRegisterd: [training._id],
    };

    result = await TrainingRegisterModel.create(newTrainingRegister);
  }

  // if TrainingRegister
  if (TrainingRegister) {
    // Make sure it's not a duplicate training ID
    if (TrainingRegister.trainingRegisterd.includes(trainingId.toString())) {
      return next(new Error("Training is already registered", { cause: 400 }));
    }

    TrainingRegister.trainingRegisterd.push(trainingId);

    result = await TrainingRegister.save();
  }

  if (!result) {
    return next(new Error("server error", { cause: 404 }));
  }

  // response success
  return res
    .status(201)
    .json({ message: "Training Registerd successfully", result });
});
export const deleteTraining = asyncHandler(async (req, res, next) => {
  // Extract user ID and course ID from the request
  const userId = req.user._id;
  const { trainingId } = req.query;

  // check if the training exists and is open for registration
  const training = await trainingmodel.findById(trainingId);
  if (!training || training.OpenForRegister == false) {
    return next(
      new Error("Training not found or not Open For Register", { cause: 404 })
    );
  }

  // Find the training registration record for the user
  const TrainingRegister = await TrainingRegisterModel.findOne({
    studentId: userId,
  });

  // Check if the user has registered for this training
  if (
    !TrainingRegister ||
    !TrainingRegister.trainingRegisterd.includes(trainingId.toString())
  ) {
    return next(
      new Error("You have not registered for this training yet", {
        cause: 404,
      })
    );
  }

  // Filter out the specified training from the registered trainings
  const newTrainingRegister = TrainingRegister.trainingRegisterd.filter(
    (ele) => ele.toString() !== trainingId.toString()
  );

  // Update the user's training registrations
  TrainingRegister.trainingRegisterd = newTrainingRegister;

  // Save the updated registration record
  const result = await TrainingRegister.save();

  // Return success response
  return res
    .status(200)
    .json({ message: "TrainingId delete successfully", result });
});

export const getTraining = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  let TrainingRegister = await TrainingRegisterModel.findOne({
    studentId: userId,
  })
    .populate({
      path: "studentId",
      select:
        "Full_Name _id Date_of_Birth gender PhoneNumber Student_Code National_Id",
    })
    .populate({
      path: "trainingRegisterd",
      select:
        "start_date training_name end_date requirements desc max_student instructor_id OpenForRegister ImgUrls",
    })
    .lean();

  // if not have create empty one
  if (!TrainingRegister) {
    const newObj = { studentId: userId, trainingRegisterd: [] };
    const newTrainingRegister = await TrainingRegisterModel.create(newObj);
    TrainingRegister = newTrainingRegister;
  }

  // تحميل الصور لكل دورة مسجلة باستخدام Promise.all
  const promises = [];
  TrainingRegister.trainingRegisterd.forEach((training) => {
    if (training.ImgUrls && training.ImgUrls.length > 0) {
      training.images = [];
      training.ImgUrls.forEach((imgName) => {
        promises.push(
          GetsingleImg({ ImgName: imgName }).then(({ url }) => {
            training.images.push({ imgName, url });
          })
        );
      });
    }
  });

  await Promise.all(promises);

  // response success
  return res.status(200).json({
    message: "Training Registerd successfully",
    result: TrainingRegister,
  });
});
export const searchRegisterTraining = asyncHandler(async (req, res, next) => {
  const { trainingId, studentId } = req.query;
  const user = req.user;

  let filters = {};
  if (trainingId) filters.trainingRegisterd = trainingId;
  if (studentId) filters.studentId = studentId;

  // check if the user is allowed to view this courses
  if (user.role === roles.instructor) {
    if (!trainingId) {
      return next(new Error("TrainingId must be provided", { cause: 400 }));
    }
    const Training = await arrayofstring(user.Training);
    if (!Training.includes(trainingId?.toString() || null)) {
      return next(
        new Error("You are not allowed to view who registered this Training", {
          cause: 403,
        })
      );
    }
  }

  const allowFields = ["studentId", "trainingRegisterd"];

  const optionStudent = {
    select:
      "Full_Name National_Id Student_Code department gender PhoneNumber Date_of_Birth",
    path: "studentId",
  };

  const optionTraining = {
    path: "trainingRegisterd",
    match: { _id: trainingId },
    select:
      "start_date training_name end_date requirements desc max_student instructor_id OpenForRegister",
  };

  const searchFieldsIds = ["studentId", "trainingRegisterd"];
  const searchFieldsText = ["studentId.Full_Name"];

  const apiFeatureInstance = new ApiFeature(
    TrainingRegisterModel.find(filters).lean(),
    req.query,
    allowFields
  )
    .pagination()
    .sort()
    .select()
    .search({ searchFieldsText, searchFieldsIds })
    .populate(optionStudent)
    .populate(optionTraining);

  const results = await apiFeatureInstance.MongoseQuery;

  return res.status(200).json({
    message: "Done All Student Information",
    TrainingRegisted: results,
  });
});
