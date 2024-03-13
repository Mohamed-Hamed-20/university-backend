import nodemailer from "nodemailer";
import { confirmEmailTemplet } from "./templetHtml.js";
import { generateToken } from "./Token.js";

export const sendEmail = async ({ to, subject, html, bcc } = {}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "localhost",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.password,
      },
    });
    const info = await transporter.sendMail({
      from: `"Banha University👻" <${process.env.email}>`, // sender address
      to,
      bcc, // list of receivers
      subject, // Subject line
      text: "Hello world?", // plain text body
      html, // html body
    });
    if (info.accepted.length < 1) {
      throw new Error("Email Not send Successfully");
    } else {
      return true;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const sendconfirmEmail = async (user, link) => {
  try {
    const token = await generateToken({
      payload: { userId: user._id, email: user.email },
      signature: process.env.DEFAULT_SIGNATURE,
      expiresIn: "8m",
    });
    link = `${link}/${token}`;
    const html = await confirmEmailTemplet(link);
    const isSend = await sendEmail({
      to: user.email,
      subject: "This message to Make sure you email is comfirmed",
      html: html,
      bcc: [process.env.universityEmail],
    });
    if (isSend) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(error);
  }
};
