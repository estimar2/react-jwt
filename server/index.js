const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const users = [
  {
    id: "1",
    username: "john",
    password: "John0000",
    isAdmin: true,
  },
  {
    id: "2",
    username: "jane",
    password: "Jane0908",
    isAdmin: false,
  },
];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  console.log(req.body, "req.body");

  const user = users.find(u => {
    return u.username === username && u.password === password;
  });

  if (user) {
    //Generate an access token
    const accessToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      "mySecretKey",
    );

    res.json({
      username: user.username,
      isAdmin: user.isAdmin,
      accessToken,
    });
  } else {
    res.status(400).json("Username or password incorrect!");
  }
});

app.listen(5000, () => console.log("✔ Server is Running"));
