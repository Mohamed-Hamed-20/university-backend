import RegisterModel from "../../../DB/models/Register.model.js";
import {
  GradeModel,
  SemesterGradeModel,
} from "../../../DB/models/StudentGrades.model.js";
import CourseModel from "../../../DB/models/course.model.js";
import semsterModel from "../../../DB/models/semster.model.js";
import settingModel from "../../../DB/models/setting.model.js";
import userModel from "../../../DB/models/user.model.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { arrayofstring } from "../../utils/arrayobjectIds.js";
import {
  calculateGradeAndPoints,
  calculateTotalGPA,
} from "../../utils/calcGrates.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const uploadgrate = asyncHandler(async (req, res, next) => {
  const { courseId, studentId, FinalExam, Oral, Practical, Midterm } = req.body;
  const { semsterId } = req.body;

  // check semster
  const chksemster = await semsterModel.findById(semsterId);
  if (!chksemster) {
    return next(new Error("semster Not found", { cause: 404 }));
  }

  // check course
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new Error("Course Not found", { cause: 404 }));
  }

  // Check if the user is an instructor for this course
  if (req.user.role == "instructor") {
    const Materials = await arrayofstring(req.user.Materials);
    if (!Materials.includes(courseId.toString())) {
      return next(
        new Error("You are not allowed to upload grades for this course", {
          cause: 403,
        })
      );
    }
  }

  // Find the registration document for this user
  const register = await RegisterModel.findOne({ studentId: studentId });

  // If registration document is not found
  if (!register) {
    return next(
      new Error("Registration document for user not found", { cause: 404 })
    );
  }

  // If user is not registered for this course
  if (!register.coursesRegisterd.includes(courseId)) {
    return next(
      new Error(
        "User is not registered for this course or course grade is already uploaded",
        { cause: 400 }
      )
    );
  }

  // Calculate TotalGrate & YearWorks
  const YearWorks = parseInt(Oral) + parseInt(Practical);
  const TotalGrate =
    parseInt(FinalExam) + parseInt(Midterm) + parseInt(YearWorks);

  // Calculate grade and points
  const { grade, points } = calculateGradeAndPoints(
    TotalGrate,
    course.credit_hour
  );
  if (!grade) {
    return next(new Error("Server Error", { cause: 500 }));
  }

  // Create Student Course Grade
  const GradeInSingleCourse = {
    studentId,
    courseId,
    Points: points,
    Grade: grade,
    FinalExam,
    Oral,
    Practical,
    Midterm,
    YearWorks,
    TotalGrate,
    creditHours: course.credit_hour,
    semsterId,
  };
  const grate = await GradeModel.create(GradeInSingleCourse);
  if (!grate) {
    return next(new Error("server Error Try again later", { cause: 400 }));
  }
  req.course = course;
  req.register = register;
  req.Grade = grate;
  return next();
});

export const updategrate = asyncHandler(async (req, res, next) => {
  const { GradeId } = req.query;
  const { courseId, semsterId, FinalExam, Oral, Practical, Midterm } = req.body;

  // find this grate
  const stuGrade = await GradeModel.findById(GradeId);
  if (!stuGrade) {
    return next(new Error("Invaild GradeId", { cause: 400 }));
  }

  // store old result before
  req.oldGrade = stuGrade;

  // check it valid semsterId
  if (semsterId) {
    const chksemster = await semsterModel.findById(semsterId);
    if (!chksemster) {
      return next(new Error("Invaild semsterId", { cause: 400 }));
    }
    req.newsemster = chksemster;
  }

  //check it Vaild courseId
  if (courseId && courseId.toString() != stuGrade.courseId.toString()) {
    const newcourse = await CourseModel.findById(courseId);
    if (!newcourse) {
      return next(new Error("Invaild courseId"));
    }
    stuGrade.courseId = newcourse._id;
    req.newcourse = newcourse;
  }

  // if he is Instructor
  if (req.user.role == "instructor") {
    // Check if the user is an instructor for this course
    const Materials = await arrayofstring(req.user.Materials);
    if (!Materials.includes(stuGrade.courseId.toString())) {
      return next(
        new Error("You are not allowed to update this grades", {
          cause: 403,
        })
      );
    }

    // check course he want update for allow or not
    if (courseId) {
      if (!Materials.includes(courseId.toString())) {
        return next(
          new Error("You are not allowed to make result for this courseId", {
            cause: 403,
          })
        );
      }
    }
  }

  // Calculate TotalGrate & YearWorks
  if (Oral) stuGrade.Oral = Oral;
  if (FinalExam) stuGrade.FinalExam = FinalExam;
  if (Practical) stuGrade.Practical = Practical;
  if (Midterm) stuGrade.Midterm = Midterm;

  const YearWorks = stuGrade.Oral + stuGrade.Practical;
  const TotalGrate = stuGrade.FinalExam + stuGrade.Midterm + stuGrade.YearWorks;
  // add result to doc grade
  stuGrade.YearWorks = YearWorks;
  stuGrade.TotalGrate = TotalGrate;

  // Calculate grade and points
  const { grade, points } = calculateGradeAndPoints(TotalGrate);
  if (!grade) {
    return next(new Error("Server Error", { cause: 500 }));
  }

  stuGrade.Points = points;
  stuGrade.Grade = grade;
  stuGrade.semsterId = semsterId;

  //update Grade
  const result = await stuGrade.save();
  req.grade = result;

  return next();
});

export const deletecoursegrate = asyncHandler(async (req, res, next) => {
  const { GradeId } = req.query;
  const grade = await GradeModel.findById(GradeId);
  if (!grade) {
    return next(new Error("grate for student not found", { cause: 404 }));
  }
  req.grade = grade;
  return next();
});

// درجات الطالب فى كورس معين
export const studentsGratesSearch = asyncHandler(async (req, res, next) => {
  const { courseId, studentId } = req.query;
  const user = req.user;

  // check if he is allowed to view this courses
  if (user.role == "instructor") {
    const Materials = await arrayofstring(user.Materials);
    if (!Materials.includes(courseId.toString())) {
      return next(
        new Error("You are not allowed to view who registered this course", {
          status: 403,
        })
      );
    }
  }

  let filters = {};
  if (studentId) filters.studentId = studentId;
  // if (courseId) filters.courseId = courseId;
  const allowFields = ["studentId", "semsterId", "courseGrates"];

  const optionStudent = {
    path: "studentId",
    select:
      "Full_Name National_Id Student_Code department gender PhoneNumber Date_of_Birth",
  };

  const optionscourseGrates = {
    path: "courseGrates",
    match: { courseId: courseId },
    select:
      "creditHours courseId creditHours Points Grade FinalExam  Oral Practical Midterm YearWorks TotalGrate",
  };

  const semsteroptions = {
    path: "semsterId",
    select: "name year term  Max_Hours",
  };
  const searchFieldsText = ["courseGrates._id", ""];
  const searchFieldsIds = ["studentId", "semsterId"];
  const apiFeatureInstance = new ApiFeature(
    SemesterGradeModel.find(filters).lean(),
    req.query,
    allowFields
  )
    .pagination()
    .sort()
    .select()
    .populate(optionStudent)
    .populate(optionscourseGrates)
    .populate(semsteroptions)
    .search({ searchFieldsIds, searchFieldsText });

  let results = await apiFeatureInstance.MongoseQuery;

  // Filter out students without courseGrates
  results = results.filter((student) => student.courseGrates.length > 0);

  return res
    .status(200)
    .json({ message: "Done student Grates", grades: results });
});

// جديد
export const gradeSingleuser = asyncHandler(async (req, res, next) => {
  const { GradeId } = req.query;
  const grade = GradeModel.findById(GradeId);
  if (!grade) {
    return next(new Error("grate for student not found", { cause: 404 }));
  }

  req.grade = grade;
  return next();
});

export const stugrades = asyncHandler(async (req, res, next) => {
  let { studentId } = req.body;

  if (req.user.role == "user") {
    studentId = req.user._id;
  }

  const semesters = await SemesterGradeModel.find({ studentId })
    .populate({
      path: "courseGrates",
      populate: {
        path: "courseId",
        select: "course_name credit_hour",
      },
    })
    .populate({
      path: "studentId",
      select:
        "Full_Name National_Id department gender PhoneNumber Date_of_Birth",
    })
    .populate({
      path: "semsterId",
      select: "name  year term",
    })
    .lean();

  const {
    semesters: newSemesters,
    totalGpaOverall,
    totalCreditHours,
  } = await calculateTotalGPA({
    semesters,
  });

  return res.status(200).json({
    message: "student Grades Informations",
    semesters: newSemesters,
    totalGpaOverall,
    totalCreditHours,
  });
});

export const MainsemsterGrate = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const setting = await settingModel.findOne();
  const userGrade = await SemesterGradeModel.findOne({
    studentId: user._id,
    semsterId: setting.MainSemsterId,
  })
    .populate({
      path: "courseGrates",
      populate: {
        path: "courseId",
        select: "course_name credit_hour",
      },
    })
    .populate({
      path: "studentId",
      select:
        "Full_Name National_Id department gender PhoneNumber Date_of_Birth",
    })
    .populate({
      path: "semsterId",
      select: "name  year term",
    })
    .lean();

  if (!userGrade) {
    return next(
      new Error("student dosen't have grates in this semster", { cause: 404 })
    );
  }

  return res
    .status(200)
    .json({ message: "done student grate", result: userGrade });
});
