const mongoose = require('mongoose');

// Helper function to format dates
const formatDate = (date) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    };
    return new Date(date).toLocaleString('en-IN', options); // Change 'en-IN' as per your requirement
};

// Define the User schema
const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: false, // Not required unless user signs up with Google
       // unique: true // Ensure no duplicate Google IDs
        sparse: true, // Allow users to have either a Google ID or a password
    },
    // You can add additional fields as needed
    profilePicture: {
        type: String, // URL for the user's profile picture
        default: null,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        type: String,
        required: function() {
            // Password is required only if googleId is not provided
            return !this.googleId;
        },
    },
    resetToken: { // Add this field to store the OTP
        type: String,
    },
    resetTokenExpiry: { // Add this field to store the OTP expiration time
        type: Date,
    },
    createdAt: {
        type: String, // Change to String to store formatted date
        default: () => formatDate(new Date()),
    },
    updatedAt: {
        type: String, // Change to String to store formatted date
        default: () => formatDate(new Date()),
    },
}, { timestamps: true , collection: 'user_signup' } ); // This adds createdAt and updatedAt fields but we are overriding them

// Pre-save middleware to format dates before saving
UserSchema.pre('save', function(next) {
    this.updatedAt = formatDate(new Date()); // Update the updatedAt field on every save
    if (!this.createdAt) {
        this.createdAt = formatDate(new Date()); // Set createdAt only if it doesn't exist
    }
    next();
});

// Create the model based on the schema
const User = mongoose.model('User', UserSchema);

module.exports = User;
