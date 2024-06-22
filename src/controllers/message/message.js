import { adminModel } from "../../../DB/models/admin.model.js";
import conversationModel from "../../../DB/models/conversation.model.js";
import messageModel from "../../../DB/models/message.model.js";
import userModel from "../../../DB/models/user.model.js";
import { roles } from "../../middleware/auth.js";
import { getRecieverSocketId, io } from "../../socket/socket.js";
import { GetMultipleImages } from "../../utils/aws.s3.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  const { message } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  let conversation = await conversationModel.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await conversationModel.create({
      participants: [senderId, receiverId],
    });
  }

  const newMessage = new messageModel({
    senderId,
    receiverId,
    message,
  });

  if (newMessage) {
    conversation.messages.push(newMessage._id);
  }

  //Run in parallel
  await Promise.all([conversation.save(), newMessage.save()]);

  const receiverSocketId = getRecieverSocketId(receiverId);
  if (receiverSocketId) {
    //Send message to the receiver
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  return res.status(201).json(newMessage);
});

export const getMessages = asyncHandler(async (req, res, next) => {
  const { id: userToChatId } = req.params;
  const senderId = req.user._id;

  const conversation = await conversationModel
    .findOne({
      participants: { $all: [senderId, userToChatId] },
    })
    .populate("messages");

  if (!conversation) return res.status(200).json([]);

  const messages = conversation.messages;
  return res.status(200).json(messages);
});

export const getusersForSidebar = asyncHandler(async (req, res, next) => {
  const loggedInUserId = req.user._id;
  let filterUsers = {};
  if (req.user.role === roles.admin) {
    filterUsers = await userModel
      .find({
        _id: { $ne: loggedInUserId },
      })
      .select("-password -Agents Activecode isconfrimed")
      .lean();
  } else {
    filterUsers = await adminModel
      .find({
        _id: { $ne: loggedInUserId },
        role: "admin",
      })
      .select(
        "-password -Agents -Activecode -createdAt -updatedAt -__v -isconfrimed -Date_of_Birth"
      )
      .lean();
  }

  for (const user of filterUsers) {
    if (user?.imgName) {
      console.log(user?.imgName);
      user.images = await GetMultipleImages([user?.imgName]);
      delete user.imgName;
    }
  }

  return res.status(200).json(filterUsers);
});
