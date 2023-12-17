const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "abel", password: "123" }];

const isValid = (username) => {
  const checkUsername = users.filter((user) => user.username === username);
  if (checkUsername.length > 0) {
    return false;
  }
  return true;
};

const authenticatedUser = (username, password) => {
  if (username && password) {
    const crendentialChecker = users.filter(
      (user) => user.username === username && user.password === password
    );
    if (crendentialChecker.length > 0) {
      return true;
    } else {
      return false;
    }
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (authenticatedUser(username, password)) {
    let token = jwt.sign({ data: username }, "secret#access", {
      expiresIn: 60 * 60,
    });
    req.session.authorization = {
      accessToken: token,
    };
    res.send("Successfully logged in ");
  } else {
    res.send("Username or Password is Incorrect");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.query.review;
  let isbn = req.params.isbn;
  // get username from session data
  let username = req.user.data;
  if (books[isbn]["reviews"][username]) {
    // review is updated
    books[isbn]["reviews"][username] = review;
    res.send("Review is updated");
  } else {
    // review is added
    books[isbn]["reviews"][username] = review;
    res.send("Review is added");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  // get username from session data
  let username = req.user.data;
  // lets check if the user give a review for the book
  if(books[isbn]['reviews'][username]){
    // review found and deleted
    delete books[isbn]["reviews"][username];
    res.send('your review is deleted') 
  }
  else{
    // send message to the user that review is not found
    res.send('Review is not found to be delete')
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
