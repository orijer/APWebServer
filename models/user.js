const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    showName: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    friends: [{
        type: String
    }],
    friendRequests: [{
        type: String
    }],
    likedPosts: [{
        type: String
    }]

});

module.exports = mongoose.model("User", UserSchema);