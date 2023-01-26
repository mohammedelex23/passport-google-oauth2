require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const passport = require("passport");
const cors = require("cors");
// const fs = require("fs");
// const https = require("https");
const http = require("http");

// const privateKey = fs.readFileSync("server.key", "utf8");
// const certificate = fs.readFileSync("server.cer", "utf8");

// const credentials = { key: privateKey, cert: certificate };
// const httpsServer = https.createServer(credentials, app);

const httpServer = http.createServer(app);

app.use(
  cors({
    origin: ["www.nicoin.me", "https://www.example.com"], // you can add other origins too
    methods: ["GET"], // you can add other methods too
  })
);
require("./passport");

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/api/v1/auth/google",
  function (req, res, next) {
    let redirectUrl = req.query.redirectUrl;

    if (!redirectUrl) {
      return res.status(400).json({
        error: true,
        message:
          "you should send redirect uri as a quey paramater: https:www.example.com?redirectUrl=www.example.com",
      });
    }
    next();
  },
  passport.authenticate("google", {
    failureRedirect: "/failed",
  }),
  function (req, res) {
    res.redirect(req.redirectUrl);
  }
);

// httpsServer.listen(8000, function () {
//   console.log("https server is running on port: " + 8000);
// });

httpServer.listen(PORT, function () {
  console.log("http server is running on port: " + PORT);
});
