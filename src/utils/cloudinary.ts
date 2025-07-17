import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (filePath: string) => {
  try {
    if (!filePath) {
      return null;
    }

    //upload file to cloudinary
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    //file uploaded successfully
    console.log(
      "File uploaded successfully on Cloudinary",
      response.secure_url
    );
    return response.secure_url;
  } catch (error) {
    fs.unlinkSync(filePath); // delete file from local storage
    return null;
  }
};
