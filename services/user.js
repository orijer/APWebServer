const User = require("../models/user");
const { Post } = require("../models/post");

const createUser = async (userName, password, showName, picture) => {
    const containsUser = await User.findOne({ userName });
    if (containsUser) {
        throw new Error('userName is already taken')
    }

    const user = new User({ userName, password, showName, picture });

    return await user.save();
}

const getDetails = async (userName) => {
    return await User.find({ userName });
}

const updateShowName = async (userName, newShowName) => {
    const user = await User.findOne( {userName }); // The jwt is valid so this is good
    user.showName = newShowName;
    await user.save();

    return newShowName;
}

const updatePassword = async (userName, newPassword) => {
    const user = await User.findOne({ userName }); // The jwt is valid so this is good
    user.password = newPassword;
    await user.save();

    return newPassword
}

const deleteUser = async (userName) => {
    return await User.deleteOne({ userName });
}

const getUserFriends = async (userName) => {
    const user = await User.findOne({ userName });
    if (!user) {
        throw new Error('User not found');
    }

    return user.friends;
}

const addFriendRequest = async (targetUser, currentUser) => {
    const user = await User.findOne({ userName: targetUser });
    if (!user) {
        throw new Error('User not found');
    }

    if (user.friends.includes(currentUser)) {
        throw new Error('The users are already friends');
    }

    if (user.friendRequests.includes(currentUser)) {
        throw new Error('The target has already receieved the friend request');
    }

    user.friendRequests.push(currentUser);
    await user.save();
    return user.friendRequests;
}

const acceptFriendRequest = async (targetUser, sender) => {
    let target = await User.findOne({ userName: targetUser });
    let friendRequests = target.friendRequests;

    const index = friendRequests.indexOf(sender);
    if (index === -1) {
        throw new Error('No appropriate user request found');
    }

    friendRequests.splice(index, 1);
    target.friends.push(sender);
    await target.save();

    // Also add the target user as a friend of the sender:
    let senderUser = await User.findOne({ userName: sender });
    senderUser.friends.push(targetUser);
    await senderUser.save();
}

const deleteFriend = async (targetUser, otherUser) => {
    let target = await User.findOne({ userName: targetUser });
    let friendRequests = target.friendRequests;

    let index = friendRequests.indexOf(otherUser);
    if (index !== -1) {
        friendRequests.splice(index, 1);
        await target.save();
        return;
    }

    let friends = target.friends;

    index = friends.indexOf(otherUser);
    if (index !== -1) {
        friends.splice(index, 1);
        await target.save();

        // If we deleted a friend, also remove the targetUser from the otherUser's friend list:
        let user = await User.findOne({ userName: otherUser });
        index = user.friends.indexOf(targetUser);
        if (index === -1)
            return;

        user.friends.splice(index, 1);
        await user.save();

        return;
    }

    throw new Error('No appropriate friend or friend request found');
}

const getFriendRequests = async (userName) => {
    const user = await User.findOne({ userName });
    if (!user) {
        throw new Error("User not found");
    }

    return user.friendRequests;
}

const toggleLikedPost = async (postID, currentUserName) => {
    let post = await Post.findOne({ _id: postID });
    if (!post) {
        throw new Error("Post not found");
    }

    let user = await User.findOne({ userName: currentUserName }); //since we got here with a valid jwt, there is always a user with this userName
    const index = user.likedPosts.indexOf(postID);
    if (index === -1) { // The current user now liked a post:
        user.likedPosts.push(postID);
        await user.save();
        post.likes++;
        await post.save();
        return user.likedPosts;
    }

    // The current user now unliked a post:
    user.likedPosts.splice(index, 1);
    await user.save();
    post.likes--;
    await post.save();
    return user.likedPosts;
}

module.exports = { createUser, getDetails, updateShowName, updatePassword, deleteUser, getUserFriends, addFriendRequest, acceptFriendRequest, deleteFriend, getFriendRequests, toggleLikedPost };
