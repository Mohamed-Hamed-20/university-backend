import { adminModel } from "../../../DB/models/admin.model.js";
import CourseModel from "../../../DB/models/course.model.js";
import { InstructorModel } from "../../../DB/models/instructor.model.js";
import semsterModel from "../../../DB/models/semster.model.js";
import trainingmodel from "../../../DB/models/training.model.js";
import userModel from "../../../DB/models/user.model.js";
import { generateToken, storeRefreshToken } from "../../utils/Token.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { hashpassword, verifypass } from "../../utils/hashpassword.js";
import { sendconfirmEmail } from "../../utils/sendEmail.js";

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check Email
  const user = await adminModel.findOne({ email: email });
  if (!user) {
    return next(new Error("Invalid Email or password", { cause: 404 }));
  }

  // check password
  const matched = await verifypass({
    password: password,
    hashpassword: user.password,
  });
  if (!matched) {
    return next(new Error("Invalid Email or password", { cause: 404 }));
  }

  if (!user.isconfrimed) {
    return next(
      new Error(
        "your Email Not verfied Did you want send to you verfication link to confirm your email",
        { cause: 404 }
      )
    );
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

export const CreateAdmin = asyncHandler(async (req, res, next) => {
  const { FullName, email, password, phone, Date_of_Birth, gender } = req.body;

  // استعلام واحد للتحقق من وجود الاسم أو البريد الإلكتروني أو رقم الهاتف
  const existingUser = await adminModel.findOne({
    $or: [{ FullName: FullName }, { email: email }, { phone: phone }],
  });

  // التحقق من وجود بيانات مستخدم موجودة بالفعل
  if (existingUser) {
    if (existingUser.FullName === FullName) {
      return next(new Error("FullName is Already Exist", { cause: 400 }));
    }
    if (existingUser.email === email) {
      return next(new Error("Email is Already Exist", { cause: 400 }));
    }
    if (existingUser.phone === phone) {
      return next(new Error("Phone is Already Exist", { cause: 400 }));
    }
  }

  const passhashed = await hashpassword({
    password: password,
    saltRound: process.env.salt_Round,
  });

  const user = {
    FullName: FullName,
    email: email,
    password: passhashed,
    phone: phone,
    Date_of_Birth: Date_of_Birth,
    gender: gender,
    isconfrimed: false,
    role: "admin",
  };
  const result = await adminModel.create(user);
  if (!result) {
    return next(new Error("Error Can create admin", { cause: 500 }));
  }
  const link = `${req.protocol}://${req.headers.host}/Api/admin/confirmEmail`;
  const confirmEmail = await sendconfirmEmail(result, link);
  if (!confirmEmail) {
    return next(new Error("Email not send successFully", { cause: 400 }));
  }
  return res.status(201).json({
    message: "Created Successfully Check your Inbox",
    user: {
      FullName: result.FullName,
      Email: result.email,
      role: result.role,
      gender: result.gender,
      _id: result._id,
    },
  });
});

export const updateAdmin = asyncHandler(async (req, res, next) => {
  const { FullName, phone, email, password, Date_of_Birth, gender } = req.body;
  const { userId } = req.query;

  const user = await adminModel.findById(userId);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  if (email && user.email != email) {
    const chkemail = await adminModel.findOne({ email: email });
    if (chkemail && chkemail._id.toString() !== userId) {
      return next(new Error("Email is already in use", { cause: 400 }));
    }
    user.email = email;
    user.isconfrimed = false;
  }

  if (password) {
    const hashpass = await hashpassword({
      password: password,
      saltRound: process.env.salt_Round,
    });
    user.password = hashpass;
  }

  if (FullName && user.FullName != FullName) {
    const name = await adminModel.findOne({ FullName: FullName });
    if (name && name._id.toString() !== userId) {
      return next(new Error("User name is already in use", { cause: 400 }));
    }
    user.FullName = FullName;
  }

  if (phone && user.phone != phone) {
    const chkphone = await adminModel.findOne({ phone: phone });
    if (chkphone && chkphone._id.toString() !== userId) {
      return next(new Error("Phone number is already in use", { cause: 400 }));
    }
    user.phone = phone;
  }

  user.Date_of_Birth = Date_of_Birth || user.Date_of_Birth;
  user.gender = gender || user.gender;

  const result = await user.save();

  return res
    .status(200)
    .json({ message: "User updated successfully", user: result });
});

export const deleteAdmin = asyncHandler(async (req, res, next) => {
  const { userId } = req.query;
  const user = await adminModel
    .findByIdAndDelete({ _id: userId }, {}, { new: true })
    .select("_id email FullName role gender");
  if (!user) {
    return next("user Id not found", { cause: 404 });
  }
  res.json({ message: "user Delete successfully", user: user });
});

// export const updaterole = asyncHandler(async (req, res, next) => {
//   const { role } = req.body;
//   const { userId } = req.query;
//   const user = await adminModel.findById(userId);
//   if (!user) {
//     return next(new Error("Invalid userId not found", { cause: 404 }));
//   }
//   user.role = role;
//   const result = await user.save();
//   return res.status(200).json({
//     message: `User updated successfully Henow is ${result.role}`,
//     user: result,
//   });
// });

//Get user

export const Getuser = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const user = req.user;
  if (!user) {
    return next(
      new Error("Invalid User Data please Try Again", { cause: 500 })
    );
  }

  const result = {
    FullName: user.FullName,
    email: user.email,
    phone: user.phone,
    Date_of_Birth: user.Date_of_Birth,
    gender: user.gender,
    department: user?.department,
    role: user.role,
  };
  return res.status(200).json({ message: "Done", user: result });
});

export const searchAdmin = asyncHandler(async (req, res, next) => {
  const allowFields = [
    "FullName",
    "email",
    "_id",
    "phone",
    "gender",
    "Date_of_Birth",
    "role",
  ];
  const searchFields = ["FullName", "email", "phone"];

  const apiFeatureInstance = new ApiFeature(
    adminModel.find(),
    req.query,
    allowFields
  )
    .pagination()
    .sort()
    .select()
    .search(searchFields)
    .filter();

  const admin = await apiFeatureInstance.MongoseQuery;
  return res.status(200).json({ message: "Done All Admin Information", admin });
});
export const info = asyncHandler(async (req, res, next) => {
  const courses = await CourseModel.countDocuments();
  const students = await userModel.countDocuments();
  const admins = await adminModel.countDocuments();
  const instructors = await InstructorModel.countDocuments();
  const semsters = await semsterModel.countDocuments();
  const training = await trainingmodel.countDocuments();

  return res.status(200).json({
    message: "done",
    info: { courses, students, admins, instructors, semsters, training },
  });
});
export const logout = asyncHandler(async (req, res, next) => {});
