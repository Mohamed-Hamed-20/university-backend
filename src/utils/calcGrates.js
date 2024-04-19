import { GradeModel } from "../../DB/models/StudentGrades.model.js";

export const calculateGPA = async ({ studentId, studentresult }) => {
  try {
    let grades;
    if (!studentresult) {
      grades = await GradeModel.find({ studentId }).lean().exec();
    } else {
      grades = studentresult;
    }
    if (!grades || grades.length === 0) {
      return { TotalGpa: 2, totalCreditHours: 0 }; // يمكنك تحديد قيمة الـ GPA كـ 0 في هذه الحالة
    }

    let totalPoints = 0;
    let totalCreditHours = 0;

    grades.forEach((grade) => {
      totalPoints += grade.Points * grade.creditHours;
      totalCreditHours += grade.creditHours;
    });

    const gpa = totalPoints / totalCreditHours;

    const roundedGPA = Math.round(gpa * 100) / 100;

    return { TotalGpa: roundedGPA, totalCreditHours };
  } catch (error) {
    throw new Error("Error calculating GPA");
  }
};

export const calculateGradeAndPoints = (totalGrate) => {
  let points;
  let grade;

  // حساب النقاط
  if (totalGrate >= 90) {
    points = 4.0;
  } else if (totalGrate >= 85) {
    points = 3.7;
  } else if (totalGrate >= 80) {
    points = 3.3;
  } else if (totalGrate >= 75) {
    points = 3.0;
  } else if (totalGrate >= 70) {
    points = 2.7;
  } else if (totalGrate >= 65) {
    points = 2.4;
  } else if (totalGrate >= 60) {
    points = 2.2;
  } else if (totalGrate >= 50) {
    points = 2;
  } else if (totalGrate < 50) {
    points = 0;
  } else {
    points = 0;
  }

  // حساب الدرجة
  if (totalGrate >= 90) {
    grade = "A+";
  } else if (totalGrate >= 85) {
    grade = "A";
  } else if (totalGrate >= 80) {
    grade = "B+";
  } else if (totalGrate >= 75) {
    grade = "B";
  } else if (totalGrate >= 70) {
    grade = "C+";
  } else if (totalGrate >= 65) {
    grade = "C";
  } else if (totalGrate >= 60) {
    grade = "D+";
  } else if (totalGrate >= 50) {
    grade = "D";
  } else if (totalGrate < 50) {
    grade = "F";
  } else {
    grade = "F";
  }
  return { points, grade };
};

// Function to calculate cumulative GPA considering the old GPA
export const calculateCumulativeGPA = ({
  points,
  creditHours,
  oldGPA,
  oldCreditHours,
}) => {
  // Calculate total points including the old GPA
  if (!oldGPA || !oldCreditHours) {
    oldGPA = 0;
    oldCreditHours = 0;
  }

  const totalPoints = oldGPA * oldCreditHours + points * creditHours;

  // Calculate total credit hours including the old credit hours
  let totalCreditHours = oldCreditHours + creditHours;

  // Calculate cumulative GPA
  const cumulativeGPA =
    Math.round((totalPoints / totalCreditHours) * 1000) / 1000;
  if (points == 0) {
    totalCreditHours = totalCreditHours - creditHours;
  }

  return { cumulativeGPA, totalCreditHours };
};

export const calculateOverallGPA = async (semsters) => {
  let totalQualityPoints = 0;
  let totalCreditHours = 0;

  semsters.forEach((ele) => {
    totalQualityPoints += ele.GpaInThissemster * ele.HoursInSemster;
    totalCreditHours += ele.HoursInSemster;
  });

  const overallGPA = totalQualityPoints / totalCreditHours;
  return { overallGPA, totalCreditHours };
};

export const updateGPA = ({
  currentGPA,
  courseGPA,
  courseCreditHours,
  totalCreditHours,
}) => {
  console.log({
    currentGPA,
    courseGPA,
    courseCreditHours,
    totalCreditHours,
  });

  const totalPoints =
    currentGPA * totalCreditHours - courseGPA * courseCreditHours;

  const updatedCreditHours = totalCreditHours - courseCreditHours;

  if (updatedCreditHours !== 0) {
    const updatedGPA = totalPoints / updatedCreditHours;

    // تقريب القيمة
    const roundedGPA = Math.round(updatedGPA * 1000) / 1000;

    return { newGPA: roundedGPA, newCreditHours: updatedCreditHours };
  } else {
    return { newGPA: 0, newCreditHours: 0 };
  }
};

export const calculateTotalGPA = async ({ semesters }) => {
  let updatedSemesters = [];

  for (const semester of semesters) {
    let totalPoints = 0;
    let totalCreditHours = 0;

    for (const grade of semester.courseGrates) {
      totalPoints += grade.Points * grade.creditHours;
      totalCreditHours += grade.creditHours;
    }

    const gpaInSemester = totalPoints / totalCreditHours;
    const hoursInSemester = totalCreditHours;

    semester.gpaInSemester = Math.round(gpaInSemester * 1000) / 1000;
    semester.hoursInSemester = hoursInSemester;

    updatedSemesters.push(semester);
  }

  let totalGpa = 0;
  let totalCreditHours = 0;

  for (const semester of updatedSemesters) {
    totalGpa += semester.gpaInSemester * semester.hoursInSemester;
    totalCreditHours += semester.hoursInSemester;
  }

  const totalGpaOverall =
    Math.round((totalGpa / totalCreditHours) * 1000) / 1000;

  return { semesters: updatedSemesters, totalGpaOverall, totalCreditHours };
};

export const calclevel = async ({ totalCreditHours }) => {
  totalCreditHours = parseInt(totalCreditHours);
  let level = "one";
  if (totalCreditHours >= 141) {
    level = "graduated";
  } else if (totalCreditHours >= 98) {
    level = "four";
  } else if (totalCreditHours >= 57) {
    level = "three";
  } else if (totalCreditHours >= 28) {
    level = "two";
  } else {
    level = "one";
  }

  return { level };
};
