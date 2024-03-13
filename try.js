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
  console.log({ points, creditHours, oldGPA, oldCreditHours });

  const totalPoints = oldGPA * oldCreditHours + points * creditHours;

  // Calculate total credit hours including the old credit hours
  const totalCreditHours = oldCreditHours + creditHours;

  // Calculate cumulative GPA
  const cumulativeGPA = Math.round(totalPoints / totalCreditHours);

  return { cumulativeGPA, totalCreditHours };
};

const { cumulativeGPA, totalCreditHours } = calculateCumulativeGPA({
  points: 3.2,
  creditHours: 3,
  oldGPA: 2.2,
  oldCreditHours: 6,
});

console.log({ cumulativeGPA, totalCreditHours });
