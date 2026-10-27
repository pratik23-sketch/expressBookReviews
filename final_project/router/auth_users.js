const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(
        (user) => user.username === username && user.password === password
    );
};

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({ username: username }, "access", {
            expiresIn: "1h"
        });

        req.session.authorization = {
            accessToken: accessToken,
            username: username
        };

        return res.status(200).json({
            message: "User successfully logged in",
            token: accessToken
        });
    }

    return res.status(401).json({
        message: "Invalid username or password"
    });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    if (!req.session.authorization) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (!review) {
        return res.status(400).json({
            message: "Review is required"
        });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review successfully added"
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
