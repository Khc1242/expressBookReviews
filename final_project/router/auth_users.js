const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js"); // Import books from booksdb.js
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username); // Check if username exists
};

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password); // Check username and password
};

// Register a new user
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    users.push({ username, password });
    res.status(201).json({ message: 'User registered successfully' });
});

// Login a user
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });
        req.session.user = { username }; // Save user info in session
        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const { username } = req.session.user || {}; // Extract username from session

    if (!username) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' });
    }

    if (!review) {
        return res.status(400).json({ message: 'Review is required' });
    }

    // Add or update review for the specified book
    books[isbn].reviews[username] = review;
    res.status(200).json({ message: 'Review added/updated successfully' });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { username } = req.session.user || {}; // Extract username from session

    if (!username) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the review exists for the user
    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username]; // Delete the review
        res.status(200).json({ message: 'Review deleted successfully' });
    } else {
        res.status(404).json({ message: 'Review not found for this user' });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
