
import Property from "../models/property.js";
import User from "../models/user.js";
import { cloudinary } from "../config/cloudinaryConfig.js";

// createProperty
export const createProperty = async (req, res) => {
  try {
    const { title, description, price, state, agentId, address, propertyFeatures, } = req.body;
    const imageFiles = req.files

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "title is required." });
    }

    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "description is required." });
    }
    if (!price) {
      return res
        .status(400)
        .json({ success: false, message: "price is required." });
    }
    if (!state) {
      return res
        .status(400)
        .json({ success: false, message: "state is required." });
    }
    if (!propertyFeatures) {
      return res
        .status(400)
        .json({ success: false, message: "propertyFeatures is required." });
    }

    let uploadedImages = [];
    if (imageFiles && imageFiles.length > 0) {
      uploadedImages = await Promise.all(
          imageFiles.map(async (file) => {
              try {
                  // Upload each file to Cloudinary
                  const imageResult = await cloudinary.uploader.upload(file.path);
                  return {
                      url: imageResult.secure_url,
                      imagePublicId: imageResult.public_id,
                  };
              } catch (err) {
                  console.error("Error uploading image to Cloudinary:", err.message);
                  return {
                      error: "Failed to upload image",
                  };
              }
          })
      );
  }

  // Filter out any failed uploads (optional)
  uploadedImages = uploadedImages.filter(image => !image.error);

  const agent = await User.findById(agentId);
  if (!agent || !agent.isAgent) {
      return res.status(400).json({
          success: false,
          message: "The selected agent is invalid or is not a registered agent.",
      });
  }


    // create a new property
    const property = new Property({
      title,
      description,
      price,
      state,
      address,
      postedBy: req.user.id,
      agentId: agentId || null,
      images: uploadedImages,
      propertyFeatures: propertyFeatures || {},
    });

    // save property
    await property.save();

    return res.json({
      success: true,
      message: "Property created successfully",
      property,
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

// updateProperty
export const updateProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      bedrooms,
      bathrooms,
      propertyType,
      sqm,
    } = req.body;
    const { propertyId } = req.params;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // Update property fields
    property.title = title || property.title;
    property.description = description || property.description;
    property.price = price || property.price;
    property.location = location || property.location;
    property.bedrooms = bedrooms || property.bedrooms;
    property.bathrooms = bathrooms || property.bathrooms;
    property.propertyType = propertyType || property.propertyType;
    property.sqm = sqm || property.sqm;

    // Save property
    await property.save();

    return res.json({
      success: true,
      message: "Property update successfully",
      property,
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

// getAllProperties
// export const getAllProperties = async (req, res) => {
//   try {
//     const properties = await Property.find().sort({ createdAt: -1 });
//     return res.json({
//       success: true,
//       message: "Properties fetched successfully",
//       properties,
//     });
//   } catch (err) {
//     console.log(err.message);
//     res
//       .status(500)
//       .json({ success: false, message: "Server Error", error: err.message });
//   }
// };

export const getAllProperties = async (req, res) => {
  try {
    const { page = 1, limit = 6, ...filters } = req.query;

    // Build query object from filters
    let query = {};
    if (filters.location) query.location = filters.location;
    if (filters.price) query.price = { $lte: filters.price }; // Example: get properties with price less than or equal

    // Execute query with pagination
    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1) // Convert limit to a number
      .skip((page - 1) * limit);

    const total = await Property.countDocuments(query);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      properties,
    });
  } catch (err) {
    console.error("Error fetching properties:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// getPropertyById
export const getPropertyById = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const property = await Property.findById(propertyId);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }
    return res.json({
      success: true,
      message: "Property fetched successfully",
      property,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const filterProperties = async (req, res) => {
  try {
    const {
      location = "",
      minPrice = 0,
      maxPrice = Number.MAX_SAFE_INTEGER,
      bedrooms = "",
      propertyType = "",
      page = 1,
      limit = 10,
    } = req.query;

    // Build filtering query
    let query = {};

    // Case-insensitive search for location
    if (location) {
      query.location = { $regex: new RegExp(location, "i") }; // "i" makes it case-insensitive
    }

    // Price filtering
    query.price = { $gte: minPrice, $lte: maxPrice };

    // Bedrooms filter (check if it was provided)
    if (bedrooms) {
      query.bedrooms = parseInt(bedrooms, 10); // Convert bedrooms to number
    }

    // Property type filter (case-insensitive)
    if (propertyType) {
      query.propertyType = { $regex: new RegExp(propertyType, "i") };
    }

    // Convert page and limit to numbers for pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    // Find properties with filters and pagination
    const properties = await Property.find(query)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const totalItems = await Property.countDocuments(query);

    res.status(200).json({
      success: true,
      currentPage: pageNum,
      totalPages: Math.ceil(totalItems / limitNum),
      totalItems: totalItems,
      limit: limitNum,
      properties,
    });
  } catch (err) {
    console.error("Error filtering properties:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const deleteProperty = async (req, res) => {
  try {
    const { propertyId } = req.params; // Get the property ID from the request parameters
    const userId = req.user.id; // authentication attaches the user's ID to req.user

    // console.log(userId);
    
    // Find the property by its ID
    const property = await Property.findById(propertyId);

    // Check if the property exists
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if the logged-in user is the owner of the property
    if (property.postedBy.toString() !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this property' });
    }

    // Delete the property
    await Property.findByIdAndDelete(propertyId);

    return res.status(200).json({ message: 'Property deleted successfully'});
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: 'Server error', error: err.message});
  }
};


// Search properties
export const searchProperty = async (req, res) => {
  try {
  } catch (err) {
    console.log(err.message);
  }
};
