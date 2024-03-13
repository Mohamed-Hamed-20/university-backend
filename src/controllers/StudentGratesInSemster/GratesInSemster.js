import GratesInSemsterModel from "../../../DB/models/GratesInSemster.model.js";
import { calculateCumulativeGPA } from "../../utils/calcgrates.js";
import { asyncHandler } from "../../utils/errorHandling.js";

// Function to add or update grades for a semester
export const addToGratesSemster = async ({ GrateInfo, course, register }) => {
  // Extracting necessary information from input objects
  const { studentId, Points } = GrateInfo;
  const { semsterId } = register;
  console.log(semsterId);
  let result;

  // Finding existing record in GratesInSemsterModel
  const GratesSemster = await GratesInSemsterModel.findOne({
    studentId,
    semsterId,
  });

  // Calculating cumulative GPA based on existing GPA and credit hours
  const { cumulativeGPA, totalCreditHours } = calculateCumulativeGPA({
    oldGPA: GratesSemster?.GpaInThisSemester,
    oldCreditHours: GratesSemster?.HoursInSemster,
    creditHours: course.credit_hour,
    points: Points,
  });

  // Creating or updating record in GratesInSemsterModel
  if (!GratesSemster) {
    // If no existing record found, create a new one
    const StudentCourseGrateIds = [GrateInfo._id];
    const newGratesInSemsterObject = {
      studentId,
      semsterId,
      GpaInThisSemester: cumulativeGPA,
      HoursInSemster: totalCreditHours,
      StudentCourseGrateIds,
    };

    result = await GratesInSemsterModel.create(newGratesInSemsterObject);
    if (!result) {
      throw new Error("Failed to create GratesInSemsterobject");
    }
  } else {
    // If existing record found, update it
    GratesSemster.GpaInThisSemester = cumulativeGPA;
    GratesSemster.HoursInSemster = totalCreditHours;
    GratesSemster.StudentCourseGrateIds.push(GrateInfo._id);
    result = await GratesSemster.save();
    if (!result) {
      throw new Error("Failed to update GratesSemster");
    }
  }

  return result;
};

export const addToGratesSemster3 = asyncHandler(async (req, res, next) => {});
export const deleteFromGratesSemster = asyncHandler(
  async (req, res, next) => {}
);
