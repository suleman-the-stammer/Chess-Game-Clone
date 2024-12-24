const express = require("express");
const http = require("http");
const socket = require("socket.io");
const path = require("path");
const {Chess} = require("chess.js")

const app = express();

const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let player = {};
let currentPlayer = "W";

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname , "Public")));

app.get('/' , function(req, res){
    res.render("index" , {title : "Chess Game "});
})

io.on("connection" , function(uniqueSocket){
    console.log("Connected ha bhai")
    uniqueSocket.on("Choran" , function(){
        console.log("Choran is Received")
    })
})

server.listen(3000, function(){
    console.log("Server is Running on Port 3000")
})
