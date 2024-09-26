import mongoose from "mongoose"
const { Schema } = mongoose
const { ObjectId } = Schema
const BookingSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    property: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, {timestamps: true})

export default mongoose.model('Booking', BookingSchema)