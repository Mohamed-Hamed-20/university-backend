import userModel from "../../../DB/models/user.model.js";
import { generateToken, storeRefreshToken } from "../../utils/Token.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import {
  createImg,
  deleteFolder,
  deleteImg,
  deleteMuliFiles,
  GetsingleImg,
  listoFiles,
  updateImg,
} from "../../utils/aws.s3.js";
import { calclevel, calculateGPA } from "../../utils/calcGrates.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { verifypass } from "../../utils/hashpassword.js";
import { roles } from "../../middleware/auth.js";
import SemesterModel from "../../../DB/models/semster.model.js";
import slugify from "slugify";
import RegisterModel from "../../../DB/models/Register.model.js";
import {
  GradeModel,
  SemesterGradeModel,
} from "../../../DB/models/StudentGrades.model.js";
import TrainingRegisterModel from "../../../DB/models/trainingRegister.model.js";
import trainingResultModel from "../../../DB/models/trainingResult.model.js";
import TokenModel from "../../../DB/models/token.model.js";

export const login = asyncHandler(async (req, res, next) => {
  const { Student_Code, password } = req.body;
  //check Student_Code
  const user = await userModel.findOne({ Student_Code: Student_Code });
  if (!user) {
    return next(new Error("Invalid Student Code or password"), { cause: 400 });
  }

  if (user.password) {
    const matched = await verifypass({
      password: password,
      hashpassword: user.password,
    });
    if (!matched) {
      return next(new Error("Invalid Student Code or password"), {
        cause: 400,
      });
    }
  } else {
    if (password != user.National_Id) {
      return next(new Error("Invalid Student Code or password"), {
        cause: 400,
      });
    }
  }
  //generate accessToken
  const accessToken = await generateToken({
    payload: { userId: user._id, role: user.role, IpAddress: req.ip },
    signature: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: process.env.accessExpireIn,
  });

  //generate refreshToken
  const refreshToken = await generateToken({
    payload: { userId: user._id, role: user.role, IpAddress: req.ip },
    signature: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: process.env.REFRESH_ExpireIn,
  });

  const success = await storeRefreshToken(refreshToken, user._id, next);
  if (!success) {
    return next(new Error("Failed to store refresh token"), { cause: 500 });
  }
  return res.status(200).json({
    message: "done login",
    accessToken: accessToken,
    refreshToken: refreshToken,
    role: user.role,
  });
});

export const Getuser = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const setting = req.setting;
  if (!user) {
    return next(
      new Error("Invalid User Data please Try Again", { cause: 500 })
    );
  }
  const { TotalGpa, totalCreditHours } = await calculateGPA({
    studentId: user._id,
  });
  const { level } = await calclevel({ totalCreditHours });
  const semsterInfo = await SemesterModel.findById(setting.MainSemsterId);

  let urlImg;
  if (user?.imgName) {
    const { url } = await GetsingleImg({ ImgName: user.imgName });
    urlImg = url;
  }
  const result = {
    Full_Name: user.Full_Name,
    _id: user._id,
    National_Id: user.National_Id,
    Student_Code: user.Student_Code,
    Date_of_Birth: user.Date_of_Birth,
    PhoneNumber: user.PhoneNumber,
    gender: user.gender,
    department: user.department,
    level: level,
    TotalGpa,
    totalCreditHours,
    semsterInfo: semsterInfo.MainSemsterId,
    imgName: user.imgName,
    url: urlImg,
  };
  return res.status(200).json({ message: "Done", result });
});

export const addStudent = asyncHandler(async (req, res, next) => {
  const {
    Full_Name,
    National_Id,
    Student_Code,
    Date_of_Birth,
    PhoneNumber,
    gender,
    department,
  } = req.body;

  // التحقق من عدم تكرار البيانات
  const existingStudent = await userModel.findOne({
    $or: [
      { National_Id: National_Id },
      { Student_Code: Student_Code },
      { Full_Name: Full_Name },
      { PhoneNumber: PhoneNumber },
    ],
  });

  if (existingStudent) {
    if (existingStudent.National_Id === National_Id) {
      return next(new Error(" National Id is Already Exist", { cause: 400 }));
    }
    if (existingStudent.Student_Code === Student_Code) {
      return next(new Error("Student Code is Already Exist", { cause: 400 }));
    }
    if (existingStudent.Full_Name === Full_Name) {
      return next(new Error("Full NaMe Name is Already Exist", { cause: 400 }));
    }
    if (existingStudent.PhoneNumber === PhoneNumber) {
      return next(new Error("phone is Already Exist", { cause: 400 }));
    }
  }

  // بناء كائن الطالب
  const student = {
    Full_Name,
    National_Id,
    Student_Code,
    Date_of_Birth,
    PhoneNumber,
    gender,
    role: "user",
  };

  if (department) {
    student.department = department;
  }

  // create student
  const result = await userModel.create(student);
  if (!result) {
    return next(new Error("Error Try Again later", { cause: 400 }));
  }

  // response
  return res.status(200).json({
    message: "Student created successfully",
    student: {
      _id: result._id,
      Full_Name: result.Full_Name,
      Student_Code: result.Student_Code,
    },
  });
});
export const updateStudent = asyncHandler(async (req, res, next) => {
  const {
    Full_Name,
    National_Id,
    Student_Code,
    Date_of_Birth,
    PhoneNumber,
    gender,
    department,
    restpassword,
  } = req.body;
  const { userId } = req.query;
  const user = await userModel.findById({ _id: userId });
  if (!user) {
    return next(new Error("user Not found", { cause: 404 }));
  }

  //check full name
  if (Full_Name && user.Full_Name != Full_Name) {
    const usernaem = await userModel.findOne({ Full_Name: Full_Name });
    if (usernaem && usernaem._id.toString() != userId) {
      return next(new Error("student Name is already exist", { cause: 400 }));
    }
    user.Full_Name = Full_Name;
  }

  //check  national id
  if (National_Id && user.National_Id != National_Id) {
    const chkNational_Id = await userModel.findOne({
      National_Id: National_Id,
    });
    if (chkNational_Id && chkNational_Id._id.toString() != userId) {
      return next(new Error("National id is already exist", { cause: 400 }));
    }
    user.National_Id = National_Id;
  }

  if (Student_Code && user.Student_Code != Student_Code) {
    const chkStudent_Code = await userModel.findOne({
      Student_Code: Student_Code,
    });
    if (chkStudent_Code && chkStudent_Code._id.toString() != userId) {
      return next(new Error("Student code is already exist", { cause: 400 }));
    }
    user.Student_Code = Student_Code;
  }

  if (PhoneNumber && user.PhoneNumber != PhoneNumber) {
    const chkphone = await userModel.findOne({
      PhoneNumber: PhoneNumber,
    });
    if (chkphone && chkphone._id.toString() != userId) {
      return next(new Error("phone number is already exist", { cause: 400 }));
    }
    user.PhoneNumber = PhoneNumber;
  }
  if (restpassword) {
    user.password = National_Id || user.National_Id;
    delete user.password;
  }

  user.gender = gender || user.gender;
  user.Date_of_Birth = Date_of_Birth || user.Date_of_Birth;
  user.department = department || user.department;

  const result = await user.save();
  if (!result) {
    return next(new Error("Error In update user information", { cause: 500 }));
  }
  res.status(200).json({
    message: "Student information updated successfully",
    result: result,
  });
});

export const deleteStudent = asyncHandler(async (req, res, next) => {
  const { userId } = req.query;
  const user = await userModel.findById(userId);

  if (!user) {
    return next(new Error("User not found"), { cause: 404 });
  }

  const newName = slugify(user.Full_Name, {
    replacement: "_",
  });

  const deleteOperations = [];
  if (user?.imgName) {
    const folder = `${process.env.Folder_stu}/${newName}-${user._id}/`;
    const { objects } = await listoFiles({ folder });
    deleteOperations.push(deleteMuliFiles({ objects })); // delete IMages
  }

  // all operation to delete
  deleteOperations.concat([
    user.deleteOne(), // delete student
    RegisterModel.findOneAndDelete({ studentId: userId }), // delete register model
    GradeModel.deleteMany({ studentId: userId }),
    SemesterGradeModel.deleteMany({ studentId: userId }),
    TrainingRegisterModel.deleteOne({ studentId: userId }),
    trainingResultModel.deleteMany({ studentId: userId }),
  ]);

  const deleteInfo = await Promise.all(deleteOperations);

  // response
  return res
    .status(200)
    .json({ message: "User deleted successfully", deleteInfo });
});

export const searchuser = asyncHandler(async (req, res, next) => {
  const allowFields = [
    "Full_Name",
    "_id",
    "Date_of_Birth",
    "gender",
    "PhoneNumber",
    "Date_of_Birth",
    "Student_Code",
    "National_Id",
    "imgName",
  ];

  const searchFieldsText = [
    "Full_Name",
    "PhoneNumber",
    "Student_Code",
    "National_Id",
  ];

  const searchFieldsIds = ["_id"];

  const apiFeatureInstance = new ApiFeature(
    userModel.find({}).lean(),
    req.query,
    allowFields
  )
    .pagination()
    .select()
    .filter()
    .sort()
    .search({ searchFieldsText, searchFieldsIds });

  const users = await apiFeatureInstance.MongoseQuery;

  for (const user of users) {
    if (user.imgName) {
      const { url } = await GetsingleImg({ ImgName: user.imgName });
      user.url = url;
    }
  }

  return res
    .status(200)
    .json({ message: "Done All Student Information", students: users });
});

export const AddStuImg = asyncHandler(async (req, res, next) => {
  let { studentId } = req.body;
  if (!req?.file) {
    return next(new Error("File should be provided", { cause: 400 }));
  }

  // if he was student
  if (req.user.role == roles.stu) {
    if (studentId) {
      return next(new Error("studentId not Allow", { cause: 400 }));
    }
    studentId = req.user._id.toString();
  }

  const student = await userModel.findById(studentId);
  if (!student) {
    return next(new Error("student not found", { cause: 404 }));
  }

  // Add Images
  let imgName, response;
  if (req.file) {
    if (student?.imgName) {
      const { imgName: name, response: resp } = await updateImg({
        imgName: student.imgName,
        file: req.file,
      });
      imgName = name;
      response = resp;
    } else {
      const newName = slugify(student.Full_Name, {
        trim: true,
        replacement: "_",
      });

      const folder = `${process.env.Folder_stu}/${newName}-${student._id}`;
      const { responses, ImgNames } = await createImg({
        folder,
        files: [req.file],
      });

      // Get response and imgnaem
      imgName = ImgNames[0];
      response = responses[0];
    }
  } else {
    return next(new Error("Need to provide Image first", { cause: 404 }));
  }

  // check its add successfully
  if (![200, 201, 203, 204].includes(response.$metadata.httpStatusCode)) {
    return next(new Error("Error In update Image", { cause: 500 }));
  }

  let result;
  if (!student?.imgName || student?.imgName !== imgName) {
    student.imgName = imgName;
    result = await student.save();
  } else {
    result = student;
  }

  return res
    .status(200)
    .json({ message: "Images Uploaded successfully", result });
});

export const deleteStuImg = asyncHandler(async (req, res, next) => {
  const { imgName } = req.body;
  let { studentId } = req.body;
  if (req.user.role == roles.stu) {
    studentId = req.user._id;
  }
  const student = await userModel.findById(studentId);

  if (!student) {
    return next(new Error("Student not found", { cause: 404 }));
  }

  if (student?.imgName !== imgName) {
    return next(new Error("Invalid imgName not found", { cause: 400 }));
  }

  // Delete image
  const { response } = await deleteImg({ imgName: imgName });

  if (![200, 201, 202, 203, 204].includes(response.$metadata.httpStatusCode)) {
    return next(new Error("Failed to delete image", { cause: 500 }));
  }

  // Remove imgName field from the student document
  const result = await userModel.findByIdAndUpdate(
    studentId,
    { $unset: { imgName: "" } },
    { new: true }
  );

  if (!result) {
    return next(new Error("Failed to update student", { cause: 500 }));
  }

  return res
    .status(200)
    .json({ message: "Image deleted successfully", result, response });
});

export const logout = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const token = await TokenModel.findOneAndUpdate({
    userId: user._id,
  });
});
