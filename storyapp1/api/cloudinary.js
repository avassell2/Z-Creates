import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// User and thumbnail images storage
export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "upload",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

// comic pages
export const chapterStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chapterPages",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

export { cloudinary, storage };
