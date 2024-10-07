const express = require("express");

const bodyParser = require("body-parser");

const cors = require("cors");

const mongoose = require("mongoose");

const api = require("./routes/api");

require('custom-env').env(process.env.NODE_ENV, './config');

mongoose.connect("mongodb://localhost:27017");

var app = express();

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // This way we can upload large photos to the server
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", api);

const tcpClient = require("./services/tcpClient");

app.listen(80);

console.log("The server is now open at port 80.");