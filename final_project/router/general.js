const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      res.send(`${username} is successfully registered`);
    } else {
      res.send("username is already taken");
    }
  } else {
    res.send("username or password is missing");
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(300).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.status(300).send(JSON.stringify(books[isbn], null, 4));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  for (let book in books) {
    if (books[book]["author"] === author) {
      res.send(JSON.stringify(books[book], null, 4));
    }
  }
  res.send("Books is not found");
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  for (let book in books) {
    if (books[book]["title"] === title) {
      res.send(JSON.stringify(books[book], null, 4));
    }
  }
  res.send("Books is not found");
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const review = books[isbn]["reviews"];
  res.status(300).send(JSON.stringify(review, null, 4));
});

// to get all the book available in the shop using promise or async/await
// Task 10
public_users.get("/get-all-book", function (req, res) {
  let getListOfBooks = new Promise((resolve, reject) => {
    setTimeout(() => {
      if(books){
      resolve(books);
      }
      else{
        reject('No Book is available in the store')
      }
    }, 5000);
  });
  getListOfBooks.then((result) => {
    res.send(JSON.stringify(result, null, 4));
  }).catch(error => res.send(error));
});

// Get book details based on ISBN using promise or async/await
// Task 11
public_users.get("/get-by-isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let getBookByIsbn = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("book is not found");
      }
    }, 5000);
  });
  getBookByIsbn
    .then((result) => res.send(JSON.stringify(result, null, 4)))
    .catch((error) => res.send(error));
});

// Get book details based on Author using promise or async/await
// Task 12
public_users.get("/get-by-author/:author", function (req, res) {
  const author = req.params.author;
  let getBookByAuthor = new Promise((resolve, reject) => {
    setTimeout(() => {
      for (let book in books) {
        if (books[book]["author"] === author) {
          resolve(books[book]);
        }
      }
      reject("book is not found");
    }, 5000);
  });
  getBookByAuthor
    .then((result) => res.send(JSON.stringify(result, null, 4)))
    .catch((error) => res.send(error));
});

// Get book details based on title using promise or async/await
// Task 13
public_users.get("/get-by-title/:title", function (req, res) {
  const title = req.params.title;
  let getBookByTitle = new Promise((resolve, reject) => {
    setTimeout(() => {
      for (let book in books) {
        if (books[book]["title"] === title) {
          resolve(books[book]);
        }
      }
      reject("book is not found");
    }, 5000);
  });
  getBookByTitle
    .then((result) => res.send(JSON.stringify(result, null, 4)))
    .catch((error) => res.send(error));
});

module.exports.general = public_users;
