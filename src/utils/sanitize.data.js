export const sanitizeStudent = (user) => {
  return {
    _id: user?._id,
    Full_Name: user?.Full_Name,
    National_Id: user?.National_Id,
    Student_Code: user?.Student_Code,
    Date_of_Birth: user?.Date_of_Birth,
    PhoneNumber: user?.PhoneNumber,
    gender: user?.gender,
    TotalGpa: user?.TotalGpa || 2,
    totalCreditHours: user?.totalCreditHours || 0,
    imgName: user?.imgName,
    url: user?.url,
  };
};

export const sanitizeAdmin = (Admin) => {
  return {
    FullName: Admin.FullName,
    email: Admin.email,
    phone: Admin.phone,
    Date_of_Birth: Admin.Date_of_Birth,
    gender: Admin.gender,
    role: Admin.role,
  };
};
