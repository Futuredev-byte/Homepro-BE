import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema;

const PropertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      default: 3,
    },
    bathrooms: {
      type: Number,
      default: 3,
        },
    sqm: {
      type: Number,
      default: 3000
    },
    location: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      default: "apartment",
      enum: ["apartment","house", "office", "villa", "land"],
    },
    images: [
      {
        url: {
          type: String,
        },
        imagePublicId: {
          type: String,
        },
      },
    ],
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("property", PropertySchema);