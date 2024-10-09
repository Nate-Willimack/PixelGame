document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.getElementById('gameArea');
    
    if (!gameArea) {
        console.error("gameArea element not found!");
        return;
    }

    const gameAreaWidth = 800;
    const gameAreaHeight = 600;
    const playerSpeed = 5;
    const bulletSpeed = 7;
    const enemySpeed = 2;
    let score = 0;

    gameArea.style.width = `${gameAreaWidth}px`;
    gameArea.style.height = `${gameAreaHeight}px`;
    gameArea.style.position = 'relative';
    gameArea.style.backgroundImage = "url('./styles/images/background.jpg')";
    gameArea.style.overflow = 'hidden';

    const player = document.createElement('img');
    player.src = './styles/images/player 1.png';
    player.style.position = 'absolute';
    player.style.bottom = '10px';
    player.style.left = `${gameAreaWidth / 2 - 25}px`;
    player.style.width = '50px';
    gameArea.appendChild(player);

    let moveLeft = false;
    let moveRight = false;

    document.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowLeft') moveLeft = true;
        if (e.code === 'ArrowRight') moveRight = true;
        if (e.code === 'Space') shootBullet();
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowLeft') moveLeft = false;
        if (e.code === 'ArrowRight') moveRight = false;
    });

    function movePlayer() {
        const currentLeft = parseInt(player.style.left);
        if (moveLeft && currentLeft > 0) player.style.left = `${currentLeft - playerSpeed}px`;
        if (moveRight && currentLeft < gameAreaWidth - 50) player.style.left = `${currentLeft + playerSpeed}px`;
    }

    function shootBullet() {
        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        bullet.style.left = `${parseInt(player.style.left) + 20}px`;
        bullet.style.bottom = '60px';
        gameArea.appendChild(bullet);
    }

    function moveBullets() {
        const bullets = document.querySelectorAll('.bullet');
        bullets.forEach(bullet => {
            const bulletBottom = parseInt(bullet.style.bottom);
            if (bulletBottom > gameAreaHeight) {
                bullet.remove();
            } else {
                bullet.style.bottom = `${bulletBottom + bulletSpeed}px`;
            }
        });
    }

    function createEnemy() {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.left = `${Math.random() * (gameAreaWidth - 50)}px`;
        enemy.style.top = '0px';
        gameArea.appendChild(enemy);
    }

    function moveEnemies() {
        const enemies = document.querySelectorAll('.enemy');
        enemies.forEach(enemy => {
            const enemyTop = parseInt(enemy.style.top);
            if (enemyTop > gameAreaHeight) {
                enemy.remove();
            } else {
                enemy.style.top = `${enemyTop + enemySpeed}px`;
            }
        });
    }

    function detectCollisions() {
        const bullets = document.querySelectorAll('.bullet');
        const enemies = document.querySelectorAll('.enemy');

        bullets.forEach(bullet => {
            const bulletRect = bullet.getBoundingClientRect();
            enemies.forEach(enemy => {
                const enemyRect = enemy.getBoundingClientRect();
                if (
                    bulletRect.left < enemyRect.right &&
                    bulletRect.right > enemyRect.left &&
                    bulletRect.top < enemyRect.bottom &&
                    bulletRect.bottom > enemyRect.top
                ) {
                    bullet.remove();
                    enemy.remove();
                    score += 100;
                    updateScore();
                }
            });
        });
    }

    function updateScore() {
        const scoreElement = document.getElementById('score');
        scoreElement.innerText = `Score: ${score}`;
    }

    function gameLoop() {
        movePlayer();
        moveBullets();
        moveEnemies();
        detectCollisions();
        requestAnimationFrame(gameLoop);
    }

    const scoreDisplay = document.createElement('div');
    scoreDisplay.id = 'score';
    scoreDisplay.style.position = 'absolute';
    scoreDisplay.style.top = '10px';
    scoreDisplay.style.left = '10px';
    scoreDisplay.style.color = 'white';
    scoreDisplay.style.fontSize = '20px';
    scoreDisplay.innerText = 'Score: 0';
    gameArea.appendChild(scoreDisplay);

    setInterval(createEnemy, 2000);

    gameLoop();
});
