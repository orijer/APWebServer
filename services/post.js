const { Post, Comment } = require("../models/post");
const User = require("../models/user");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const bloomfilter = require("./bloomfilter");

const getPosts = async (userName) => {
    const user = await User.findOne({ userName });

    const friendPosts = await Post.find({ author_name: { $in: user.friends } })
        .sort({ date: -1 })
        .limit(20);

    const nonFriendPosts = await Post.find({ author_name: { $nin: [...user.friends, userName] } })
        .sort({ date: -1 })
        .limit(5);

    const allPosts = [...friendPosts, ...nonFriendPosts].sort((a, b) => b.date - a.date);

    return allPosts;
}

const getUserPosts = async (userName, currentUserName) => {
    const user = await User.findOne({ userName });
    if (!user) {
        throw new Error("User not found");
    }

    const friends = user.friends;
    const index = friends.indexOf(currentUserName);
    if (index == -1 && userName != currentUserName) {
        throw new Error("Only friends can see each other posts");
    }

    return await Post.find({ author_name: userName }).sort({ date: -1 }); //Sorted in descending order of date.
}

const addUserPost = async (userName, post_text, post_img) => {
    let result = await bloomfilter.isTextLegal(post_text);
    if (!result) { // The post contained a blacklisted link:
        throw new Error("The post text contains a blacklisted url");
    }

    // The post is legal and should thus be uploaded to the server:
    let post = new Post({ author_name: userName, post_text });
    if (post_img)
        post.post_img = post_img;

    return await post.save();
}

const updateUserPost = async (postAuthor, postID, newText, newImage) => {
    let result = await bloomfilter.isTextLegal(newText);
    if (!result) { // The post contained a blacklisted link:
        throw new Error("The new post text contains a blacklisted url");
    }

    const post = await Post.findOne({ author_name: postAuthor, _id: postID });
    if (!post) {
        throw new Error('Post not found');
    }

    if (newText && newText !== post.post_text) {
        post.post_text = newText;
    }

    if (newImage && newImage != "" && newImage !== post.post_img) {
        post.post_img = newImage;
    }

    await post.save();
}

const deletePost = async (postAuthor, postID) => {
    const postToDelete = await Post.findOne({ _id: postID, author_name: postAuthor });

    if (!postToDelete) {
        throw new Error('Post not found');
    }

    return await Post.deleteOne({ _id: postID });
}
      
const addComment = async (postID, comment_text, currentUserName) => {
    
    let result = await bloomfilter.isTextLegal(comment_text);
    if (!result) { // The post contained a blacklisted link:
        throw new Error("The new comment text contains a blacklisted url");
    }
    
    const user = await User.findOne({ userName: currentUserName}); // This user is always valid since the jwt is valid
    
    let post = await Post.findOne({ _id: postID });
    if (!post) {
        throw new Error('Post not found');
    }

    const comment = new Comment({ _id: new ObjectId(), author_name: currentUserName, author_showName: user.showName, comment_text });

    post.comments.push(comment);
    await post.save();

    return post.comments;
}

const updateComment = async (postID, commentID, comment_text, currentUserName) => {
    let result = await bloomfilter.isTextLegal(comment_text);
    if (!result) { // The post contained a blacklisted link:
        throw new Error("The new comment text contains a blacklisted url");
    }

    let post = await Post.findOne({ _id: postID});
    if (!post) {
        throw new Error('Post not found');
    }

    let comment = post.comments.find(comment => comment._id.toString() === commentID);
    if (!comment) {
        throw new Error('Comment not found');
    }

    if (comment.author_name !== currentUserName) {
        throw new Error('Only the author of the comment can edit it');
    }

    // Everything matches, just change the text of that comment and save the changes:
    comment.comment_text = comment_text;
    await post.save();

    return post.comments;
}

const deleteComment = async (postID, commentID, comment_text, currentUserName) => {
    let post = await Post.findOne({ _id: postID });
    if (!post) {
        throw new Error('Post not found');
    }

    let comment = post.comments.find(comment => comment._id.toString() === commentID);
    if (!comment) {
        throw new Error('Comment not found');
    }

    if (comment.author_name !== currentUserName) {
        throw new Error('Only the author of the comment can delete it');
    }

    // Everything matches, just change the text of that comment and save the changes:
    post.comments = post.comments.filter(comment => comment._id.toString() !== commentID);
    await post.save();

    return post.comments;
}

module.exports = { getPosts, getUserPosts, addUserPost, updateUserPost, deletePost, addComment, updateComment, deleteComment };