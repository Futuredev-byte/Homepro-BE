import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 160,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 160,
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 160,
        unique: true,
        lowercase: true,
        match: [
            /^[a-zA-Z0-9]+$/,
        ]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Invalid email format'
        ]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    phoneNumber: {
        type: String,
        default: '123456789',
        match: [
            /^\+?[0-9]{1,15}$/,
            'Invalid phone number format'
        ]
    },
    image: {
        type: String,
    },
    imagePublicId: {
        type: String,
    },
    address: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

export default mongoose.model('User', UserSchema);