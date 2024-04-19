export const sanitizeStudent = (user) => {
  return {
    _id: user?.fullName,
    Full_Name: user?.Full_Name,
    National_Id: user?.National_Id,
    Student_Code: user?.Student_Code,
    Date_of_Birth: user?.Date_of_Birth,
    gender: user?.gender,
    TotalGpa: user?.TotalGpa,
    totalCreditHours: user?.totalCreditHours,
  };
};
