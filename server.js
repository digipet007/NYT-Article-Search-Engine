require("dotenv").config();
var express = require("express");
var app = express();
var path = require("path");
var router = express.Router();

var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
app.use(express.static(__dirname + "/public"));

router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

router.get("*", function(req, res) {
  res.sendFile(path.join(__dirname + "/404.HTML"));
});

app.use("/", router);

// Starting the server------------------------------------/
app.listen(process.env.port || PORT, function() {
  console.log(
    "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
    PORT,
    PORT
  );
});

module.exports = app;
