//THIS IS CHECKERS YO NOT CHESS NOT EVEN

let redPiece = "U+1F534"
let whitePiece = "U+26AA"
let pieceSelected = false
let zeroTurn = true
let validMovesArray = []


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
    
    //if moving to empty space AND valid move
    if (newPosition.innerText === `` && validMovesArray.includes(newPosition.id)){
        //populates new position with moved piece
        newPosition.innerText = pieceToMove.piece
        //throw out old position, remove highlight
        oldPosition.innerText = ''
        oldPosition.dataset.purpose = ""
//else if 
        //change turn, reset piece selection
        pieceSelected = false
        zeroTurn = !zeroTurn


        validMovesArray.forEach(function(move){
            let moveDiv = document.getElementById(`${move}`)
            moveDiv.dataset.purpose = ""
        })        
    }
}

function turn(e, faction){
    if (pieceSelected === false){
        firstMove(e, faction)
    }
    else {
        movePiece(pieceToMove, e.target, faction)
    }
}

function firstMove(e, faction){
    if((e.target.innerText === '0' && faction === 'black') || (e.target.innerText === '1' && faction === 'white')){  
        e.target.dataset.purpose = "target" 

        pieceToMove.piece = e.target.innerText
        pieceToMove.position = e.target.id

        validMovesArray = []
        validMoves(pieceToMove.position, faction)
        
        if (validMovesArray.length > 0) {
            validMovesArray.forEach(function(move){
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

function validMoves(oldPosition, faction) {
    let potentialPositions = checkMoves(oldPosition, faction)
    // for(let i = 0; i < potentialPositions.length; i++){

    // }
     //returns an array of possible moves

    potentialPositions.forEach(function(move){
        let moveDiv = document.getElementById(move)
        if (moveDiv.innerText === ""){
            validMovesArray.push(move)
        }
        //else if moveDiv.innerText != faction
        //checkAttacks()
    })
}

function checkBelowRow(number){
   return parseInt(number) + 1
}

function checkAboveRow(number){
    return parseInt(number) - 1
}

function checkMoves(oldPosition, faction){
    let splitPosition = oldPosition.split("")
    let letter = splitPosition[0]
    let number = splitPosition[1]
    //let currentPosition = oldPosition

    let potentialPositions = []
    if (faction === "black"){
        if (number > 0 && number < 8) {
        //increments and decrements letter of new position ("B" becomes "C" and "A")
            let columnA = String.fromCharCode(letter.charCodeAt(0) + 1)
            let columnB = String.fromCharCode(letter.charCodeAt(0) - 1)

            //below two lines concatenate new columns with above row
            if (validColumn(columnA)) {
                potentialPositions.push(columnA.concat(checkBelowRow(number)).toString())
            } 
            if (validColumn(columnB)) {
            potentialPositions.push(columnB.concat(checkBelowRow(number)).toString())
            }
        }
    }
    else {
        if (number > 1 && number < 9) {
            //increments and decrements letter of new position ("B" becomes "C" and "A")
            let columnA = String.fromCharCode(letter.charCodeAt(0) + 1)
            let columnB = String.fromCharCode(letter.charCodeAt(0) - 1)

            //below two lines concatenate new columns with below row
            if (validColumn(columnA)){
                potentialPositions.push(columnA.concat(checkAboveRow(number)).toString())
            } 
            if (validColumn(columnB)) {
                potentialPositions.push(columnB.concat(checkAboveRow(number)).toString())
            }
        }
    }
    console.log(potentialPositions)
    return potentialPositions
}

function checkAttacks(currentPosition, faction){


}

function validColumn(column){
    if (column === "A" || column === "B" || column === "C" ||
    column === "D" || column === "E" || column === "F" ||
    column === "G" || column === "H") {
        return true
    }
    else{
        return false
    } 
}