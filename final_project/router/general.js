const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    // return res.status(300).json({ message: "Yet to be implemented" });
    const { username, password } = req.body; // Extract username and password from request body

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if username already exists
    if (isValid(username)) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    // Register the new user
    users.push({ username, password }); // Store user with username and password
    res.status(201).json({ message: 'User registered successfully' });
});

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//     //Write your code here
//     //return res.status(300).json({message: "Yet to be implemented"});
//     res.send(JSON.stringify(books, null, 2));
// });
public_users.get('/', async function (req, res) {
    try {
        // Simulate an async operation
        const getBooks = () => new Promise((resolve, reject) => {
            resolve(books); // Returning the books from booksdb.js
        });

        const bookList = await getBooks();
        res.send(JSON.stringify(bookList, null, 2));
    } catch (error) {
        res.status(500).send('Error fetching book list');
    }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//     //Write your code here
//     // return res.status(300).json({ message: "Yet to be implemented" });
//     const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters

//     if (books[isbn]) {
//         // If the book exists, return the details
//         res.send(JSON.stringify(books[isbn], null, 2));
//     } else {
//         // If the book is not found, return a 404 status
//         res.status(404).send('Book not found');
//     }
// });
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject('Book not found');
        }
    });

    getBookByISBN
        .then(book => res.send(JSON.stringify(book, null, 2)))
        .catch(error => res.status(404).send(error));
});


// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     //Write your code here
//     // return res.status(300).json({ message: "Yet to be implemented" });
//     const authorName = req.params.author;  // Get author name from the request parameters
//     const booksByAuthor = [];

//     // Iterate through the books object to find books by the author
//     for (let isbn in books) {
//         if (books[isbn].author.toLowerCase() === authorName.toLowerCase()) {
//             booksByAuthor.push(books[isbn]);  // Add matching books to the array
//         }
//     }

//     if (booksByAuthor.length > 0) {
//         res.send(JSON.stringify(booksByAuthor, null, 2));  // Send back the matching books
//     } else {
//         res.status(404).send('No books found by this author');
//     }
// });
public_users.get('/author/:author', async function (req, res) {
    const authorName = req.params.author.toLowerCase();
    try {
        const getBooksByAuthor = () => new Promise((resolve, reject) => {
            const booksByAuthor = [];
            for (let isbn in books) {
                if (books[isbn].author.toLowerCase() === authorName) {
                    booksByAuthor.push(books[isbn]);
                }
            }
            resolve(booksByAuthor);
        });

        const booksByAuthor = await getBooksByAuthor();

        if (booksByAuthor.length > 0) {
            res.send(JSON.stringify(booksByAuthor, null, 2));
        } else {
            res.status(404).send('No books found by this author');
        }
    } catch (error) {
        res.status(500).send('Error fetching books by author');
    }
});


// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     //Write your code here
//     // return res.status(300).json({ message: "Yet to be implemented" });
//     const titleName = req.params.title.toLowerCase();  // Get the title from the request parameters and make it case-insensitive
//     const booksByTitle = [];

//     // Iterate through the books object to find the book by title
//     for (let isbn in books) {
//         if (books[isbn].title.toLowerCase() === titleName) {
//             booksByTitle.push(books[isbn]);  // Add matching book to the array
//         }
//     }

//     if (booksByTitle.length > 0) {
//         res.send(JSON.stringify(booksByTitle, null, 2));  // Send back the matching book details
//     } else {
//         res.status(404).send('No books found with this title');
//     }
// });
public_users.get('/title/:title', async function (req, res) {
    const titleName = req.params.title.toLowerCase();
    try {
        const getBooksByTitle = () => new Promise((resolve, reject) => {
            const booksByTitle = [];
            for (let isbn in books) {
                if (books[isbn].title.toLowerCase() === titleName) {
                    booksByTitle.push(books[isbn]);
                }
            }
            resolve(booksByTitle);
        });

        const booksByTitle = await getBooksByTitle();

        if (booksByTitle.length > 0) {
            res.send(JSON.stringify(booksByTitle, null, 2));
        } else {
            res.status(404).send('No books found with this title');
        }
    } catch (error) {
        res.status(500).send('Error fetching books by title');
    }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    // return res.status(300).json({ message: "Yet to be implemented" });
    const isbn = req.params.isbn;  // Get the ISBN from the request parameters

    if (books[isbn]) {
        // If the book exists, return the reviews
        res.send(JSON.stringify(books[isbn].reviews, null, 2));
    } else {
        res.status(404).send('Book not found');
    }
});

module.exports.general = public_users;