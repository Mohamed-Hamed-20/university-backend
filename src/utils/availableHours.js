export const availableHoursForUser = async ({
  TotalGpa,
  RegisterInfo,
} = {}) => {
  try {
    let availablehour;
    if (!RegisterInfo || RegisterInfo.coursesRegisterd.length == 0) {
      if (TotalGpa >= 2 && TotalGpa <= 4) {
        console.log("Hi boy");
        availablehour = 18;
      } else if (TotalGpa >= 1 && TotalGpa < 2) {
        availablehour = 15;
      } else if (TotalGpa <= 0 && TotalGpa < 1) {
        availablehour = 12;
      }
    } else {
      availablehour = RegisterInfo.Available_Hours;
    }
    return availablehour;
  } catch (error) {
    throw new Error(error);
  }
};
