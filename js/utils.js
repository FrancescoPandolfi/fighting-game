// COLLISION DETECTION FUNCTION
function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function setTimeoutHandler(action) {

}

// Determine winner
function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    setTimeout(() => {
        document.querySelector('#displayText').style.display = 'flex'
    }, 500)
    if (player.health === enemy.health && timer === 0) {
        document.querySelector('#displayText').innerHTML = 'Tie'
    } else if (player.health === 0 && enemy.health === 0) {
        document.querySelector('#displayText').innerHTML = 'Double K.O.'
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 wins'
    } else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 wins'
    }
}


//  TIMER
let timer = 60
let timerId

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0) {
        determineWinner({player, enemy, timerId})
    }
}
