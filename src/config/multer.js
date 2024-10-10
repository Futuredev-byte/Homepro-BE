// config/multer.js
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = 'properties';
        let allowedFormats = ['jpg', 'png', 'gif', 'jpeg', 'svg', 'webp'];
        
        if (file.mimetype.startsWith('video/')) {
            folder = 'property_videos';
            allowedFormats = ['mp4', 'webm', 'ogg'];
        }

        return {
            folder: folder,
            resource_type: 'auto', // Automatically determine whether it's image/video
            allowedFormats: allowedFormats,
        };
    }
});

export const upload = multer({ storage: storage });