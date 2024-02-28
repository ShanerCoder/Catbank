require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.HOST_PORT || 3001;
const userModel = require("./userModel");

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

app.get("/", (req, res) => {
  userModel
    .getAllAccounts()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.post("/login", (req, res) => {
  userModel
    .authenticateUser(req.body)
    .then((response) => {
      res.status(200).send({ message: "Login successful", user: response });
    })
    .catch((error) => {
      res.status(401).send({ message: "Invalid account number or password" });
    });
});

app.post("/register", (req, res) => {
  userModel
    .registerUser(req.body)
    .then((response) => {
      res
        .status(200)
        .send({ message: "Registration successful", user: response });
    })
    .catch((error) => {
      res.status(401).send({ message: "Registration failed" });
    });
});

app.put("/send", (req, res) => {
  userModel
    .sendSilveuroToUser(req.body)
    .then((response) => {
      res
        .status(200)
        .send({ message: "Silveuros sent successfully", user: response });
    })
    .catch((error) => {
      res
        .status(401)
        .send({ message: "Failed to send Silveuro, try again later" });
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
