const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUid: { type: String, required: true, unique: true },
    userId: Number,
    creationTime: { type: Date, default: Date.now },
    lastSignInTime: { type: Date, default: Date.now },
    name: String,
    dateOfBirth: Number,
    phone: { type: String, required: true, unique: true },
    gender: String,
    height: String,
    interests: [String],
    likesReceived: { type: [String], default: [],
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' , required: true},
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere', // Create a geospatial index
            required: true
        },
        address : String,
        locality: String,
        place: String
        // Include other location fields if necessary (altitude, accuracy)
    },
    altitude: Number,
    accuracy: Number,
    bio: String,
    interestedIn: String,
    profilePictures: [Object],
    lookingFor: String, 
    preferences: {
        ageRange: {
            min: Number,
            max: Number
        },
        distance: Number,
        height: {
            min: String,
            max: String
        }
    },
    prompts: mongoose.Schema.Types.Mixed,
    hasCompletedOnboarding: Boolean,
     }
});

// Create a geospatial index for the location field
userSchema.index({ location: '2dsphere' });

module.exports =  mongoose.model('User', userSchema);


