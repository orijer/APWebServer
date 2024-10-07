const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    _id: Schema.Types.ObjectId,
    author_name: {
        type: String,
        required: true
    },
    author_showName: {
        type: String,
        required: true
    },
    comment_text: {
        type: String,
        required: true
    }
});

const PostSchema = new Schema({
    author_name: {
        type: String,
        required: true
    },
    post_text_dir: {
        type: String,
        default: "RTL"
    },
    post_text: {
        type: String,
        required: true
    },
    post_img: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [CommentSchema]
});

module.exports = {
    Post: mongoose.model("Post", PostSchema),
    Comment: mongoose.model("Comment", CommentSchema)
};