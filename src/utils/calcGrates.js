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
    points = 2.3;
  } else if (totalGrate >= 60) {
    points = 2.0;
  } else if (totalGrate >= 55) {
    points = 1.7;
  } else if (totalGrate >= 50) {
    points = 1.3;
  } else if (totalGrate >= 45) {
    points = 1.0;
  } else if (totalGrate >= 40) {
    points = 0.7;
  } else {
    points = 0.0;
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
  } else if (totalGrate >= 55) {
    grade = "D";
  } else if (totalGrate >= 50) {
    grade = "F";
  } else {
    grade = "F";
  }

  const gpa = points / creditHours;
  return { points, grade, gpa };
};
// Function to calculate cumulative GPA considering the old GPA
export const calculateCumulativeGPA = ({
  points,
  creditHours,
  oldGPA,
  oldCreditHours,
}) => {
  console.log({ points, creditHours, oldGPA, oldCreditHours });
  // Calculate total points including the old GPA

  if (!oldGPA || !oldCreditHours) {
    oldGPA = 0;
    oldCreditHours = 0;
  }
  const totalPoints = oldGPA * oldCreditHours + points * creditHours;

  // Calculate total credit hours including the old credit hours
  const totalCreditHours = oldCreditHours + creditHours;

  // Calculate cumulative GPA
  const cumulativeGPA = totalPoints / totalCreditHours;

  return { cumulativeGPA, totalCreditHours };
};
