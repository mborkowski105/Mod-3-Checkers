//THIS IS CHECKERS YO NOT CHESS NOT EVEN

let redPiece = "U+1F534"
let whitePiece = "U+26AA"
let pieceSelected = false
let zeroTurn = true
let validMovesArray = []
let validAttackMoves = []


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
    if (validAttackMoves.length > 0){

        let validAttackPositions = validAttackMoves.map((move)=>move.attackLocation)
        let opponentPositions = validAttackMoves.map((move)=>move.opponentPosition)
        if (newPosition.innerText === `` && validAttackPositions.includes(newPosition.id)){
            //populates new position with moved piece
            newPosition.innerText = pieceToMove.piece
            //throw out old position, remove highlight
            oldPosition.innerText = ''
            oldPosition.dataset.purpose = ""
            validAttackPositions.forEach((position)=>{
              let positionDiv = document.getElementById(`${position}`)
              if (positionDiv.innerText){
                 let opponentPositionDiv =  document.getElementById(`${opponentPositions[validAttackPositions.indexOf(position)]}`)
                  opponentPositionDiv.innerText = ''
              }
            })
            let highlights = document.querySelectorAll('[data-purpose]')
            hightlightsArray = Array.from(highlights)
            hightlightsArray.forEach((highlight)=>{
              highlight.dataset.purpose = ''
            })
            validAttackMoves = []
            validMovesArray = []
            pieceSelected = false
            zeroTurn = !zeroTurn
       }
    } else if (newPosition.innerText === `` && validMovesArray.includes(newPosition.id)){
        //populates new position with moved piece
        newPosition.innerText = pieceToMove.piece
        //throw out old position, remove highlight
        oldPosition.innerText = ''
        oldPosition.dataset.purpose = ""
         //change turn, reset piece selection
         pieceSelected = false
         zeroTurn = !zeroTurn

    }

    validMovesArray.forEach(function(move){
        let moveDiv = document.getElementById(`${move}`)
        moveDiv.dataset.purpose = ""
    })        
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
console.log("pop", potentialPositions)
    potentialPositions.forEach(function(move){
        let moveDiv = document.getElementById(move)
        console.log(validMovesArray)
        if (moveDiv.innerText === ""){
            validMovesArray.push(move)
        }
        if(faction === "black"){
            if (moveDiv.innerText === "1"){
                let opponentPosition = move
                let direction = determineBlackDirection(oldPosition, move)
                blackAttack(move, direction)
            }
        } else {
            if (moveDiv.innerText === "0"){
                let opponentPosition = move
            }
        }
        if(faction === "white"){
            if (moveDiv.innerText === "0"){
                let opponentPosition = move
                let direction = determineWhiteDirection(oldPosition, move)
                whiteAttack(move, direction)
            }
        } else {
            if (moveDiv.innerText === "1"){
                let opponentPosition = move
            }
        }
    })
}

function checkBelowRow(number){
   return parseInt(number) - 1
}

function checkAboveRow(number){
    return parseInt(number) + 1
}

function checkMoves(oldPosition, faction){
    let splitPosition = oldPosition.split("")
    let letter = splitPosition[0]
    let number = splitPosition[1]
    //let currentPosition = oldPosition

    let potentialPositions = []
    if (faction === "black"){  //black goes up; black is 0
        if (number > 0 && number < 8) {
        //increments and decrements letter of new position ("B" becomes "C" and "A")
            let columnA = String.fromCharCode(letter.charCodeAt(0) + 1)
            let columnB = String.fromCharCode(letter.charCodeAt(0) - 1)

            //below two lines concatenate new columns with above row
            if (validColumn(columnA)) {
                potentialPositions.push(columnA.concat(checkAboveRow(number)).toString())
            } 
            if (validColumn(columnB)) {
            potentialPositions.push(columnB.concat(checkAboveRow(number)).toString())
            }
        }
    }
    else {
        if (number > 1 && number < 9) { //white goes down; white is 1
            //increments and decrements letter of new position ("B" becomes "C" and "A")
            let columnA = String.fromCharCode(letter.charCodeAt(0) + 1)
            let columnB = String.fromCharCode(letter.charCodeAt(0) - 1)

            //below two lines concatenate new columns with below row
            if (validColumn(columnA)){
                potentialPositions.push(columnA.concat(checkBelowRow(number)).toString())
            } 
            if (validColumn(columnB)) {
                potentialPositions.push(columnB.concat(checkBelowRow(number)).toString())
            }
        }
    }

    return potentialPositions
}

function whiteAttack(opponentPosition, direction){
   
    let attackLocation = findWhiteAttackLocation(opponentPosition, direction)
    let attackLocationDiv = document.getElementById(`${attackLocation}`)

    let attack = {attackLocation: attackLocation,
                   opponentPosition: opponentPosition, 
                   direction: direction}
    validMovesArray.push(attack.attackLocation)
    validAttackMoves.push(attack)

}

function blackAttack(opponentPosition, direction){
  
    let attackLocation = findBlackAttackLocation(opponentPosition, direction)
    let attackLocationDiv = document.getElementById(`${attackLocation}`)

    let attack = {attackLocation: attackLocation,
                   opponentPosition: opponentPosition,
                   direction:direction}
    validMovesArray.push(attack.attackLocation)
    validAttackMoves.push(attack)



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

function determineBlackDirection(startingPosition, finishedPosition){
    let startingColumn = startingPosition.split("")[0]
    let finishedColumn = finishedPosition.split("")[0]
    String.fromCharCode(startingColumn.charCodeAt(0) + 1)
    String.fromCharCode(finishedColumn.charCodeAt(0) + 1)
    if (startingColumn < finishedColumn){
        return false //right
    } else {
        return true // left
    }
}

function determineWhiteDirection(startingPosition, finishedPosition){
    let startingColumn = startingPosition.split("")[0]
    let finishedColumn = finishedPosition.split("")[0]
    // String.fromCharCode(startingColumn.charCodeAt(0) + 1)
    // String.fromCharCode(finishedColumn.charCodeAt(0) + 1)
    if (startingColumn < finishedColumn){
        return true // left 
    } else {
        return false // right 
    }
}

function findBlackAttackLocation(opponentPosition, direction){
    if (direction){
        let opponentColumn = opponentPosition.split("")[0]
        let newColumn = String.fromCharCode(opponentColumn.charCodeAt(0) - 1)
        let opponentRow= opponentPosition.split("")[1]
        let newRow = checkAboveRow(opponentRow)
        return newColumn.concat(newRow).toString()
        //rows are subtracted
        //columns subtracted
    } else {
        let opponentColumn = opponentPosition.split("")[0]
        let newColumn = String.fromCharCode(opponentColumn.charCodeAt(0) + 1)
        let opponentRow= opponentPosition.split("")[1]
        let newRow = checkAboveRow(opponentRow)
        return newColumn.concat(newRow).toString()
        //rows are subtracted
        //columns are added 
    }

}
function findWhiteAttackLocation(opponentPosition, direction){
    if (direction){
        //rows are added
        //columns added
    } else {
        //rows are added
        //columns are subtracted 
    }

}



