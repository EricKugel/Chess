var table;

window.onload = function() {
    table = document.getElementById("table");
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for (var row = 0; row < 8; row++) {
        var rowElement = document.createElement("tr");
        for (var col = 0; col < 8; col++) {
            var colElement = document.createElement("td");
            colElement.innerText = row + ", " + col;
            colElement.style.backgroundColor = (row + col) % 2 == 1 ? "#000000" : "#FFFFFF"; 
            rowElement.appendChild(colElement);
        }
        tbody.appendChild(rowElement);
    }
}