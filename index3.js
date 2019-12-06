document.addEventListener("DOMContentLoaded", function(){
    //THIS IS CHECKERS YO NOT CHESS NOT EVEN

    let redPiece = "U+1F534"
    let whitePiece = "U+26AA"
    let pieceSelected = false
    let zeroTurn = true
    let validMovesArray = []
    let validAttackMoves = []
    let connection = false

    let checkerBoard = document.getElementsByClassName("checkerboard")[0]

    let pieceToMove = {
        piece: '',
        position: ''      
    }

    function turn(e, faction, isFirstTurn){
        if (pieceSelected === false){
            firstClick(e, faction, isFirstTurn)
        }
        else {
            movePiece(pieceToMove, e.target, faction)
        }
    }


    //start of turn, with initial click
    //will first call checkAllLegalMoves() for space clicked
        //which will initally check immediate surrounding spaces, then check for potential jumps if those spaces are occupied
    //if any legal moves can be made, will push them to validMovesArray, highlight all their divs, and set pieceSelected to true
    //else, will harrass you with alerts and remove your clicked space's target highlight
    function firstClick(e, faction, isFirstTurn){
        //if you clicked on your own piece
        if(((e.target.innerText === '0' || e.target.innerText === 'K') && faction === 'black') 
            || ((e.target.innerText === '1' || e.target.innerText === 'Q') && faction === 'white')){  
            e.target.dataset.purpose = "target" 

            pieceToMove.piece = e.target.innerText
            pieceToMove.position = e.target.id

            //is this necessary here? not sure
            validMovesArray = []

            //populates validMovesArray
            checkAllLegalMoves(e.target.id, faction, isFirstTurn)
            
            if (validMovesArray.length > 0) {
                validMovesArray.forEach(function(move){
                    let moveDiv = document.getElementById(`${move}`)
                    moveDiv.dataset.purpose = "possible"
                })
                pieceSelected = true 
            }
            else {
                movePiece(pieceToMove, e.target, faction)
            }
        }
    }
   
    function movePiece(pieceToMove, newPositionDiv, faction){
        let oldPositionDiv = document.getElementById(`${pieceToMove.position}`)
    
        //if any attack moves can be made
        //consider refactoring validAttackMoves to check earlier whether there is empty space 2 spaces away??
        if (validAttackMoves.length > 0){
            let validAttackPositions = validAttackMoves.map((move)=>move.attackLocation)
            let opponentPositions = validAttackMoves.map((move)=>move.opponentPosition)
            if (newPositionDiv.innerText === `` && validAttackPositions.includes(newPositionDiv.id)){
                //populates new position with moved piece
                if (kingMe(faction, newPositionDiv)){
                    if (faction === "black"){
                        newPositionDiv.innerText = "K"
                    }
                    else { //white
                        newPositionDiv.innerText = "Q"
                    }
                }
                else {
                    newPositionDiv.innerText = pieceToMove.piece
                }
                //throw out old position, remove highlight
                oldPositionDiv.innerText = ''
                validAttackPositions.forEach((position)=>{
                let positionDiv = document.getElementById(`${position}`)
                if (positionDiv.innerText){
                    let opponentPositionDiv =  document.getElementById(`${opponentPositions[validAttackPositions.indexOf(position)]}`)
                    opponentPositionDiv.innerText = ''
                }
                })

                //reset all highlights once piece is successfully moved
                oldPositionDiv.dataset.purpose = ""

                validMovesArray.forEach(function(move){
                    let moveDiv = document.getElementById(`${move}`)
                    moveDiv.dataset.purpose = ""
                })   

                validAttackMoves = []
                validMovesArray = []
                pieceSelected = false

                //if any more moves can be made, continue turn
                //else, end turn
                checkAllLegalMoves(newPositionDiv.id, faction, false)
                
                if (validAttackMoves.length > 0) {
                    connection = true
                }
                else {
                    zeroTurn = !zeroTurn
                    connection = false
                } 
        }
        } else if (newPositionDiv.innerText === `` && validMovesArray.includes(newPositionDiv.id)){ //regular move
            //populates new position with moved piece
            //populates new position with moved piece
            if (kingMe(faction, newPositionDiv)){
                if (faction === "black"){
                    newPositionDiv.innerText = "K"
                }
                else { //white
                    newPositionDiv.innerText = "Q"
                }
            }
            else {
                newPositionDiv.innerText = pieceToMove.piece
            }
            //throw out old position, remove highlight
            oldPositionDiv.innerText = ''
            //change turn, reset piece selection
            pieceSelected = false
            zeroTurn = !zeroTurn

            //reset all highlights once piece is successfully moved
            oldPositionDiv.dataset.purpose = ""

            validMovesArray.forEach(function(move){
                let moveDiv = document.getElementById(`${move}`)
                moveDiv.dataset.purpose = ""
            })    
        }    
    }

    function checkBelowRow(number){
    return parseInt(number) - 1
    }

    function checkAboveRow(number){
        return parseInt(number) + 1
    }

    //first, checks all potential initial moves, legal or not, given your currently clicked space and side
    //comes up with any of 2 immediate grid id's ("A7") that could possibly be moved to (one row up or down)
    //(new) then checks if those spaces are currently occupied (innerText==="")
    //now also takes in boolean to check if it's the first move in the turn
    //if new potential space (surrounding space from inital position) is unoccupied 
    //AND if it's the first move in the turn
        //pushes to validMovesArray
    //else, if occupied by the other team
        //calls another function to check if it's a potential jump
    function checkAllLegalMoves(oldPosition, faction, isFirstTurn){
        let oldPositionDiv = document.getElementById(oldPosition)
        let splitPosition = oldPosition.split("")
        let letter = splitPosition[0]
        let number = splitPosition[1]

        //black goes up; black is 0 and K
        //kings and queens should have access to both sides' move options trees
        if (faction === "black" || oldPositionDiv.innerText === "K" || oldPositionDiv.innerText === "Q"){    
            //increments and decrements letter of new position ("B" becomes "C" and "A")
            let columnA = String.fromCharCode(letter.charCodeAt(0) + 1)
            let columnB = String.fromCharCode(letter.charCodeAt(0) - 1)
            let row = checkAboveRow(number)
            // below lines concatenate new column with row
            let newPositionA = columnA.concat(checkAboveRow(number)).toString()
            let newPositionB = columnB.concat(checkAboveRow(number)).toString()
            
            if (validColumn(columnA) && validRow(row)) {
                let moveDivA = document.getElementById(newPositionA)
                //if potential space to move in is empty, push it into validMoves Array
                if (moveDivA.innerText === "" && isFirstTurn){
                    validMovesArray.push(newPositionA)
                }
                //else, if potential space to move in is occupied by opposite team
                //check if that's a possible attack opening
                if (moveDivA.innerText === "1"){
                    //get rid of determinedirection???
            
                    let direction = determineBlackDirection(oldPosition, newPositionA)
                    blackAttack(newPositionA, direction)
                }
            } 
            if (validColumn(columnB) && validRow(row)) {
                let moveDivB = document.getElementById(newPositionB)
                //if potential space to move in is empty, push it into validMoves Array
                if (moveDivB.innerText === ""  && isFirstTurn){
                    validMovesArray.push(newPositionB)
                }
                //else, if potential space to move in is occupied by opposite team
                //check if that's a possible attack opening
                if (moveDivB.innerText === "1"){   
                    let direction = determineBlackDirection(oldPosition, newPositionB)
                    blackAttack(newPositionB, direction)
                }  
            }
        }
        //white goes down; white is 1 and Q
        //kings and queens should have access to both sides' moves options trees
        if (faction === "white" || oldPositionDiv.innerText === "K" || oldPositionDiv.innerText === "Q" ) {
            //increments and decrements letter of new position ("B" becomes "C" and "A")
            let columnA = String.fromCharCode(letter.charCodeAt(0) + 1)
            let columnB = String.fromCharCode(letter.charCodeAt(0) - 1)
            let row = checkBelowRow(number)
            // below lines concatenate new column with row
            let newPositionA = columnA.concat(checkBelowRow(number)).toString()
            let newPositionB = columnB.concat(checkBelowRow(number)).toString()

            //below two lines concatenate new columns with below row
            if (validColumn(columnA) && validRow(row)) {
                let moveDivA = document.getElementById(newPositionA)
                //if potential space to move in is empty, push it into validMoves Array
                if (moveDivA.innerText === ""  && isFirstTurn){
                    validMovesArray.push(newPositionA)
                }
                //else, if potential space to move in is occupied by opposite team
                //check if that's a possible attack opening
                if (moveDivA.innerText === "0"){
                    let direction = determineWhiteDirection(oldPosition, newPositionA)
                    whiteAttack(newPositionA, direction)
                }
            } 
            if (validColumn(columnB) && validRow(row)) {
                let moveDivB = document.getElementById(newPositionB)
                //if potential space to move in is empty, push it into validMoves Array
                if (moveDivB.innerText === ""  && isFirstTurn){
                    validMovesArray.push(newPositionB)
                }
                //else, if potential space to move in is occupied by opposite team
                //check if that's a possible attack opening
                if (moveDivB.innerText === "0"){
                    let direction = determineWhiteDirection(oldPosition, newPositionB)
                    whiteAttack(newPositionB, direction)
                }
            } 
        }
    }

    function whiteAttack(opponentPosition, direction){
        let attackLocation = findWhiteAttackLocation(opponentPosition, direction)
        if (attackLocation){ 
            let attackLocationDiv = document.getElementById(`${attackLocation}`)

            let attack = {attackLocation: attackLocation,
                        opponentPosition: opponentPosition, 
                        direction: direction}
            if (attackLocationDiv.innerText === ``){
                validMovesArray.push(attack.attackLocation)
                validAttackMoves.push(attack)
            }   
        }            
    }

    function blackAttack(opponentPosition, direction){
        let attackLocation = findBlackAttackLocation(opponentPosition, direction)
        if (attackLocation){ 
            let attackLocationDiv = document.getElementById(`${attackLocation}`)

            let attack = {attackLocation: attackLocation,
                        opponentPosition: opponentPosition,
                        direction:direction}
            if (attackLocationDiv.innerText === ``){
                validMovesArray.push(attack.attackLocation)
                validAttackMoves.push(attack)
            } 
        }
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

    function validRow(row){
        if (row > 0 && row < 9) {
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
    }

    function findBlackAttackLocation(opponentPosition, direction){
        if (direction){
            let opponentColumn = opponentPosition.split("")[0]
            let newColumn = String.fromCharCode(opponentColumn.charCodeAt(0) - 1)
            let opponentRow= opponentPosition.split("")[1]
            let newRow = checkAboveRow(opponentRow)
            if (validColumn(newColumn) && validRow(newRow)){
                return newColumn.concat(newRow).toString()
            }
            //rows are subtracted
            //columns subtracted
        } else {
            let opponentColumn = opponentPosition.split("")[0]
            let newColumn = String.fromCharCode(opponentColumn.charCodeAt(0) + 1)
            let opponentRow= opponentPosition.split("")[1]
            let newRow = checkAboveRow(opponentRow)
            if (validColumn(newColumn) && validRow(newRow)) {
                return newColumn.concat(newRow).toString()
            }
            //rows are subtracted
            //columns are added 
        }
    }

function findWhiteAttackLocation(opponentPosition, direction){
    if (direction){
        let opponentColumn = opponentPosition.split("")[0]
        let newColumn = String.fromCharCode(opponentColumn.charCodeAt(0) + 1)
        let opponentRow= opponentPosition.split("")[1]
        let newRow = checkBelowRow(opponentRow)
        
        if (validColumn(newColumn) && validRow(newRow)) {
            return newColumn.concat(newRow).toString()
        }
        //rows are subtracted
        //columns subtracted
    } else {
        let opponentColumn = opponentPosition.split("")[0]
        let newColumn = String.fromCharCode(opponentColumn.charCodeAt(0) - 1)
        let opponentRow= opponentPosition.split("")[1]
        let newRow = checkBelowRow(opponentRow)
        if (validColumn(newColumn) && validRow(newRow)) {
            return newColumn.concat(newRow).toString()
        }
        //rows are subtracted
        //columns are added 
    }
}

function kingMe(faction, newPositionDiv){
    let newPosition = newPositionDiv.id
    let splitPosition = newPosition.split("")
    let letter = splitPosition[0]
    let number = splitPosition[1]
    if (faction === "black"){
        if (number === "8")
        {
            return true
        }
        else {
            return false
        }
    }
    else { //white
        if (number === "1"){
            return true
        }
        else {
            return false
        }
    }
}

// -----------------------
// BACKEND STUFF BELOW
// -----------------------


let saveButton = document.getElementById("save")
let newButton = document.getElementById("new")

    function findWhiteAttackLocation(opponentPosition, direction){
        if (direction){
            let opponentColumn = opponentPosition.split("")[0]
            let newColumn = String.fromCharCode(opponentColumn.charCodeAt(0) + 1)
            let opponentRow= opponentPosition.split("")[1]
            let newRow = checkBelowRow(opponentRow)
            return newColumn.concat(newRow).toString()
            //rows are subtracted
            //columns subtracted
        } else {
            let opponentColumn = opponentPosition.split("")[0]
            let newColumn = String.fromCharCode(opponentColumn.charCodeAt(0) - 1)
            let opponentRow= opponentPosition.split("")[1]
            let newRow = checkBelowRow(opponentRow)
            return newColumn.concat(newRow).toString()
            //rows are subtracted
            //columns are added 
        }
    }

    let boardId = 73
    let saveButton = document.getElementById("save")
    let newButton = document.getElementById("new")
    let loadButton = document.getElementById("load")

    function loadNewBoard(){
        fetch('http://localhost:3000/api/v1/games')
        .then((res) => res.json())
        .then((json) => {
            parseArray(json[73])
        })
        function parseArray(collection){
            // console.log(collection.id)
            // boardId = collection.id
            
            collection.board_array.forEach(function(element, index){ 
                divElement = document.querySelector(`[data-id ="${index}"]`)
                divElement.innerText = `${element}`
            }) 
        }
    
        boardArray = []

        allDivs = document.querySelectorAll('[data-id]')
        allDivs.forEach(function(div){
            boardArray.push(div.innerText)
        })

        let newGame = {
            board_array: boardArray, 
            user_id: 1, 
            zeroturn: true
        } 

        fetch(`http://localhost:3000/api/v1/games`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(newGame)
        })
    }

    function saveBoard(){
        array = []
        let board = document.querySelectorAll(`[data-id]`)
        board.forEach(function(div){
            array.push(div.innerText)
        })

        console.log(board)
    
        fetch(`http://localhost:3000/api/v1/games/73`, {
        method: "PATCH", 
        headers: {
            "content-type": "application/json",
            "accepts": "application/json"
        }, 
        body: JSON.stringify({board_array: array,
                              user_id: 1, 
                              zeroturn: true})
    })

    }

    function loadBoard(){
        fetch('http://localhost:3000/api/v1/games/73')
        .then((res) => res.json())
        .then((json) => {
            parseArray(json)
        })
        function parseArray(collection){
            collection.board_array.forEach(function(element, index){ 
                divElement = document.querySelector(`[data-id ="${index}"]`)
                divElement.innerText = `${element}`
            }) 
        }
    }

    checkerBoard.addEventListener("click", function(e){
        if (zeroTurn){
            if (connection){
                turn(e, "black", false)
            }
            else {
                turn(e, "black", true)
            }
        }
        else{
            if (connection){
                turn(e, "white", false)
            }
            else
            {
                turn(e, "white", true)
            }
        }
    })
    
    saveButton.addEventListener('click', saveBoard)
    newButton.addEventListener('click', loadNewBoard)  
    loadButton.addEventListener('click', loadBoard)  
})



