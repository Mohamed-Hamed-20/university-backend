import CourseModel from "../../../DB/models/course.model.js";
import { InstructorModel } from "../../../DB/models/instructor.model.js";
import { generateToken, storeRefreshToken } from "../../utils/Token.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { arrayofIds } from "../../utils/arrayobjectIds.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { hashpassword, verifypass } from "../../utils/hashpassword.js";
import { sendconfirmEmail } from "../../utils/sendEmail.js";

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check Email
  const user = await InstructorModel.findOne({ email: email });
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

  // if (!user.isconfrimed) {
  //   return next(
  //     new Error(
  //       "your Email Not verfied Did you want send to you verfication link to confirm your email",
  //       { cause: 404 }
  //     )
  //   );
  // }

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

export const CreateInstructor = asyncHandler(async (req, res, next) => {
  const {
    FullName,
    email,
    password,
    phone,
    Date_of_Birth,
    gender,
    department,
    Materials,
  } = req.body;

  const chkExistingData = await InstructorModel.findOne({
    $or: [{ FullName: FullName }, { email: email }, { phone: phone }],
  });

  if (chkExistingData) {
    let errorMessage = "";
    if (chkExistingData.FullName === FullName) {
      errorMessage = "FullName is Already Exist";
    } else if (chkExistingData.email === email) {
      errorMessage = "Email is Already Exist";
    } else if (chkExistingData.phone === phone) {
      errorMessage = "Phone is Already Exist";
    }
    return next(new Error(errorMessage, { cause: 400 }));
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
    department: department,
    role: "instructor",
  };

  if (Materials && Materials?.length > 0) {
    const MaterialsIds = arrayofIds(Materials);
    const findMaterialsIds = await CourseModel.find({
      _id: { $in: MaterialsIds },
      OpenForRegistration: true,
    });
    if (findMaterialsIds.length !== Materials.length) {
      return next(
        new Error(
          "Invalid One or more Materials Ids or course Not OpenForRegistration",
          { cause: 404 }
        )
      );
    }
    user.Materials = findMaterialsIds;
  }

  // إضافة الأستاذ
  const result = await InstructorModel.create(user);
  if (!result) {
    return next(new Error("Error Can create Instructor", { cause: 500 }));
  }

  // const link = `${req.protocol}://${req.headers.host}/Api/instructor/confirmEmail`;
  // const confirmEmail = await sendconfirmEmail(result, link);
  // if (!confirmEmail) {
  //   return next(new Error("Email not send successFully", { cause: 400 }));
  // }
  return res.status(201).json({
    message: "Created Successfully",
    user: {
      FullName: result.FullName,
      Email: result.email,
      role: result.role,
      department: result.department,
      gender: result.gender,
    },
  });
});

export const updateInstructor = asyncHandler(async (req, res, next) => {
  const {
    FullName,
    phone,
    email,
    password,
    Date_of_Birth,
    gender,
    Materials,
    department,
  } = req.body;
  const { userId } = req.query;

  const user = await InstructorModel.findById(userId);
  if (!user) {
    return next(new Error("Instructor not found", { cause: 404 }));
  }

  if (FullName && user?.FullName != FullName) {
    const name = await InstructorModel.findOne({ FullName: FullName });
    if (name && name._id.toString() !== userId) {
      return next(new Error("User name is already in use", { cause: 400 }));
    }
    user.FullName = FullName;
  }
  if (email && user?.email != email) {
    const chkemail = await InstructorModel.findOne({ email: email });
    if (chkemail && chkemail._id.toString() !== userId) {
      return next(new Error("Email is already in use", { cause: 400 }));
    }
    user.email = email;
  }

  if (phone && user?.phone != phone) {
    const chkphone = await InstructorModel.findOne({ phone: phone });
    if (chkphone && chkphone._id.toString() !== userId) {
      return next(new Error("Phone number is already in use", { cause: 400 }));
    }
    user.phone = phone;
  }

  if (password) {
    const hashpass = await hashpassword({
      password: password,
      saltRound: process.env.salt_Round,
    });
    user.password = hashpass;
  }

  if (Materials && Materials?.length > 0) {
    const MaterialsIds = arrayofIds(Materials);
    if (
      JSON.stringify(MaterialsIds.sort()) !=
      JSON.stringify(user?.Materials?.sort())
    ) {
      const findMaterialsIds = await CourseModel.find({
        _id: { $in: MaterialsIds },
        OpenForRegistration: true,
      });
      if (findMaterialsIds.length !== MaterialsIds.length) {
        return next(
          new Error(
            "Invalid One or more Materials Ids or course Not OpenForRegistration",
            { cause: 404 }
          )
        );
      }
      user.Materials = findMaterialsIds;
    }
  }
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.FullName = FullName || user.FullName;
  user.Date_of_Birth = Date_of_Birth || user.Date_of_Birth;
  user.gender = gender || user.gender;
  user.department = department || user.department;

  const result = await user.save();

  return res
    .status(200)
    .json({ message: "Instractor updated successfully", user: result });
});

export const deleteInstructor = asyncHandler(async (req, res, next) => {
  const { userId } = req.query;
  const user = await InstructorModel.findByIdAndDelete(
    { _id: userId },
    {},
    { new: true }
  ).select("_id email FullName role gender");
  if (!user) {
    return next("user Id not found", { cause: 404 });
  }
  res.json({ message: "Instructor Delete successfully", user: user });
});

//Get user
export const Getuser = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(
      new Error("Invalid User Data please Try Again", { cause: 500 })
    );
  }
  await user.populate({
    path: "Materials",
    select: "_id course_name desc credit_hour",
  });

  const result = {
    FullName: user.FullName,
    email: user.email,
    phone: user.phone,
    Date_of_Birth: user.Date_of_Birth,
    gender: user.gender,
    department: user?.department,
    role: user.role,
    Materials: user.Materials,
  };
  return res.status(200).json({ message: "Done", user: result });
});

export const searchInstructor = asyncHandler(async (req, res, next) => {
  const allowFields = [
    "FullName",
    "email",
    "_id",
    "phone",
    "gender",
    "Date_of_Birth",
    "Materials",
    "department",
  ];
  const searchFields = ["FullName", "email", "phone", "department"];

  const options = {
    select: "course_name desc credit_hour",
    path: "Materials",
  };
  const apiFeatureInstance = new ApiFeature(
    InstructorModel.find(),
    req.query,
    allowFields
  )
    .pagination()
    .sort()
    .select()
    .search(searchFields)
    .filter()
    .populate(options);

  const Instructor = await apiFeatureInstance.MongoseQuery;
  return res
    .status(200)
    .json({ message: "Done All Instrctors Information", Instructor });
});
export const logout = asyncHandler(async (req, res, next) => {});
