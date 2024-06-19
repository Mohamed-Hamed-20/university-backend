import slugify from "slugify";
import { adminModel } from "../../../DB/models/admin.model.js";
import CourseModel from "../../../DB/models/course.model.js";
import { InstructorModel } from "../../../DB/models/instructor.model.js";
import semsterModel from "../../../DB/models/semster.model.js";
import trainingmodel from "../../../DB/models/training.model.js";
import userModel from "../../../DB/models/user.model.js";
import { roles } from "../../middleware/auth.js";
import {
  generateToken,
  storeRefreshToken,
  verifyToken,
} from "../../utils/Token.js";
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
import { asyncHandler } from "../../utils/errorHandling.js";
import { hashpassword, verifypass } from "../../utils/hashpassword.js";
import { sanitizeAdmin } from "../../utils/sanitize.data.js";
import { decryptData, encryptData } from "../../utils/crypto.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { confirmEmailTemplet } from "../../utils/templetHtml.js";
import { routes } from "../../utils/routes.path.js";
import e from "express";
const { Admin } = routes;

// Login Admin or super admin
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const userAgent = req.headers["user-agent"];

  // check Email
  const user = await adminModel.findOne({ email: email }).lean();
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

  if (true == false) {
    if (!user.isconfrimed || !user?.Agents?.includes(userAgent)) {
      const encrypted = await encryptData({
        data: JSON.stringify({
          userId: user._id,
          role: user.role,
          Agent: userAgent,
        }),
        password: process.env.cryptoKeyConfirmEmails,
      });

      if (!encrypted) {
        return next(new Error("Error in encption data", { cause: 500 }));
      }
      return res
        .status(401)
        .json({ message: "Email Need To confirm", key: encrypted });
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

  // promise ref and access
  const [accessToken, refreshToken] = await Promise.all([
    accessTokenPromise,
    refreshTokenPromise,
  ]);

  // // encrpt accesss tokens
  // const encrptAcessTokenpromise = encryptData({
  //   data: accessToken,
  //   password: process.env.ACCESS_TOKEN_ENCRPTION,
  // });

  // // encrpt refresh tokens
  // const encrptRefTokenpromise = encryptData({
  //   data: refreshToken,
  //   password: process.env.REFRESH_TOKEN_ENCRPTION,
  // });

  const successpromise = storeRefreshToken(refreshToken, user._id, next);

  const [/*encrptAcessToken, encrptRefToken,*/ success] = await Promise.all([
    // encrptAcessTokenpromise,
    // encrptRefTokenpromise,
    successpromise,
  ]);

  if (!success) {
    return next(new Error("Failed to store refresh token"), { cause: 500 });
  }

  // response login
  return res.status(200).json({
    message: "done login",
    accessToken: accessToken,
    refreshToken: refreshToken,
    role: user.role,
    user: sanitizeAdmin(user),
  });
});

// send confirm email to admin or super
export const SendconfirmEmail = asyncHandler(async (req, res, next) => {
  const { key } = req.query;
  const userAgent = req.headers["user-agent"];

  // decrpt key user have
  const decrypted = await decryptData({
    encryptedData: key,
    password: process.env.cryptoKeyConfirmEmails,
  });

  if (!decrypted) {
    return next(new Error("Invalid Key decrypted", { cause: 400 }));
  }

  // Get dat
  const data = JSON.parse(decrypted);

  if (!data.userId || !data.role) {
    return next(new Error("Invaild Key payload", { cause: 400 }));
  }

  let user;
  if (data.role == roles.stu) {
    user = await userModel.findById(data.userId);
  } else if (data.role == roles.instructor) {
    user = await InstructorModel.findById(data.userId);
  } else {
    user = await adminModel.findById(data.userId);
  }

  if (!user) {
    return next(new Error("Invaild userId", { cause: 400 }));
  }

  const token = await generateToken({
    payload: { userId: user._id, role: user.role, userAgent },
    expiresIn: process.env.ConfirmEmailExpireIn,
    signature: process.env.ConfirmEmailPassword,
  });

  if (!token) {
    return next(new Error("Faild to create Token", { cause: 500 }));
  }

  const encrypted = await encryptData({
    data: token,
    password: process.env.cryptoKeyConfirmEmails,
  });

  if (!encrypted) {
    return next(new Error("Error In encrypted Data", { cause: 500 }));
  }

  user.Activecode = encrypted;
  const saveActiveCode = await user.save();

  // return error
  if (!saveActiveCode) {
    return next(new Error("Error In Save Activation code", { cause: 500 }));
  }

  const to = user.email;
  const subject =
    "This message to Make sure you email is comfirmed To our Website";
  const link = `${req.protocol}://${req.headers.host}${Admin._id}${Admin.checkConfirmEmail}/${encrypted}`;

  const html = `${await confirmEmailTemplet(link)}`;
  const isSend = await sendEmail({ to, subject, html });
  if (!isSend) {
    return next(new Error("Faild to send confirm Email", { cause: 500 }));
  }

  return res
    .status(200)
    .json({ message: "Email send successfully check your Inbox" });
});

//check confiremed email
export const checkConfirmEmail = asyncHandler(async (req, res, next) => {
  const { key } = req.params;

  const decrypt = await decryptData({
    encryptedData: key,
    password: process.env.cryptoKeyConfirmEmails,
  });

  const data = verifyToken({
    token: decrypt,
    signature: process.env.ConfirmEmailPassword,
  });

  let user;
  if (data.role == roles.stu) {
    user = await userModel.findById(data.userId);
  } else if (data.role == roles.instructor) {
    user = await InstructorModel.findById(data.userId);
  } else {
    user = await adminModel.findById(data.userId);
  }

  if (user.Activecode !== key) {
    return next(new Error("Invalid Activation code", { statusCode: 400 }));
  }

  // user.Activecode;

  if (user && user.Activecode) {
    delete user.Activecode;
  }

  if (!user.Agents.includes(data.userAgent)) {
    user?.Agents?.push(data.userAgent);
  }
  const result = await user.save();

  // Don't include decrypt in the response
  delete result.decrypt;

  return res.status(200).json({ key: data, result });
});

// Create Admin
export const CreateAdmin = asyncHandler(async (req, res, next) => {
  const { FullName, email, password, phone, Date_of_Birth, gender } = req.body;

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
    role: roles.admin,
  };

  const result = await adminModel.create(user);
  if (!result) {
    return next(new Error("Error Can create admin", { cause: 500 }));
  }

  return res.status(201).json({
    message: "Created Admin Successfully",
    user: {
      FullName: result.FullName,
      Email: result.email,
      role: result.role,
      gender: result.gender,
      _id: result._id,
    },
  });
});

// update Admin
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

// delete Admin
export const deleteAdmin = asyncHandler(async (req, res, next) => {
  const { userId } = req.query;
  const user = await adminModel
    .findById({ _id: userId }, {}, { new: true })
    .select("_id FullName email phone Date_of_Birth gender role imgName");
  if (!user) {
    return next("user Id not found", { cause: 404 });
  }
  const deleteOperations = [];
  if (user?.imgName) {
    // Delete images
    const newName = slugify(user.FullName, {
      trim: true,
      replacement: "_",
    });

    const folder = `${process.env.Folder_Admin}/${newName}-${user._id}/`;
    const { objects } = await listoFiles({ folder });

    deleteOperations.push(deleteMuliFiles({ objects }));
  }
  //delete user
  deleteOperations.push(user.deleteOne());

  if (result.deletedCount == 0) {
    return next(
      new Error("server error Try later Not deleted successfully", {
        cause: 500,
      })
    );
  }
  return res
    .status(200)
    .json({ message: "Admin Delete successfully", user: user, result });
});

//Get Infromation
export const Getuser = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(
      new Error("Invalid User Data please Try Again", { cause: 500 })
    );
  }
  let urlImg;
  if (user?.imgName) {
    const { url } = await GetsingleImg({ ImgName: user.imgName });
    urlImg = url;
  }
  const result = {
    FullName: user.FullName,
    email: user.email,
    phone: user.phone,
    Date_of_Birth: user.Date_of_Birth,
    gender: user.gender,
    department: user?.department,
    role: user.role,
    urlImg,
  };
  return res.status(200).json({ message: "Done", user: result });
});

// search for admins
export const searchAdmin = asyncHandler(async (req, res, next) => {
  const allowFields = [
    "FullName",
    "email",
    "_id",
    "phone",
    "gender",
    "Date_of_Birth",
    "role",
    "imgName",
  ];
  const searchFieldsText = ["FullName", "email", "phone"];
  const searchFieldsIds = ["_id"];

  const apiFeatureInstance = new ApiFeature(
    adminModel.find().lean(),
    req.query,
    allowFields
  )
    .pagination()
    .sort()
    .select()
    .search({ searchFieldsText, searchFieldsIds })
    .filter();

  const admins = await apiFeatureInstance.MongoseQuery;

  for (const admin of admins) {
    if (admin.imgName) {
      const { url } = await GetsingleImg({ ImgName: admin.imgName });
      admin.url = url;
    }
  }

  return res
    .status(200)
    .json({ message: "Done All Admin Information", admins });
});

// admin dashboard
export const dashboard = asyncHandler(async (req, res, next) => {
  const [courses, students, admins, instructors, semsters, training] =
    await Promise.all([
      CourseModel.countDocuments(),
      userModel.countDocuments(),
      adminModel.countDocuments(),
      InstructorModel.countDocuments(),
      semsterModel.countDocuments(),
      trainingmodel.countDocuments(),
    ]);

  return res.status(200).json({
    message: "done",
    info: { courses, students, admins, instructors, semsters, training },
  });
});

// upload images to admin
export const AddAdminImg = asyncHandler(async (req, res, next) => {
  const { adminId } = req.body;

  let admin;
  if (req.user.role == roles.super) {
    admin = await adminModel.findById(adminId);
    if (!admin) {
      return next(new Error("admin  not found", { cause: 404 }));
    }
  } else if (req.user.role == roles.admin) {
    admin = req.user;
  }

  // Add Images
  let imgName, response;
  if (req.file) {
    if (admin?.imgName) {
      const { imgName: name, response: resp } = await updateImg({
        imgName: admin.imgName,
        file: req.file,
      });
      imgName = name;
      response = resp;
    } else {
      const newName = slugify(admin.FullName, { trim: true, replacement: "_" });
      const folder = `${process.env.Folder_Admin}/${newName}-${admin._id}`;
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
  if (!admin.imgName || admin?.imgName !== imgName) {
    admin.imgName = imgName;
    // Save the course
    result = await admin.save();
  } else {
    result = admin;
  }

  return res
    .status(200)
    .json({ message: "Images Uploaded successfully", result });
});

// delete images to admin
export const deleteAdminImg = asyncHandler(async (req, res, next) => {
  const { adminId } = req.body;
  let { imgName } = req.body;
  let admin;

  if (req.user.role == roles.super) {
    admin = await adminModel
      .findById(adminId)
      .lean()
      .select("FullName imgName role");
    if (!admin) {
      return next(new Error("admin not found", { cause: 404 }));
    }
  }

  if (req.user.role == roles.admin) {
    admin = req.user;
    imgName = req.user.imgName;
  }

  if (!admin?.imgName || admin?.imgName != imgName) {
    return next(
      new Error("Invalid imgName or doesn't have Img", { cause: 400 })
    );
  }

  // Delete image
  const { response } = await deleteImg({ imgName: imgName });

  if (![200, 201, 202, 203, 204].includes(response.$metadata.httpStatusCode)) {
    return next(new Error("Failed to delete image", { cause: 500 }));
  }

  // Remove imgName field from the admin document
  const result = await adminModel.findByIdAndUpdate(
    admin._id,
    { $unset: { imgName: "" } },
    { new: true }
  );

  if (!result) {
    return next(new Error("Failed to update admin", { cause: 500 }));
  }

  return res
    .status(200)
    .json({ message: "Image deleted successfully", result, response });
});

// admin or super logout
export const logout = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const refreshToken = req.headers["refresh-token"];

  // const refreshToken = await decryptData({
  //   encryptedData: HashrefreshToken,
  //   password: process.env.REFRESH_TOKEN_ENCRPTION,
  // });

  const token = await TokenModel.findOneAndUpdate(
    {
      userId: user._id,
    },
    { $pull: { refreshTokens: refreshToken } },
    { new: true }
  );

  if (!token) {
    return next(new Error("token document not found", { cause: 400 }));
  }
  return res.status(200).json({ message: "user logout successfully" });
});

export const AddsuperAdminImg = asyncHandler(async (req, res, next) => {
  let admin = req.user;

  // Add Images
  let imgName, response;
  if (req.file) {
    if (admin?.imgName) {
      const { imgName: name, response: resp } = await updateImg({
        imgName: admin.imgName,
        file: req.file,
      });
      imgName = name;
      response = resp;
    } else {
      const newName = slugify(admin.FullName, { trim: true, replacement: "_" });
      const folder = `${process.env.Folder_Admin}/${newName}-${admin._id}`;
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
  if (!admin.imgName || admin?.imgName !== imgName) {
    admin.imgName = imgName;
    // Save the course
    result = await admin.save();
  } else {
    result = admin;
  }

  return res.status(200).json({
    message: "Images Uploaded successfully",
    FullName: result?.FullName,
    email: result?.email,
    imgName: result.imgName,
  });
});

export const deletesuperImg = asyncHandler(async (req, res, next) => {
  let admin = req.user;
  const imgName = admin.imgName;

  if (!admin?.imgName) {
    return next(new Error("user doesn't have Img to delete", { cause: 400 }));
  }

  // Delete image
  const { response } = await deleteImg({ imgName: imgName });

  if (![200, 201, 202, 203, 204].includes(response.$metadata.httpStatusCode)) {
    return next(new Error("Failed to delete image", { cause: 500 }));
  }

  // Remove imgName field from the admin document
  const result = await adminModel.findByIdAndUpdate(
    admin._id,
    { $unset: { imgName: "" } },
    { new: true }
  );

  if (!result) {
    return next(new Error("Failed to update admin", { cause: 500 }));
  }

  return res.status(200).json({
    message: "Image deleted successfully",
    FullName: result?.FullName,
    email: result?.email,
    response,
  });
});
