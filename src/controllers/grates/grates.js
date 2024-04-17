import RegisterModel from "../../../DB/models/Register.model.js";
import {
  GradeModel,
  SemesterGradeModel,
} from "../../../DB/models/StudentGrades.model.js";
import CourseModel from "../../../DB/models/course.model.js";
import semsterModel from "../../../DB/models/semster.model.js";
import { roles } from "../../middleware/auth.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { arrayofstring } from "../../utils/arrayobjectIds.js";
import {
  calclevel,
  calculateGradeAndPoints,
  calculateTotalGPA,
} from "../../utils/calcGrates.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const uploadgrate = asyncHandler(async (req, res, next) => {
  const { courseId, studentId, FinalExam, Oral, Practical, Midterm } = req.body;
  let { semsterId } = req.body;

  //if he was admin
  if (req.user.role == roles.admin) {
    if (semsterId && semsterId.toString() !== setting.MainSemsterId) {
      const chksemster = await semsterModel.findById(semsterId);
      if (!chksemster) {
        return next(new Error("semster Not found", { cause: 404 }));
      }
      semsterId == chksemster._id.toString();
    } else {
      semsterId = setting.MainSemsterId;
    }
  }

  // check course
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new Error("Course Not found", { cause: 404 }));
  }

  // Check if the user is an instructor for this course
  if (req.user.role == roles.instructor) {
    semsterId = req.setting.MainSemsterId.toString();
    const Materials = await arrayofstring(req.user?.Materials);
    if (Materials.length == 0 || !Materials.includes(courseId.toString())) {
      return next(
        new Error("You are not allowed to upload grades for this course", {
          cause: 401,
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
    semsterId: semsterId,
  };
  const grate = await GradeModel.create(GradeInSingleCourse);
  if (!grate) {
    return next(new Error("server Error Try again later", { cause: 400 }));
  }
  req.course = course;
  req.register = register;
  req.Grade = grate;
  req.semsterId = semsterId;
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
  if (req.user.role == roles.admin) {
    if (semsterId && semsterId !== stuGrade.semsterId.toString()) {
      const chksemster = await semsterModel.findById(semsterId);
      if (!chksemster) {
        return next(new Error("Invaild semsterId", { cause: 400 }));
      }
      req.newsemster = chksemster;
      stuGrade.semsterId = semsterId;
    }
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
  if (req.user.role == roles.instructor) {
    // Check if the user is an instructor for this course
    const Materials = await arrayofstring(req.user.Materials);
    if (!Materials.includes(stuGrade.courseId.toString())) {
      return next(
        new Error("You are not allowed to update this grades", {
          cause: 401,
        })
      );
    }

    // check course he want update for allow or not
    if (courseId) {
      if (!Materials.includes(courseId.toString())) {
        return next(
          new Error("You are not allowed to make result for this courseId", {
            cause: 401,
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
  let { semsterId } = req.query;
  const user = req.user;

  // check if he is allowed to view this courses
  if (user.role == roles.instructor) {
    if (!courseId) {
      return next(new Error("courseId is required", { cause: 400 }));
    }
    if (semsterId) {
      return next(new Error("semsterId Not allowed", { cause: 400 }));
    }

    // if not provided semster make main semster is
    if (!semsterId) {
      const setting = req.setting;
      if (setting && setting.MainSemsterId) {
        semsterId = setting.MainSemsterId.toString();
      } else {
        return next(
          new Error("Main semester is not available", { cause: 400 })
        );
      }
    }

    //=======================================
    const Materials = await arrayofstring(user.Materials);
    if (!Materials.includes(courseId.toString())) {
      return next(
        new Error("You are not allowed to view grates to this courses ", {
          cause: 401,
        })
      );
    }
  }

  let filters = {};
  if (semsterId) filters.semsterId = semsterId;
  if (studentId) filters.studentId = studentId;
  if (courseId) filters.courseId = courseId;

  const allowFields = [
    "studentId",
    "semsterId",
    "courseId",
    "Points",
    "Grade",
    "FinalExam",
    "Oral",
    "Practical",
    "Midterm",
    "YearWorks",
    "TotalGrate",
  ];

  const optionStudent = {
    path: "studentId",
    select:
      "Full_Name National_Id Student_Code department gender PhoneNumber Date_of_Birth imgName",
  };

  const optionCourse = {
    path: "courseId",
    select: "course_name desc credit_hour department",
  };

  const semsteroptions = {
    path: "semsterId",
    select: "name year term  Max_Hours",
  };

  const searchFieldsText = ["Grade", "TotalGrate"];
  const searchFieldsIds = ["studentId", "semsterId"];
  const apiFeatureInstance = new ApiFeature(
    GradeModel.find(filters).lean(),
    req.query,
    allowFields
  )
    .pagination()
    .sort()
    .select()
    .populate(optionStudent)
    .populate(optionCourse)
    .populate(semsteroptions)
    .search({ searchFieldsText, searchFieldsIds });

  const results = await apiFeatureInstance.MongoseQuery;

  return res
    .status(200)
    .json({ message: "Done student Grates", grades: results });
});

// جديد
export const gradeSingleuser = asyncHandler(async (req, res, next) => {
  const { GradeId } = req.query;
  const optionStudent = {
    path: "studentId",
    select:
      "Full_Name National_Id Student_Code department gender PhoneNumber Date_of_Birth imgName",
  };

  const optionCourse = {
    path: "courseId",
    select: "course_name desc credit_hour department",
  };
  const grade = await GradeModel.findById(GradeId)
    .lean()
    .populate(optionStudent)
    .populate(optionCourse);
  if (!grade) {
    return next(new Error("grate for student not found", { cause: 404 }));
  }

  // make sure he allow to view this
  if (req.user.role == roles.instructor) {
    const Materials = await arrayofstring(user.Materials);
    if (!Materials.includes(grade.courseId.toString())) {
      return next(
        new Error("You are not allowed to view grates to this courses ", {
          cause: 403,
        })
      );
    }
  }
  // response
  return res.status(200).json({ message: "grate Information", grade });
});

export const stugrades = asyncHandler(async (req, res, next) => {
  let { studentId } = req.body;

  if (req.user.role == roles.stu) {
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
        "Full_Name National_Id Student_Code department gender PhoneNumber Date_of_Birth",
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
  const { level } = await calclevel({ totalCreditHours: totalCreditHours });
  return res.status(200).json({
    message: "student Grades Informations",
    semesters: newSemesters,
    totalGpaOverall,
    totalCreditHours,
    level,
  });
});

export const MainsemsterGrate = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const setting = req.setting;
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
