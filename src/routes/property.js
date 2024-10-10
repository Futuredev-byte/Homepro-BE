import express from 'express';
import { createProperty, updateProperty, getAllProperties, getPropertyById, filterProperties, deleteProperty } from '../controllers/property/index.js';
import { authCheck } from '../middlewares/auth.js';
import { upload } from '../config/multer.js';

const router = express.Router();

router.post('/create', authCheck, upload.array("images", 10),  createProperty); // localhost:8080/api/create
router.patch('/update/:propertyId', authCheck,  updateProperty); 
router.get('/properties', getAllProperties); 
router.get('/property/:propertyId', getPropertyById); 
router.get('/search', filterProperties);
router.delete('/delete/:propertyId', authCheck, deleteProperty);





export default router;