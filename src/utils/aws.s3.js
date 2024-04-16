import multer from "multer";
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import sharp from "sharp";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { generateHexName } from "./crpto.js";
import { response } from "express";

dotenv.config({ path: "./config/config.env" });

// تكوين AWS S3 client
export const s3Client = new S3Client({
  region: process.env.Bucket_Region, // اختر المنطقة التي ترغب في استخدامها
  credentials: {
    accessKeyId: process.env.AWS_Access_key,
    secretAccessKey: process.env.AWS_key_secret,
  },
});

export const allowedExtensions = {
  Image: ["image/png", "image/jpeg", "image/gif", "image/jfif"],
  Files: ["application/pdf"],
  Videos: ["video/mp4"],
};

export const multerCloud = (allowedExtensionsArr) => {
  if (!allowedExtensionsArr) {
    allowedExtensionsArr = allowedExtensions.Image;
  }
  //================================== Storage =============================
  const storage = multer.memoryStorage({});

  //================================== File Filter =============================
  const fileFilter = function (req, file, cb) {
    console.log(file.mimetype);
    if (allowedExtensionsArr.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error("invalid extension", { cause: 400 }), false);
  };

  const upload = multer({
    fileFilter,
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
  });
  return upload;
};

export const createImg = async ({ folder, files }) => {
  // List to store all the promises related to uploading files
  const uploadPromises = [];
  const allImgNames = [];

  // Configuring promises for uploading each file
  for (const file of files) {
    try {
      const { hexString } = await generateHexName();

      const buffer = await sharp(file.buffer)
        .resize({ width: 800, height: 600, fit: "contain" })
        .png({ quality: 80 })
        .toBuffer();

      const imgName = `${folder}/${hexString}`;
      allImgNames.push(imgName);

      // Setting up parameters for uploading the file
      const params = {
        Key: imgName,
        Bucket: process.env.Bucket_name,
        Body: buffer,
        ContentType: file.mimetype,
      };

      // Adding the upload promise to the list
      uploadPromises.push(s3Client.send(new PutObjectCommand(params)));
    } catch (error) {
      console.error("Error while uploading the file:", error);
      // If an error occurs, immediately reject the promise
      throw error;
    }
  }

  // Wait for all upload operations to complete
  const responses = await Promise.all(uploadPromises);
  responses.forEach((response) => {
    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error("server error In uploading Images");
    }
  });
  return { responses, ImgNames: allImgNames };
};

export const GetsingleImg = async ({ ImgName }) => {
  const getObjectParams = {
    Key: ImgName,
    Bucket: process.env.Bucket_name,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return { url };
};

export const deleteImg = async ({ imgName }) => {
  const params = {
    Key: imgName,
    Bucket: process.env.Bucket_name,
  };
  const command = new DeleteObjectCommand(params);
  const response = await s3Client.send(command);
  return { response };
};

export const updateImg = async ({ imgName, file }) => {
  const buffer = await sharp(file.buffer)
    .resize({ width: 800, height: 600, fit: "contain" })
    .png({ quality: 80 })
    .toBuffer();

  const params = {
    Key: imgName,
    Bucket: process.env.Bucket_name,
    Body: buffer,
    ContentType: file.mimetype,
  };
  const command = new PutObjectCommand(params);
  const response = await s3Client.send(command);
  return { response, imgName };
};

export const listoFiles = async ({ folder }) => {
  const command = new ListObjectsV2Command({
    Bucket: process.env.Bucket_name,
    Prefix: folder,
  });
  const data = await s3Client.send(command);

  return { data };
};
export const deleteMuliFiles = async ({ objects }) => {
  const Allkeys = objects.Contents.map((object) => {
    return object.Key;
  });
  const command = new DeleteObjectsCommand({
    Bucket: process.env.Bucket_name,
    Delete: { Objects: Allkeys },
  });
  const response = await s3Client.send(command);
  return { response };
};

export const deleteImages = async ({ folder }) => {
  // Delete the folder itself
  const params = new DeleteObjectCommand({
    Bucket: process.env.Bucket_name,
    Prefix: folder,
  });

  const response = await s3Client.send(params);
  return { response };
};
