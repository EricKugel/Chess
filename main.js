var table;

window.onload = function() {
    table = document.getElementById("table");
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for (var row = 0; row < 8; row++) {
        var rowElement = document.createElement("tr");
        for (var col = 0; col < 8; col++) {
            var colElement = document.createElement("td");
            colElement.style.backgroundColor = (row + col) % 2 == 1 ? "#7d945d" : "#eeeed5"; 
            rowElement.appendChild(colElement);
        }
        tbody.appendChild(rowElement);
    }

    gameLoop();
}

function gameLoop() {
    var board = getBoard();
    for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 8; col++) {
            var piece = board[row][col];
            if (piece != "") {
                var cell = table.children[0].children[row].children[col];
                cell.innerHTML = "<img src = \"" + "lib/" + piece + ".png\"/>";
            }
        }
    }
}

function getBoard() {
    var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
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