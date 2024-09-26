import mongoose from "mongoose";
const { Schema } = mongoose;

const PropertySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    beds: {
        type: Number,
        required: true
    },
    bath: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    propertyType: {
        type: String,
        default: "apartment",
        enum: ["house", "office", "villa", "land"]
    },
    postedBy: {
        type: String,
        required: true
    },

}, {timestamps: true})

export default mongoose.model('Property', PropertySchema)