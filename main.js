var table;
var input;
var messages;
var selectedSquare = "";

window.onload = function() {
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
    messages = document.getElementById("messages");
    input.addEventListener("keypress", function(e) {
        if (e.code == "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.innerHTML != "") {
                var html = input.innerHTML;
                message(html, "12:34", false);
                input.innerHTML = "";
                window.setTimeout(function() {
                    message(["Hey that's pretty cool", "nice", "whoah dude", "cooool", "wait what"][Math.floor(Math.random() * 5)], "12:34", true);
                }, Math.floor(Math.random() * 5000));
            }
        }            
    });

    update();
}

function message(html, time, received) {
    var message = document.createElement("div");
    message.className = "message " + (received ? "received" : "sent");
    message.innerHTML = html;
    var timeElement = document.createElement("div");
    timeElement.className = "time";
    timeElement.innerHTML = time;
    message.appendChild(timeElement);
    messages.appendChild(message);
    messages.scrollTo(0, messages.scrollHeight);
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
}

function makeMove(from, to) {
    // getSquare(to).innerHTML = getSquare(from).innerHTML;
    // getSquare(from).innerHTML = "";

    var request = new XMLHttpRequest();
    request.open("POST", "http://192.168.1.107:3000/moves?gameId=0", false);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({
        "start": from,
        "end": to
    }));

    update();
}

function getBoard() {
    var request = new XMLHttpRequest();
    request.open("GET", "http://192.168.1.107:3000/games/0", false);
    request.send();
    var response = JSON.parse(request.responseText);

    var fen = response.fen;
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