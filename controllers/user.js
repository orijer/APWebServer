const userService = require("../services/user");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
    try {
        res.json(await userService.createUser(req.body.userName, req.body.password, req.body.showName, req.body.picture));
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const getDetails = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
        jwt.verify(token, 'your_secret_key'); //Decode the token to make sure it is valid before handling the request.

        const result = await userService.getDetails(req.params.id);
        if (result == []) {
            return res.status(404).json({ message: ("Attempted to get the details of a userName which doesn't belong to a user: " + req.params.id) });
        }

        res.json(result);
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

const updateDetails = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key'); //Decode the token to make sure it is valid before handling the request.
        const currentUserName = decodedToken.userName;
        if (currentUserName !== req.params.id)
            return res.status(403).json({ message: "Only the user can update their details"});

        const { newShowName, newPassword } = req.body;
        if (newShowName) {
            res.json({ result: await userService.updateShowName(req.params.id, newShowName) });
        } else if (newPassword) {
            res.json({ result: await userService.updatePassword(req.params.id, newPassword) });
        } else {
            res.status(400).json({ message: "Request body must contain either newShowName or newPassword" });
        }
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        } else {
            console.log(error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

const deleteUser = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        jwt.verify(token, 'your_secret_key'); //Decode the token to make sure it is valid before handling the request.
        const result = await userService.deleteUser(req.params.id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No user with the following userName was found: " + req.params.id })
        }

        res.json(result);
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

const getUserFriends = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        jwt.verify(token, 'your_secret_key'); //Decode the token to make sure it is valid before handling the request.
        const result = await userService.getUserFriends(req.params.id);
        res.json(result);
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.message === 'User not found') {
            return res.status(404).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const addFriendRequest = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key'); //Decode the token to make sure it is valid before handling the request.
        const currentUserName = decodedToken.userName;
        const result = await userService.addFriendRequest(req.params.id, currentUserName); //currently hard coded. once we have something usable in the react, we can change it to use the jwt
        res.json(result);
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.message === 'User not found') {
            return res.status(404).json({ error: error.message });
        } else if (error.message === 'The users are already friends') {
            return res.status(403).json({ error: error.message });
        } else if (error.message === 'The target has already receieved the friend request') {
            return res.status(409).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const acceptFriendRequest = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key'); //Decode the token to make sure it is valid before handling the request.
        const currentUserName = decodedToken.userName;
        if (currentUserName !== req.params.id) {
            return res.status(403).json({ message: "Only the user whose userName is: " + req.params.id + " can accept their friend requests" })
        }

        await userService.acceptFriendRequest(req.params.id, req.params.fid);
        return res.status(200).send(); //turns out express doesnt send back the result if it has no json with it, or is told explicitly to send...
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.message === 'No appropriate user request found') {
            return res.status(404).json({ error: error.message });
        } else {
            console.log(error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const deleteFriend = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key'); //Decode the token to make sure it is valid before handling the request.
        const currentUserName = decodedToken.userName;
        if (currentUserName !== req.params.id) {
            return res.status(403).json({ message: "Only the user whose userName is: " + req.params.id + " can delete their friend requests" })
        }

        await userService.deleteFriend(req.params.id, req.params.fid);
        return res.status(200).send();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.message === 'No appropriate friend or friend request found') {
            return res.status(404).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const getFriendRequests = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key'); //Decode the token to make sure it is valid before handling the request.
        const currentUserName = decodedToken.userName;

        return res.json(await userService.getFriendRequests(currentUserName));
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.message === 'User not found') {
            return res.status(404).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const toggleLikedPost = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key'); //Decode the token to make sure it is valid before handling the request.
        const currentUserName = decodedToken.userName;

        const likedPosts = await userService.toggleLikedPost(req.params.pid, currentUserName);
        return res.status(200).json({ likedPosts });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.message === 'No post found') {
            return res.status(404).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = { createUser, getDetails, updateDetails, deleteUser, getUserFriends, addFriendRequest, acceptFriendRequest, getFriendRequests, deleteFriend, toggleLikedPost };