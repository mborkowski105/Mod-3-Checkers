//THIS IS CHECKERS YO NOT CHESS NOT EVEN

let redPiece = "U+1F534"
let whitePiece = "U+26AA"
let pieceSelected = false
let zeroTurn = true
let possibleMovesArray = []

let checkerBoard = document.getElementsByClassName("checkerboard")[0]

let pieceToMove = {
    piece: '',
    position: ''      
}

checkerBoard.addEventListener("click", function(e){
    if (zeroTurn){
        turn(e, "black")
    }
    else{
        turn(e, "white")
    }
})
   
function movePiece(pieceToMove, newPosition){
    let oldPosition = document.getElementById(`${pieceToMove.position}`)
    
    if (newPosition.innerText === `` && possibleMovesArray.includes(newPosition.id)){
        newPosition.innerText = pieceToMove.piece
        oldPosition.innerText = ''
        oldPosition.dataset.purpose = ""

        pieceSelected = false
        zeroTurn = !zeroTurn

        possibleMovesArray.forEach(function(move){
            let moveDiv = document.getElementById(`${move}`)
            moveDiv.dataset.purpose = ""
        })        
    }
}

function turn(e, faction){
    if (pieceSelected === false){
        if (e.target.innerText && e.target.className === "black"){
            e.target.dataset.purpose = "target" 

            pieceToMove.piece = e.target.innerText
            pieceToMove.position = e.target.id

            possibleMovesArray = []
            possibleMoves(pieceToMove.position, faction)
           
            if (possibleMovesArray.length > 0) {
                possibleMovesArray.forEach(function(move){
                    let moveDiv = document.getElementById(`${move}`)
                    moveDiv.dataset.purpose = "possible"
                })
                pieceSelected = true 
            }
            else {
                alert("Fucking trash")
                alert("Fucking trash")
                alert("Try reading a rulebook???")
                e.target.dataset.purpose = "" 
            }
        }
    }
    else {
        movePiece(pieceToMove, e.target, faction)
    }
}

function possibleMoves(oldPosition, faction) {
    //split oldPosition up by letter and number
    let splitPosition = oldPosition.split("")
    let letter = splitPosition[0]
    let number = splitPosition[1]

    let potentialPositions = []

    //returns an array of possible moves

    if (faction === "black"){
        if (number > 0 && number < 8) {
        //increments and decrements letter of new position ("B" becomes "C" and "A")
            let columnA = String.fromCharCode(letter.charCodeAt(0) + 1)
            let columnB = String.fromCharCode(letter.charCodeAt(0) - 1)

            console.log(columnA)
            console.log(columnB)

            //below two lines concatenate new columns with above row
            if (columnA === "A" || columnA === "B" || columnA === "C" ||
                columnA === "D" || columnA === "E" || columnA === "F" ||
                columnA === "G" || columnA === "H") {
                potentialPositions.push(columnA.concat((parseInt(number) + 1).toString()))
                console.log(potentialPositions)
            } 
            if (columnB === "A" || columnB === "B" || columnB === "C" ||
            columnB === "D" || columnB === "E" || columnB === "F" ||
            columnB === "G" || columnB === "H") {
            potentialPositions.push(columnB.concat((parseInt(number) + 1).toString()))
            console.log(potentialPositions)
            }
        }
    }
    else {
        if (number > 1 && number < 9) {
            //increments and decrements letter of new position ("B" becomes "C" and "A")
            let columnA = String.fromCharCode(letter.charCodeAt(0) + 1)
            let columnB = String.fromCharCode(letter.charCodeAt(0) - 1)

            //below two lines concatenate new columns with below row
            if (columnA === "A" || columnA === "B" || columnA === "C" ||
                columnA === "D" || columnA === "E" || columnA === "F" ||
                columnA === "G" || columnA === "H") {
                potentialPositions.push(columnA.concat((parseInt(number) - 1).toString()))
                console.log(potentialPositions)
            } 
            if (columnB === "A" || columnB === "B" || columnB === "C" ||
            columnB === "D" || columnB === "E" || columnB === "F" ||
            columnB === "G" || columnB === "H") {
                potentialPositions.push(columnB.concat((parseInt(number) - 1).toString()))
                console.log(potentialPositions)
            }
        }
    }

    potentialPositions.forEach(function(move){
        let moveDiv = document.getElementById(move)
        if (faction === "black"){
            if (moveDiv.innerText === ""){
                possibleMovesArray.push(move)
            }
        }
        else {
            if (moveDiv.innerText === ""){
                possibleMovesArray.push(move)
            }
        }
    })
}
