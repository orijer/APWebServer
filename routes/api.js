const postController = require("../controllers/post");
const userController = require("../controllers/user");
const loginController = require("../controllers/login");

const express = require("express");
var router = express.Router();

// Create a new user:
router.route("/users").post(userController.createUser);

// Create a new JWT for an existing user:
router.route("/tokens").post(loginController.login);

// Get posts from the server in a specific way:
router.route("/posts").get(postController.getPosts);

// Get the details of the user from an id:
router.route("/users/:id").get(userController.getDetails);

// Update either the showName or the password of the user with the userName :id
router.route("/users/:id").patch(userController.updateDetails);

// Delete the details of the user from an id:
router.route("/users/:id").delete(userController.deleteUser);

// Get a list with the comments of the user with the id:
router.route("/users/:id/posts").get(postController.getUserPosts);

// Create a new post for the user with the id:
router.route("/users/:id/posts").post(postController.addUserPost);

// Update the post whose id is :pid, of the user whose id is :id :
router.route("/users/:id/posts/:pid").patch(postController.updateUserPost);

// Delete the post whose id is :pid, of the user whose id is :id :
router.route("/users/:id/posts/:pid").delete(postController.deletePost);

// Get a list of the the friends of the user whose id is :id :
router.route("/users/:id/friends").get(userController.getUserFriends);

// Add a new friend request to the user whose id is :id :
router.route("/users/:id/friends").post(userController.addFriendRequest);

// Accepts a friend request whose id is :fid in the user whose id is :id :
router.route("/users/:id/friends/:fid").patch(userController.acceptFriendRequest);

// Deletes a friend request whose id is :fid in the user whose id is :id, or a friend with this parameters:
router.route("/users/:id/friends/:fid").delete(userController.deleteFriend);

// Get all the friend requests of the logged in user: 
router.route("/users/friends/requests").get(userController.getFriendRequests);

// Handle toggling likes after pressing the like button on a post- adding or removing a like.
router.route("/users/like/:pid").post(userController.toggleLikedPost);

// Adds a comment to the post whose _id is :id
router.route("/posts/:pid/comment").post(postController.addComment);

// Update a comment whose _id is :cid, on the post whose _id is :pid
router.route("/posts/:pid/comment/:cid").patch(postController.updateComment);

// Delete a comment whose _id is :cid, on the post whose _id is :pid
router.route("/posts/:pid/comment/:cid").delete(postController.deleteComment);

module.exports = router;