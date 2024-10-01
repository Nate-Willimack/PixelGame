document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.getElementById('gameArea');
    
    if (!gameArea) {
        console.error("gameArea element not found!");
        return;
    }
    
    const player1HealthElement = document.getElementById('player1Health');
    const player2HealthElement = document.getElementById('player2Health');

    const gameAreaWidth = 800; // Width of the game area
    const gameAreaHeight = 600; // Height of the game area
    const bulletSpeed = 10; // Speed of bullets
    let playerTurn = 1;
    let player1Health = 100;
    let player2Health = 100;
    const bullets = [];

    // Player positions and movement speeds
    const player1Position = { x: 50, y: 300 };
    const player2Position = { x: 700, y: 300 };
    const playerSpeed = 5; // Speed of player movement

    // Set up the game area dimensions and background
    gameArea.style.width = `${gameAreaWidth}px`;
    gameArea.style.height = `${gameAreaHeight}px`;
    gameArea.style.position = 'relative';

    // Create players as divs
    const player1 = document.createElement('div');
    player1.classList.add('player1');
    player1.style.left = `${player1Position.x}px`;
    player1.style.top = `${player1Position.y}px`;
    gameArea.appendChild(player1);

    const player2 = document.createElement('div');
    player2.classList.add('player2');
    player2.style.left = `${player2Position.x}px`;
    player2.style.top = `${player2Position.y}px`;
    gameArea.appendChild(player2);

    // Function to update player positions
    function updatePlayers() {
        player1.style.left = `${player1Position.x}px`;
        player1.style.top = `${player1Position.y}px`;

        player2.style.left = `${player2Position.x}px`;
        player2.style.top = `${player2Position.y}px`;
    }

    // Function to shoot bullets
    function shoot(player, direction) {
        const bullet = {
            player: player,
            position: player === 1 ? { ...player1Position } : { ...player2Position },
            direction: direction
        };
        bullets.push(bullet);
    }

    // Function to move bullets and check for collisions
    function moveBullets() {
        bullets.forEach((bullet, index) => {
            switch (bullet.direction) {
                case 'up':
                    bullet.position.y -= bulletSpeed;
                    break;
                case 'down':
                    bullet.position.y += bulletSpeed;
                    break;
                case 'left':
                    bullet.position.x -= bulletSpeed;
                    break;
                case 'right':
                    bullet.position.x += bulletSpeed;
                    break;
            }

            // Create bullet element
            const bulletElement = document.createElement('div');
            bulletElement.classList.add('bullet');
            bulletElement.style.left = `${bullet.position.x + 15}px`; // Adjust bullet offset to appear from center
            bulletElement.style.top = `${bullet.position.y + 15}px`;

            // Change bullet color to match the player
            bulletElement.style.backgroundColor = bullet.player === 1 ? 'blue' : 'red';

            gameArea.appendChild(bulletElement);

            // Check if bullet hits player 1
            if (
                bullet.player === 2 &&
                bullet.position.x >= player1Position.x &&
                bullet.position.x <= player1Position.x + 40 &&
                bullet.position.y >= player1Position.y &&
                bullet.position.y <= player1Position.y + 40
            ) {
                player1Health -= 10;
                player1HealthElement.innerText = player1Health;
                bullets.splice(index, 1); // Remove the bullet
            }

            // Check if bullet hits player 2
            if (
                bullet.player === 1 &&
                bullet.position.x >= player2Position.x &&
                bullet.position.x <= player2Position.x + 40 &&
                bullet.position.y >= player2Position.y &&
                bullet.position.y <= player2Position.y + 40
            ) {
                player2Health -= 10;
                player2HealthElement.innerText = player2Health;
                bullets.splice(index, 1); // Remove the bullet
            }

            // Remove bullets that go out of bounds
            if (
                bullet.position.x < 0 ||
                bullet.position.x > gameAreaWidth ||
                bullet.position.y < 0 ||
                bullet.position.y > gameAreaHeight
            ) {
                bullets.splice(index, 1); // Remove out-of-bounds bullets
            }
        });
    }

    // Check win condition
    function checkWinCondition() {
        if (player1Health <= 0) {
            alert('Player 2 wins!');
        } else if (player2Health <= 0) {
            alert('Player 1 wins!');
        }
    }

    // Game loop
    function gameLoop() {
        moveBullets();
        checkWinCondition();
        updatePlayers();
        requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keydown', (e) => {
        if (playerTurn === 1) {
            if (e.key === 'ArrowUp') player1Position.y = Math.max(0, player1Position.y - playerSpeed);
            if (e.key === 'ArrowDown') player1Position.y = Math.min(gameAreaHeight - 40, player1Position.y + playerSpeed);
            if (e.key === 'ArrowLeft') player1Position.x = Math.max(0, player1Position.x - playerSpeed);
            if (e.key === 'ArrowRight') player1Position.x = Math.min(gameAreaWidth - 40, player1Position.x + playerSpeed);
            if (e.key === ' ') shoot(1, 'right'); // Player 1 shoots with spacebar
            playerTurn = 2;
        } else {
            if (e.key === 'w') player2Position.y = Math.max(0, player2Position.y - playerSpeed);
            if (e.key === 's') player2Position.y = Math.min(gameAreaHeight - 40, player2Position.y + playerSpeed);
            if (e.key === 'a') player2Position.x = Math.max(0, player2Position.x - playerSpeed);
            if (e.key === 'd') player2Position.x = Math.min(gameAreaWidth - 40, player2Position.x + playerSpeed);
            if (e.key === 'Enter') shoot(2, 'left'); // Player 2 shoots with Enter key
            playerTurn = 1;
        }
    });

    gameLoop(); // Start the game loop
});
