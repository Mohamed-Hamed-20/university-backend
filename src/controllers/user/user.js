// import TotalGratesModel from "../../../DB/models/StudentGrades.model.js";
import semsterModel from "../../../DB/models/semster.model.js";
import settingModel from "../../../DB/models/setting.model.js";
import userModel from "../../../DB/models/user.model.js";
import { generateToken, storeRefreshToken } from "../../utils/Token.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import {
  createImg,
  deleteImg,
  GetsingleImg,
  updateImg,
} from "../../utils/aws.s3.js";
import { calclevel, calculateGPA } from "../../utils/calcGrates.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { verifypass } from "../../utils/hashpassword.js";

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
  if (!user) {
    return next(
      new Error("Invalid User Data please Try Again", { cause: 500 })
    );
  }
  const { TotalGpa, totalCreditHours } = await calculateGPA({
    studentId: user._id,
  });
  const { level } = await calclevel({ totalCreditHours });
  const semsterInfo = await settingModel
    .findOne()
    .populate({
      select: "name year term Max_Hours",
      path: "MainSemsterId",
    })
    .select("MainSemsterId");

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

  //upload Image
  const folder = `university/students/${Full_Name}-${Student_Code}`;
  const { imgName, response } = await createImg({ folder, file: req.file });

  if (response.$metadata.httpStatusCode !== 200) {
    return next(new Error("Error in uploading Img", { cause: 500 }));
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
    imgName: imgName,
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

  if (req.file) {
    const { imgName, response } = await updateImg({ imgName: user.imgName });
    if (response.$metadata.httpStatusCode !== 200) {
      return next(
        new Error("server Error Image Not update successfully", { cause: 500 })
      );
    }
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
  const user = await userModel
    .findByIdAndDelete({ _id: userId }, {}, { new: true })
    .select("_id Full_Name Student_Code gender");
  if (!user) {
    return next("user Id not found", { cause: 404 });
  }
  const { response } = await deleteImg({ imgName: user.imgName });
  if (response.$metadata.httpStatusCode != 200) {
    return next(
      new Error("server Error In deleting user Iamge", { cause: 500 })
    );
  }
  res.json({ message: "user Delete successfully", user: user });
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
  ];

  const searchFieldsText = [
    "Full_Name",
    "PhoneNumber",
    "Student_Code",
    "National_Id",
  ];

  const searchFieldsIds = ["_id"];

  const apiFeatureInstance = new ApiFeature(
    userModel.find({}),
    req.query,
    allowFields
  )
    .pagination()
    .select()
    .filter()
    .sort()
    .search({ searchFieldsText, searchFieldsIds });

  const users = await apiFeatureInstance.MongoseQuery;
  return res
    .status(200)
    .json({ message: "Done All Student Information", students: users });
});

export const logout = asyncHandler(async (req, res, next) => {});
