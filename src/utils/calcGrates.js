export const calculateGradeAndPoints = (totalGrate, creditHours) => {
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
  console.log(points, grade);
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
