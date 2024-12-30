
const express = require("express");
const http = require("http");
const socket = require("socket.io");
const path = require("path");
const {Chess} = require("chess.js")

const app = express();

const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = "w";

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");

app.get('/' , function(req, res){
    res.render("index" , {title : "Chess Game "});
})

io.on("connection" , function(uniqueSocket){
    console.log("Connected ha bhai");
    
  
    if (!players.white) {
        players.white = uniqueSocket.id;
        uniqueSocket.emit("playerRole" , "w");
    } else if (!players.black) {
        players.black = uniqueSocket.id;
        uniqueSocket.emit("playerRole" , "b");
    }  else{
        uniqueSocket.emit("spectatorRole");
    }
    uniqueSocket.on("disconnect" , function(){
    if (uniqueSocket.id === players.white ) {
        delete players.white;
    }  else if (uniqueSocket.id === players.white ) {
        delete players.white;
    }
    })

    uniqueSocket.on("move" , function(move){
        try {
            if(chess.turn()=== "w" && uniqueSocket.id !== players.white) return;
            if(chess.turn()=== "b" && uniqueSocket.id !== players.black) return;

            const result = chess.move(move);

            if (result) {
                currentPlayer = chess.turn();
                io.emit("move" , move);
                io.emit("boardState" , chess.fen())
            }else {
                console.log("Invalid Move : ", move);
                uniqueSocket.emit("invalidMove", move)
            }
            
        } catch (err) {
            console.log(err);
            uniqueSocket.emit("Invalid Move : ", move);
        }
    })
})

server.listen(3000, function(){
    console.log("Server is Running on Port 3000")
})
