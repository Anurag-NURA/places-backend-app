import { v2 as cloudinary, UploadApiResponse} from "cloudinary";

import { ErrorCode, FileUploadException } from "../exceptions";

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (fileBuffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error || !result) {
          // Handle upload error
          return reject(
            new FileUploadException(
            "Failed to upload file to Cloudinary", 
            ErrorCode.FILE_UPLOAD_FAILED
          ));
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId); 
  } catch (error) {
    throw new FileUploadException(
      "Failed to delete file from Cloudinary",
      ErrorCode.FILE_UPLOAD_FAILED
    );
  }
};
