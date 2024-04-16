import CourseModel from "../../../DB/models/course.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { arrayofIds } from "../../utils/arrayobjectIds.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { createImg, deleteImg, GetsingleImg } from "../../utils/aws.s3.js";
import slugify from "slugify";

export const addCourse = asyncHandler(async (req, res, next) => {
  const {
    course_name,
    Prerequisites,
    credit_hour,
    OpenForRegistration,
    desc,
    department,
  } = req.body;

  const course = {};

  // Check if the course name already exists
  const chkcourse = await CourseModel.findOne({ course_name: course_name });
  if (chkcourse) {
    return next(new Error("Course name already exists", { cause: 400 }));
  } else {
    course.course_name = course_name;
  }

  // Assign prerequisites if provided
  if (Prerequisites && Prerequisites.length > 0) {
    const prerequisiteIds = arrayofIds(Prerequisites);
    const foundPrerequisites = await CourseModel.find({
      _id: { $in: prerequisiteIds },
    });
    if (foundPrerequisites.length !== Prerequisites.length) {
      return next(
        new Error("One or more prerequisites are invalid", { cause: 400 })
      );
    }
    course.Prerequisites = foundPrerequisites;
  }

  // Assign OpenForRegistration and description if provided
  if (OpenForRegistration) course.OpenForRegistration = OpenForRegistration;

  if (desc) course.desc = desc;
  if (department) course.department = department;

  // Assign credit hour
  course.credit_hour = credit_hour;

  // Create the course
  const result = await CourseModel.create(course);
  return res
    .status(201)
    .json({ message: "Course created successfully", course: result });
});

export const updatecourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;
  const {
    course_name,
    Prerequisites,
    credit_hour,
    department,
    OpenForRegistration,
    desc,
  } = req.body;

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new Error("Invalid course Id", { cause: 404 }));
  }
  if (course_name && course?.course_name != course_name) {
    const chkcourse = await CourseModel.findOne({ course_name });
    if (chkcourse && chkcourse._id.toString() != courseId) {
      return next(new Error("course Name Is Already Exist ", { cause: 400 }));
    } else {
      course.course_name = course_name;
    }
  }

  if (Prerequisites && Prerequisites?.length > 0) {
    const prerequisiteIds = arrayofIds(Prerequisites);
    if (
      JSON.stringify(prerequisiteIds.sort()) !=
      JSON.stringify(course?.Prerequisites?.sort())
    ) {
      const foundPrerequisites = await CourseModel.find({
        _id: { $in: prerequisiteIds },
      });
      if (foundPrerequisites.length !== Prerequisites.length) {
        return next(
          new Error("One or more prerequisites are invalid", { cause: 400 })
        );
      }
      course.Prerequisites = foundPrerequisites;
    }
  }

  if (credit_hour) course.credit_hour = credit_hour;

  if (OpenForRegistration) course.OpenForRegistration = OpenForRegistration;

  if (desc) course.desc = desc;
  if (department) course.department = department;

  await course.save();
  return res.status(200).json({ message: "course  Successfully", course });
});

export const deletecourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;
  const course = await CourseModel.findByIdAndDelete(courseId);
  if (!course) {
    return next(new Error("Invalid courseId", { cause: 404 }));
  }
  //response
  return res
    .status(200)
    .json({ message: "course delete Successfully", course });
});

export const searchcourse = asyncHandler(async (req, res, next) => {
  const allowFields = [
    "course_name",
    "desc",
    "_id",
    "credit_hour",
    "department",
    "OpenForRegistration",
    "Prerequisites",
    "ImgUrls",
  ];
  const searchFieldsText = ["course_name", "desc", "department"];
  const searchFieldsIds = ["_id"];

  const apiFeatureInstance = new ApiFeature(
    CourseModel.find().lean(),
    req.query,
    allowFields
  )
    .search({ searchFieldsText, searchFieldsIds })
    .pagination()
    .sort()
    .select()
    .filter();

  const courses = await apiFeatureInstance.MongoseQuery;

  // Create an array to hold all the promises for loading images
  const allImagePromises = [];

  // Loop through each course
  for (const course of courses) {
    if (course?.ImgUrls && course.ImgUrls.length > 0) {
      // Create promises for each image in the course and add them to the array
      const imagePromises = course?.ImgUrls?.map(async (imgUrl) => {
        const { url } = await GetsingleImg({ ImgName: imgUrl });
        return { imgName: imgUrl, url };
      });
      allImagePromises.push(Promise.all(imagePromises));
    }
  }

  // Wait for all image promises to resolve
  const allImages = await Promise.all(allImagePromises);
  // Loop through each course and assign the images
  for (const course of courses) {
    // Check if ImgUrls exist and are not empty for this course
    if (course.ImgUrls && course.ImgUrls.length > 0) {
      // Check if images exist in allImages array for this course
      const imagesForCourse = allImages.shift(); // Get images for the current course
      if (
        imagesForCourse &&
        imagesForCourse.length > 0 &&
        imagesForCourse.every((image) => course.ImgUrls.includes(image.imgName))
      ) {
        course.images = imagesForCourse;
      }
    }
    delete course.ImgUrls;
  }

  return res
    .status(200)
    .json({ message: "Done All courses Information", courses });
});

export const AddcourseImg = asyncHandler(async (req, res, next) => {
  const { courseId } = req.body;

  if (req.files.length == 0) {
    return next(new Error("Image Not provided", { cause: 400 }));
  }

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new Error("course not found", { cause: 404 }));
  }

  if (course.ImgUrls.length + req.files?.length >= 7) {
    return next(new Error("Not allow to Upload more Images", { cause: 404 }));
  }
  // Add Images
  if (req.files.length > 0) {

    const newName = slugify(course.course_name, "_");
    const folder = `${process.env.Folder_course}/${newName}-${course._id}`;
    const { ImgNames, responses } = await createImg({
      folder,
      files: req.files,
    });

    // Concatenate ImgUrls to course.ImgUrls
    course.ImgUrls = course.ImgUrls.concat(ImgNames);
  }
  // Save the course
  const result = await course.save();
  return res
    .status(200)
    .json({ message: "Images Uploaded successfully", result });
});

export const deletecourseImg = asyncHandler(async (req, res, next) => {
  const { courseId, ImgUrls } = req.body;
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new Error("Course not found", { cause: 404 }));
  }

  // Check if all image URLs exist in the course's ImgUrls
  const invalidUrls = ImgUrls.filter((item) => !course.ImgUrls.includes(item));

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

  // Remove the image URLs from the course's ImgUrls
  const newImgUrls = course.ImgUrls.filter((url) => !ImgUrls.includes(url));

  // Update the course's ImgUrls and save
  course.ImgUrls = newImgUrls;
  const result = await course.save();
  if (!result) {
    return next(
      new Error("error In update delete course Images", { cause: 500 })
    );
  }
  return res
    .status(200)
    .json({ message: "Images deleted successfully", result, responses });
});

export const courseInfo = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;
  const course = await CourseModel.findById(courseId).lean();

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.ImgUrls && course.ImgUrls.length > 0) {
    const promiseArray = course.ImgUrls?.map(async (imgUrl) => {
      const { url } = await GetsingleImg({ ImgName: imgUrl });
      return { imgName: imgUrl, url };
    });

    const images = await Promise.all(promiseArray);

    // Add the images to the course object
    course.images = images;

    // Remove ImgUrls from the course object
    delete course.ImgUrls;
  }
  // Return the course object in the response
  return res.status(200).json({ message: "Course information", course });
});
