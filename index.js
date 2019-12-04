let gameInProgress = true
let chessboard = document.querySelector(".chessboard")

while (gameInProgress){
    let lastMove = {
        position: "",
        piece: ""
    }
    let pieceSelected = false

    const blackPawn = `&#9821;`
    const blackRook = `&#9820;`
    const blackBishop = `&#9821;`
    const blackKing = `&#9819;`
    const blackQueen = `&#9818;`
    const blackKnight = `&#9822;` 

    const whitePawn = `&#9817;`
    const whiteRook = `&#9814;`
    const whiteBishop = `&#9815;`
    const whiteKing = `&#9813;`
    const whiteQueen = `&#9812;`
    const whiteKnight = `&#9816;`

    let whiteTurn = true 
    let turnDiv = document.getElementById("turn")
    if (whiteTurn){
        turnDiv.innerText = "White's Turn"
    }
    else {
        turnDiv.innerText = "Black's Turn"
    }

    chessboard.addEventListener("click", function(e){
        //changes CSS of currently clicked board position to add red highlight
        e.target.dataset.purpose = "target"
        console.log(pieceSelected)

        //initial selecting of piece to move
        if (!pieceSelected && e.target.innerText){
            //gets HTML board space by last move's board space
            let lastMoveDiv = document.getElementById(`${lastMove.position}`)

            //sets lastMove to current move
            lastMove.position = e.target.id
            lastMove.piece = e.target.innerText

            //removes last move's CSS highlight
            lastMoveDiv.dataset.purpose = ""

            //toggles pieceSelected to true
            pieceSelected = true
        }
        // second click, choosing where to move the selected piece
        else {
            //sets currently selected board position's inner text to the last move's piece
            e.target.innerText = lastMove.piece
            console.log(lastMove.piece)
            
            //gets HTML board space by last move's board space
            let lastMoveDiv = document.getElementById(`${lastMove.position}`)

            //sets lastMove to current move
            lastMove.position = e.target.id
            lastMove.piece = e.target.innerText

            //removes last move's CSS highlight
            lastMoveDiv.dataset.purpose = ""

            //when piece is moved, previous position gets an empty space
            lastMoveDiv.innerText = ""

            //toggles pieceSelected to false
            pieceSelected = false
            if (whiteTurn) {
                turnDiv.innerText = "Black's Turn"
                whiteTurn = false
            }
            else {
                turnDiv.innerText = "White's Turn"
                whiteTurn = true
            }
        }
        // else if (e.target.id === "target"){
        //     e.target.id = ""
        // }
    })
}

function turn(faction){

}

function firstClick(){

}