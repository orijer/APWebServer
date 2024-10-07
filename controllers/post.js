const postService = require("../services/post");
const jwt = require("jsonwebtoken");

const getPosts = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
        const decodedToken = jwt.verify(token, 'your_secret_key');
        const userName = decodedToken.userName;

        const posts = await postService.getPosts(userName);
        res.json(posts);
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}

const getUserPosts = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key');
        const currentUserName = decodedToken.userName;
        // TODO: check that the user of currentUserName is a friend of the user with userName: req.params.id, or hey are equal.

        res.json(await postService.getUserPosts(req.params.id, currentUserName));

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.message === "User not found") {
            return res.status(404).json({ message: error.message });
        } else if (error.message === "Only friends can see each other posts") {
            return res.status(403).json({ message: error.message });
        } else {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

const addUserPost = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key');
        const currentUserName = decodedToken.userName;
        const userName = req.params.id;
        if (currentUserName !== userName) {
            return res.status(403).json({ message: "Only the user whose userName is: " + userName + " can add a post for their user" })
        }

        const { post_text, post_img } = req.body;

        let result;
        if (post_img) {
            result = await postService.addUserPost(userName, post_text, post_img);
        } else {
            result = await postService.addUserPost(userName, post_text);
        }

        res.json(result);
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.message === "The post text contains a blacklisted url") {
            return res.status(403).json({ error: "The post text contains a blacklisted url" });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const updateUserPost = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key');
        const currentUserName = decodedToken.userName;
        if (currentUserName !== req.params.id) {
            return res.status(403).json({ message: "Only the user whose userName is: " + req.params.id + " can update their post" })
        }

        const { post_text, post_img } = req.body;

        res.json(await postService.updateUserPost(req.params.id, req.params.pid, post_text, post_img));
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.message === 'Post not found') {
            return res.status(404).json({ message: error.message });
        } else if (error.message === "The new post text contains a blacklisted url") {
            return res.status(403).json({ error: "The new post text contains a blacklisted url" });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const deletePost = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key');
        const currentUserName = decodedToken.userName;
        if (currentUserName !== req.params.id) {
            return res.status(403).json({ message: "Only the user whose userName is: " + req.params.id + " can delete their post" })
        }

        res.json(await postService.deletePost(req.params.id, req.params.pid));
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.message === 'Post not found') {
            return res.status(404).json({ message: error.message });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const addComment = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key');
        const currentUserName = decodedToken.userName;

        res.json(await postService.addComment(req.params.pid, req.body.comment_text, currentUserName));
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.message === 'Post not found') {
            return res.status(403).json({ message: error.message });
        }else if (error.message === 'The new comment text contains a blacklisted url') {
            return res.status(404).json({ message: error.message });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const updateComment = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key');
        const currentUserName = decodedToken.userName;

        res.json(await postService.updateComment(req.params.pid, req.params.cid, req.body.comment_text, currentUserName));
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.message === 'Post not found') {
            return res.status(404).json({ message: error.message });
        } else if (error.message === 'Comment not found') {
            return res.status(404).json({ message: error.message });
        } else if (error.message === 'Only the author of the comment can edit it') {
            return res.status(403).json({ message: error.message });
        }else if (error.message === 'The new comment text contains a blacklisted url') {
            return res.status(404).json({ message:"The new comment text contains a blacklisted url" });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const deleteComment = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key');
        const currentUserName = decodedToken.userName;

        res.json(await postService.deleteComment(req.params.pid, req.params.cid, req.body.comment_text, currentUserName));
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.message === 'Post not found') {
            return res.status(404).json({ message: error.message });
        } else if (error.message === 'Comment not found') {
            return res.status(404).json({ message: error.message });
        } else if (error.message === 'Only the author of the comment can delete it') {
            return res.status(403).json({ message: error.message });
        } else {
            console.log(error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = { getPosts, getUserPosts, addUserPost, updateUserPost, deletePost, addComment, updateComment, deleteComment };