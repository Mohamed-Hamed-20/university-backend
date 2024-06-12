import trainingmodel from "../../../DB/models/training.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { roles } from "../../middleware/auth.js";
import { createImg, deleteImg, GetsingleImg } from "../../utils/aws.s3.js";
import slugify from "slugify";
import TrainingRegisterModel from "../../../DB/models/trainingRegister.model.js";
import trainingResultModel from "../../../DB/models/trainingResult.model.js";

// create new training
export const addtrain = asyncHandler(async (req, res, next) => {
  const {
    training_name,
    start_date,
    end_date,
    requirements,
    desc,
    max_student,
    OpenForRegister,
    AllowLevel,
  } = req.body;
  const training = {};

  //check training is already exist
  const check = await trainingmodel.findOne({ training_name: training_name });
  if (check) {
    return next(new Error("Training already exists", { cause: 400 }));
  } else {
    training.training_name = training_name;
  }

  // Assign OpenForRegistration and requiremenst and max_student if provided
  if (typeof OpenForRegister !== "undefined") {
    training.OpenForRegister = OpenForRegister;
  }

  if (requirements) training.requirements = requirements;

  if (max_student) training.max_student = max_student;
  training.AllowLevel = AllowLevel || ["two", "three", "four", "graduated"];
  //Assign training Dates
  training.start_date = start_date;
  training.end_date = end_date;

  //Assign Description
  training.desc = desc;

  //create training
  const result = await trainingmodel.create(training);
  if (!result) {
    return next(new Error("Server Error, Try again Later", { cause: 500 }));
  }
  return res
    .status(201)
    .json({ message: "Training created successfully", training: result });
});

// update training
export const updatetraining = asyncHandler(async (req, res, next) => {
  const { training_id } = req.query;
  const {
    training_name,
    start_date,
    end_date,
    requirements,
    desc,
    max_student,
    OpenForRegister,
    AllowLevel,
  } = req.body;

  // Check if either start date or end date is provided
  if ((!start_date && end_date) || (start_date && !end_date)) {
    return next(
      new Error("Both start date and end date are required", { cause: 400 })
    );
  }

  const training = await trainingmodel.findById({ _id: training_id });
  if (!training) {
    return next(new Error("Invalid Training Id", { cause: 404 }));
  }

  // if he want to change training name
  if (training_name && training?.training_name != training_name) {
    const check = await trainingmodel.findOne({ training_name });
    if (check && check._id.toString() != training_id) {
      return next(new Error("Training Name Is Already Exist ", { cause: 400 }));
    } else {
      training.training_name = training_name;
    }
  }

  if (start_date) training.start_date = start_date;
  if (end_date) training.end_date = end_date;
  if (requirements) training.requirements = requirements;
  if (desc) training.desc = desc;
  if (max_student) training.max_student = max_student;
  if (typeof OpenForRegister !== "undefined") {
    training.OpenForRegister = OpenForRegister;
  }
  if (AllowLevel) training.AllowLevel = AllowLevel;

  await training.save();
  return res
    .status(200)
    .json({ message: "Training updated Successfully", training });
});

// delete training
export const deletetrain = asyncHandler(async (req, res, next) => {
  const { training_id } = req.query;

  // Check if the training exists
  const training = await trainingmodel.findById(training_id);
  if (!training) {
    return next(new Error("Invalid training Id", { cause: 404 }));
  }

  // Delete the training
  const deleteTrainPromise = trainingmodel.deleteOne({ _id: training_id });

  // Update associated registrations
  const updateTrainRegistedPromise = TrainingRegisterModel.updateMany(
    { trainingRegisterd: training_id },
    { $pull: { trainingRegisterd: training_id } }
  );

  // Delete associated grades
  const deleteTrainGradesPromise = trainingResultModel.deleteMany({
    trainingId: training_id,
  });

  // Wait for all promises to execute
  const [deleteTrain, updateTrainRegisted, deleteTrainGrades] =
    await Promise.all([
      deleteTrainPromise,
      updateTrainRegistedPromise,
      deleteTrainGradesPromise,
    ]);

  // Return success message
  return res.status(200).json({
    message: "Training deleted successfully",
    deletedTrain: deleteTrain,
    updatedRegistrations: updateTrainRegisted,
    deletedGrades: deleteTrainGrades,
  });
});


// search and get all training
export const alltraining = asyncHandler(async (req, res, next) => {
  const allowFields = [
    "training_name",
    "start_date",
    "end_date",
    "requirements",
    "desc",
    "max_student",
    "OpenForRegister",
    "AllowLevel",
    "ImgUrls",
  ];
  const searchFieldsText = ["training_name", "desc", "AllowLevel"];
  const searchFieldsIds = ["_id"];
  let filters = {};
  if (req.user.role == roles.stu) {
    filters.OpenForRegister = true;
  }

  if (req.user.role == roles.instructor) {
    filters._id = { $in: req.user.Training };
  }
  const apiFeatureInstance = new ApiFeature(
    trainingmodel.find(filters).lean(),
    req.query,
    allowFields
  )
    .pagination()
    .sort()
    .select()
    .filter()
    .search({ searchFieldsText, searchFieldsIds });

  const trainings = await apiFeatureInstance.MongoseQuery;

  // Create an array to hold all the promises for loading images
  const allImagePromises = [];

  // Loop through each training
  for (const training of trainings) {
    if (training?.ImgUrls && training.ImgUrls.length > 0) {
      // Create promises for each image in the training and add them to the array
      const imagePromises = training?.ImgUrls?.map(async (imgUrl) => {
        const { url } = await GetsingleImg({ ImgName: imgUrl });
        return { imgName: imgUrl, url };
      });
      allImagePromises.push(Promise.all(imagePromises));
    }
  }

  // Wait for all image promises to resolve
  const allImages = await Promise.all(allImagePromises);
  // Loop through each training and assign the images
  for (const training of trainings) {
    // Check if ImgUrls exist and are not empty for this training
    if (training.ImgUrls && training.ImgUrls.length > 0) {
      // Check if images exist in allImages array for this training
      const imagesFortraining = allImages.shift(); // Get images for the current training
      if (
        imagesFortraining &&
        imagesFortraining.length > 0 &&
        imagesFortraining.every((image) =>
          training.ImgUrls.includes(image.imgName)
        )
      ) {
        training.images = imagesFortraining;
      }
    }
    delete training.ImgUrls;
  }
  return res
    .status(200)
    .json({ message: "Done All training Information", trainings });
});

export const AddTrainingImg = asyncHandler(async (req, res, next) => {
  const { trainingId } = req.body;

  if (req.files.length == 0) {
    return next(new Error("Image Not provided", { cause: 400 }));
  }

  const training = await trainingmodel.findById(trainingId);

  if (!training) {
    return next(new Error("training not found", { cause: 404 }));
  }

  if (training.ImgUrls.length + req.files?.length >= 7) {
    return next(new Error("Not allow to Upload more Images", { cause: 404 }));
  }

  // Add Images
  if (req.files.length > 0) {
    const newName = slugify(training.training_name, "_");
    const folder = `${process.env.Folder_Training}/${newName}-${training._id}`;
    const { ImgNames, responses } = await createImg({
      folder,
      files: req.files,
    });

    // Concatenate ImgUrls to course.ImgUrls
    training.ImgUrls = training.ImgUrls.concat(ImgNames);
  }
  // Save the training
  const result = await training.save();
  return res
    .status(200)
    .json({ message: "Images Uploaded successfully", result });
});

export const deleteTrainingImg = asyncHandler(async (req, res, next) => {
  const { trainingId, ImgUrls } = req.body;
  const training = await trainingmodel.findById(trainingId);
  if (!training) {
    return next(new Error("training not found", { cause: 404 }));
  }

  // Check if all image URLs exist in the training's ImgUrls
  const invalidUrls = ImgUrls.filter(
    (item) => !training.ImgUrls.includes(item)
  );

  if (invalidUrls.length > 0) {
    return next(
      new Error(`Invalid image URL(s): ${invalidUrls.join(", ")}`, {
        cause: 400,
      })
    );
  }

  // Delete images
  const deletePromises = ImgUrls.map((url) => deleteImg({ imgName: url }));
  const responses = await Promise.all(deletePromises);
  // Check if all images were deleted successfully
  for (const { response } of responses) {
    if (![200, 201, 202, 204].includes(response.$metadata.httpStatusCode)) {
      return next(
        new Error("One or more images were not deleted successfully", {
          cause: response.$metadata.httpStatusCode,
        })
      );
    }
  }

  // Remove the image URLs from the training's ImgUrls
  const newImgUrls = training.ImgUrls.filter((url) => !ImgUrls.includes(url));

  // Update the training's ImgUrls and save
  training.ImgUrls = newImgUrls;
  const result = await training.save();
  if (!result) {
    return next(
      new Error("error In update delete training Images", { cause: 500 })
    );
  }
  return res
    .status(200)
    .json({ message: "Images deleted successfully", result, responses });
});
export const TrainingInfo = asyncHandler(async (req, res, next) => {
  const { trainingId } = req.query;
  const training = await trainingmodel.findById(trainingId).lean();

  if (!training) {
    throw new Error("training not found");
  }

  if (training.ImgUrls && training.ImgUrls.length > 0) {
    const promiseArray = training.ImgUrls?.map(async (imgUrl) => {
      const { url } = await GetsingleImg({ ImgName: imgUrl });
      return { imgName: imgUrl, url };
    });

    const images = await Promise.all(promiseArray);

    // Add the images to the training object
    training.images = images;

    // Remove ImgUrls from the training object
    delete training.ImgUrls;
  }
  // تنسيق تاريخ البداية
  if (training.start_date) {
    const startDate = new Date(training.start_date);
    training.start_date = startDate
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");
  }

  // تنسيق تاريخ النهاية
  if (training.end_date) {
    const endDate = new Date(training.end_date);
    training.end_date = endDate.toLocaleDateString("en-GB").replace(/\//g, "-");
  }

  // Return the training object in the response
  return res.status(200).json({ message: "training information", training });
});
