import userModel from "../../../DB/models/user.model.js";
import { generateToken, storeRefreshToken } from "../../utils/Token.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import {
  createImg,
  deleteImg,
  deleteMuliFiles,
  GetsingleImg,
  listoFiles,
  updateImg,
} from "../../utils/aws.s3.js";
import { calclevel } from "../../utils/calcGrates.js";
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
import { decryptData, encryptData } from "../../utils/crypto.js";
import { sanitizeStudent } from "../../utils/sanitize.data.js";
import jwt from "jsonwebtoken";
import * as gqr from "../../utils/qrcode.js";

// student login
export const login = asyncHandler(async (req, res, next) => {
  const { Student_Code, password } = req.body;

  //check Student_Code
  const user = await userModel
    .findOne({ Student_Code: Student_Code })
    .lean()
    .select("_id Full_Name Student_Code National_Id password role");

  if (!user) {
    return next(new Error("Invalid Student Code or password", { cause: 400 }));
  }

  if (user?.password) {
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
  const accessTokenPromise = generateToken({
    payload: { userId: user._id, role: user.role, IpAddress: req.ip },
    signature: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: process.env.accessExpireIn,
  });

  //generate refreshToken
  const refreshTokenPromise = generateToken({
    payload: { userId: user._id, role: user.role, IpAddress: req.ip },
    signature: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: process.env.REFRESH_ExpireIn,
  });

  const [accessToken, refreshToken] = await Promise.all([
    accessTokenPromise,
    refreshTokenPromise,
  ]);

  // encrpt accesss tokens
  const encrptAcessTokenpromise = encryptData({
    data: accessToken,
    password: process.env.ACCESS_TOKEN_ENCRPTION,
  });

  // encrpt refresh tokens
  const encrptRefTokenpromise = encryptData({
    data: refreshToken,
    password: process.env.REFRESH_TOKEN_ENCRPTION,
  });
  const success = await storeRefreshToken(refreshToken, user._id, next);

  const [encrptAcessToken, encrptRefToken] = await Promise.all([
    encrptAcessTokenpromise,
    encrptRefTokenpromise,
  ]);

  if (!success) {
    return next(new Error("Failed to store refresh token"), { cause: 500 });
  }

  return res.status(200).json({
    message: "done login",
    accessToken: encrptAcessToken,
    refreshToken: encrptRefToken,
    role: user.role,
  });
});

// GET Information student
export const Getuser = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const setting = req.setting;

  if (!user) {
    return next(
      new Error("Invalid User Data, please try again", { cause: 500 })
    );
  }

  const levelPromise = calclevel({
    totalCreditHours: user.totalCreditHours || 0,
  });

  const semsterInfoPromise = SemesterModel.findById(setting.MainSemsterId)
    .lean()
    .select("name year term");

  let urlImgPromise;
  if (user?.imgName) {
    urlImgPromise = GetsingleImg({ ImgName: user.imgName });
  }

  const [levelResult, semsterInfoResult, urlImgResult] = await Promise.all([
    levelPromise,
    semsterInfoPromise,
    urlImgPromise,
  ]);

  return res.status(200).json({
    message: "Done",
    result: {
      ...sanitizeStudent(user),
      level: levelResult.level,
      semsterInfo: semsterInfoResult,
      url: urlImgResult?.url,
    },
  });
});

export const studentInformation = asyncHandler(async (req, res, next) => {
  const { studentId } = req.query;
  const setting = req.setting;
  const user = await userModel.findById(studentId).lean();

  const levelPromise = calclevel({
    totalCreditHours: user.totalCreditHours || 0,
  });

  const semsterInfoPromise = SemesterModel.findById(setting.MainSemsterId)
    .lean()
    .select("name year term");

  let urlImgPromise;
  if (user?.imgName) {
    urlImgPromise = GetsingleImg({ ImgName: user.imgName });
  }

  const [levelResult, semsterInfoResult, urlImgResult] = await Promise.all([
    levelPromise,
    semsterInfoPromise,
    urlImgPromise,
  ]);

  return res.status(200).json({
    message: "student Information",
    result: {
      ...sanitizeStudent(user),
      level: levelResult.level,
      semsterInfo: semsterInfoResult,
      url: urlImgResult?.url,
    },
  });
});

// create new student By admin
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

  // Make sure data NOt dublicate
  const existingStudent = await userModel
    .findOne({
      $or: [
        { National_Id: National_Id },
        { Student_Code: Student_Code },
        { Full_Name: Full_Name },
        { PhoneNumber: PhoneNumber },
      ],
    })
    .lean();

  // search if student is already Exist
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

  // sudent object
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

// update student by Admin
export const updateStudent = asyncHandler(async (req, res, next) => {
  const {
    Full_Name,
    National_Id,
    Student_Code,
    Date_of_Birth,
    PhoneNumber,
    gender,
    department,
    resetPassword,
  } = req.body;

  const { userId } = req.query;

  const user = await userModel
    .findById({ _id: userId })
    .lean()
    .select(
      "_id Full_Name National_Id Student_Code Date_of_Birth PhoneNumber gender password department"
    );

  if (!user) {
    return next({ message: "User not found", cause: 404 });
  }

  const myquery = [];

  // ======================Check and update fields

  // check for full name
  if (Full_Name && user.Full_Name !== Full_Name) {
    myquery.push({ Full_Name: Full_Name });
  }

  // check for National_Id
  if (National_Id && user.National_Id !== National_Id) {
    myquery.push({ National_Id: National_Id });
  }

  // check student code
  if (Student_Code && user.Student_Code != Student_Code) {
    myquery.push({ Student_Code: Student_Code });
  }

  // check for phone number
  if (PhoneNumber && user.PhoneNumber !== PhoneNumber) {
    myquery.push({ PhoneNumber: PhoneNumber });
  }

  // make sure no duplication and data set In
  if (myquery.length > 0) {
    // Make sure data NOt dublicate
    const existingStudent = await userModel
      .findOne({
        $or: myquery,
      })
      .lean();

    // search if student is already Exist
    if (existingStudent) {
      if (existingStudent.National_Id === National_Id) {
        return next(new Error(" National Id is Already Exist", { cause: 400 }));
      }
      if (existingStudent.Student_Code === Student_Code) {
        return next(new Error("Student Code is Already Exist", { cause: 400 }));
      }
      if (existingStudent.Full_Name === Full_Name) {
        return next(new Error("Full Name is Already Exist", { cause: 400 }));
      }
      if (existingStudent.PhoneNumber === PhoneNumber) {
        return next(new Error("phone is Already Exist", { cause: 400 }));
      }
    }
  }

  const userUpdate = {};
  // Check and update fields
  if (Full_Name) userUpdate.Full_Name = Full_Name;
  if (National_Id) userUpdate.National_Id = National_Id;
  if (Student_Code) userUpdate.Student_Code = Student_Code;
  if (PhoneNumber) userUpdate.PhoneNumber = PhoneNumber;

  // reset his password
  if (resetPassword) {
    user.password = National_Id || user.National_Id;
    delete user.password;
  }

  // Update fields
  if (gender) userUpdate.gender = gender;
  if (Date_of_Birth) userUpdate.Date_of_Birth = Date_of_Birth;
  if (department) userUpdate.department = department;

  // Find and update user
  const updatedUser = await userModel.findByIdAndUpdate(
    { _id: userId },
    userUpdate,
    { new: true, lean: true, select: "_id Full_Name Student_Code gender" }
  );

  // if not updated
  if (!updatedUser) {
    return next(
      new Error("Error IN Updateing student information", { cause: 500 })
    );
  }

  return res.status(200).json({
    message: "Student information updated successfully",
    result: updatedUser,
  });
});

// delete student
export const deleteStudent = asyncHandler(async (req, res, next) => {
  const { userId } = req.query;
  const user = await userModel.findById(userId).select("_id ");

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const deleteOperations = [];

  if (user.imgName) {
    const newName = slugify(user.Full_Name, {
      replacement: "_",
    });
    const folder = `${process.env.Folder_stu}/${newName}-${user._id}/`;
    const { objects } = await listoFiles({ folder });
    deleteOperations.push(deleteMuliFiles({ objects })); // delete images
  }

  // gather all delete operations

  const deletionTasks = [
    user.deleteOne(), // delete student
    RegisterModel.deleteOne({ studentId: user._id }), // delete register model
    GradeModel.deleteMany({ studentId: user._id }),
    SemesterGradeModel.deleteMany({ studentId: user._id }),
    TrainingRegisterModel.deleteOne({ studentId: user._id }),
    trainingResultModel.deleteMany({ studentId: user._id }),
  ];

  deleteOperations.push(...deletionTasks);

  const deleteInfo = await Promise.all(deleteOperations);

  // response with deleted data
  return res.status(200).json({
    message: "User deleted successfully",
    deleteInfo,
    deletedUser: user,
  });
});

// search and get data for student
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
  const searchFieldsNumber = [];
  const apiFeatureInstance = new ApiFeature(
    userModel.find().lean(),
    req.query,
    allowFields
  )
    .pagination()
    .select()
    .filter()
    .sort()
    .search({ searchFieldsText, searchFieldsIds, searchFieldsNumber });

  const users = await apiFeatureInstance.MongoseQuery;

  // add images to response
  await Promise.all(
    users.map(async (user) => {
      if (user.imgName) {
        const { url } = await GetsingleImg({ ImgName: user.imgName });
        user.url = url;
      }
    })
  );

  // response
  return res
    .status(200)
    .json({ message: "Done All Student Information", students: users });
});

// upload student Image
export const AddStuImg = asyncHandler(async (req, res, next) => {
  let { studentId } = req.body;

  if (!req.file) {
    return next(new Error("File should be provided", { cause: 400 }));
  }

  // if he was student
  if (req.user.role == roles.stu) {
    if (studentId) {
      return next(new Error("studentId not Allow", { cause: 400 }));
    }
    studentId = req.user._id.toString();
  }

  const student = await userModel
    .findById(studentId)
    .select("_id imgName Full_Name ");
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

  // response Images Uploaded
  return res
    .status(200)
    .json({ message: "Images Uploaded successfully", result });
});

// delete student Images
export const deleteStuImg = asyncHandler(async (req, res, next) => {
  const { imgName } = req.body;
  let { studentId } = req.body;

  if (req.user.role == roles.stu) {
    studentId = req.user._id;
  }

  const student = await userModel
    .findById(studentId)
    .lean()
    .select("_id imgName Full_Name Student_Code");

  if (!student) {
    return next(new Error("Student not found", { cause: 404 }));
  }

  if (student?.imgName !== imgName) {
    return next(new Error("Invalid imgName not found", { cause: 404 }));
  }

  // Delete image
  const { response } = await deleteImg({ imgName: imgName });

  if (![200, 201, 202, 203, 204].includes(response.$metadata.httpStatusCode)) {
    return next(new Error("Failed to delete image", { cause: 500 }));
  }

  // Remove imgName field from the student document
  const result = await userModel
    .findByIdAndUpdate(studentId, { $unset: { imgName: "" } }, { new: true })
    .lean()
    .select("_id Full_Name National_Id Student_Code imgName");

  if (!result) {
    return next(new Error("Failed to update student", { cause: 500 }));
  }

  return res
    .status(200)
    .json({ message: "Image deleted successfully", result, response });
});

// student make log out from his account
export const logout = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const HashrefreshToken = req.headers["refresh-token"];

  const refreshToken = await decryptData({
    encryptedData: HashrefreshToken,
    password: process.env.REFRESH_TOKEN_ENCRPTION,
  });

  const token = await TokenModel.findOneAndUpdate(
    {
      userId: user._id,
    },
    { $pull: { refreshTokens: refreshToken } },
    { new: true }
  )
    .lean()
    .select("_id refreshTokens");

  if (!token) {
    return next(new Error("token document not found", { cause: 400 }));
  }
  return res.status(200).json({ message: "user logout successfully" });
});

//Generate QR code
export const getqr = asyncHandler(async (req, res, next) => {
  let userId = req.user._id;
  const token = await generateToken({
    payload: { userId },
    signature: process.env.DEFAULT_SIGNATURE,
    expiresIn: "2h",
  });
  const data = await encryptData({
    data: token,
    password: process.env.DEFAULT_SIGNATURE,
  });
  const url = await gqr.GenerateQrCode(data);
  //console.log(url);
  return res.status(200).json({ message: "Qr generated successfully", url });
});
