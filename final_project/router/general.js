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
    }else{
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
  res.status(300).send(JSON.stringify(books[isbn],null,4));
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
  res.status(300).send(JSON.stringify(review,null,4));
});

module.exports.general = public_users;
