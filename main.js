var table;
var input;
var messagesElement;
var selectedSquare = "";
var userId;

function post(body) {
    var request = new XMLHttpRequest();
    request.open("POST", "http://localhost:3000/play", false);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(body));
    console.log(request.responseText);
    return JSON.parse(request.responseText);
}

function createGame() {
    userId = post({
        "command": "createGame",
        "password": "password"
    }).userId;
    document.body.removeChild(document.getElementById("console"));
    document.getElementById("wrapper").removeAttribute("hidden");
    update();
}

function joinGame() {
    userId = post({
        "command": "joinGame",
        "password": "password"
    }).userId;
    document.body.removeChild(document.getElementById("console"));
    document.getElementById("wrapper").removeAttribute("hidden");
    update();
}

window.onload = function() {
    document.getElementById("create").onclick = createGame;
    document.getElementById("join").onclick = joinGame;

    table = document.getElementById("table");
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for (var row = 0; row < 8; row++) {
        var rowElement = document.createElement("tr");
        for (var col = 0; col < 8; col++) {
            var colElement = document.createElement("td");
            colElement.style.backgroundColor = (row + col) % 2 == 1 ? "#7d945d" : "#eeeed5";
            colElement.id = "" + "abcdefgh".charAt(col) + (8 - row);
            colElement.onclick = function() {
                squareClicked(this.id);
            } 
            rowElement.appendChild(colElement);
        }
        tbody.appendChild(rowElement);
    }

    input = document.getElementById("input");
    messagesElement = document.getElementById("messages");
    input.addEventListener("keypress", function(e) {
        if (e.code == "Enter" && !e.shiftKey) {
            if (input.innerHTML != "") {
                var html = input.innerHTML;
            e.preventDefault();
                post({
                    "command": "message",
                    "userId": userId,
                    "message": html
                })
                input.innerHTML = "";
                update();
            }
        }            
    });

    window.setInterval(function() {
        update();
    }, 2000);
}

function squareClicked(square) {
    if (selectedSquare == "" && getSquare(square).children.length > 0) {
        selectedSquare = square;
        getSquare(square).className = "selected";
    } else {
        makeMove(selectedSquare, square);
        getSquare(selectedSquare).className = "";
        selectedSquare = "";
    }
}

function getSquare(square) {
    var row = 8 - parseInt("" + square.charAt(1));
    var col = "abcdefgh".indexOf("" + square.charAt(0));
    return table.children[0].children[row].children[col];
}

function update() {
    var board = getBoard();
    for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 8; col++) {
            table.children[0].children[row].children[col].innerHTML = "";
            var piece = board[row][col];
            if (piece != "") {
                var cell = table.children[0].children[row].children[col];
                cell.innerHTML = "<img src = \"" + "lib/" + piece + ".png\"/>";
            }
        }
    }

    var messages = post({
        "command": "getMessages",
        "userId": userId,
    }).messages;
    
    messagesElement.innerHTML = "";
    for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        var messageElement = document.createElement("div");
        messageElement.className = "message " + (message[1] == userId ? "sent" : "received");
        messageElement.innerHTML = message[0];
        var timeElement = document.createElement("div");
        timeElement.className = "time";
        timeElement.innerHTML = message[2];
        messageElement.appendChild(timeElement);
        messagesElement.appendChild(messageElement);
        messagesElement.scrollTo(0, messagesElement.scrollHeight);
    }
}

function makeMove(from, to) {
    post({
        "command": "move",
        "userId": userId,
        "start": from,
        "end": to
    });

    update();
}

function getBoard() {
    var fen = post({
        "command": "getBoard",
        "userId": userId
    }).fen;
    // var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    var board = [];

    var fenRows = fen.substring(0, fen.indexOf(" ")).split("/");
    for (var row = 0; row < fenRows.length; row++) {
        var fenRow = fenRows[row];
        var boardRow = [];    
        for (var letterIndex = 0; letterIndex < fenRow.length; letterIndex++) {
            var letter = "" + fenRow.charAt(letterIndex);
            if ("rnbqkp".includes(letter)) {
                boardRow.push(letter + "d");
            } else if ("rnbqkp".includes(letter.toLowerCase())) {
                boardRow.push(letter.toLowerCase() + "l")
            } else if ("12345678".includes(letter)) {
                for (var i = 0; i < parseInt(letter); i++) {
                    boardRow.push("");
                }
            }
        }
        board.push(boardRow);
    }

    return board;
}