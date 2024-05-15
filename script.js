const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 640;
const canvasHeight = 1030;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

class Plane {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 5;
        console.log('Plane created at', this.x, this.y);
    }

    draw() {
        console.log('Drawing plane at', this.x, this.y);
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(dir) {
        if (dir === 'left' && this.x > 0) {
            this.x -= this.speed;
        } else if (dir === 'right' && this.x < canvas.width - this.width) {
            this.x += this.speed;
        } else if (dir === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (dir === 'down' && this.y < canvas.height - this.height) {
            this.y += this.speed;
        }
    }

    moveTo(x, y) {
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
        if (this.x < 0) this.x = 0;
        if (this.x > canvas.width - this.width) this.x = canvas.width - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > canvas.height - this.height) this.y = canvas.height - this.height;
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 10;
        this.speed = 7;
        console.log('Bullet created at', this.x, this.y);
    }

    draw() {
        console.log('Drawing bullet at', this.x, this.y);
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y -= this.speed;
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 2;
        console.log('Enemy created at', this.x, this.y);
    }

    draw() {
        console.log('Drawing enemy at', this.x, this.y);
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
    }
}

const player = new Plane(canvas.width / 2 - 25, canvas.height - 60);
const bullets = [];
const enemies = [];

function spawnEnemy() {
    const x = Math.random() * (canvas.width - 50);
    const y = -50;
    console.log('Spawning enemy at', x, y);
    enemies.push(new Enemy(x, y));
}

function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.update();
        enemy.draw();
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.update();
        bullet.draw();
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function detectCollisions() {
    enemies.forEach((enemy, eIndex) => {
        bullets.forEach((bullet, bIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                console.log('Bullet hit enemy');
                enemies.splice(eIndex, 1);
                bullets.splice(bIndex, 1);
            }
        });

        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            alert('Game Over!');
            document.location.reload();
        }
    });
}

function gameLoop() {
    console.log('Game Loop Running');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    updateBullets();
    updateEnemies();
    detectCollisions();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
    console.log('Key pressed:', e.key);
    if (e.key === 'ArrowLeft') {
        player.move('left');
    } else if (e.key === 'ArrowRight') {
        player.move('right');
    } else if (e.key === 'ArrowUp') {
        player.move('up');
    } else if (e.key === 'ArrowDown') {
        player.move('down');
    } else if (e.key === ' ') {
        bullets.push(new Bullet(player.x + player.width / 2 - 2.5, player.y));
    }
});

// 添加触摸事件支持
canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    player.moveTo(touch.clientX - canvas.getBoundingClientRect().left, touch.clientY - canvas.getBoundingClientRect().top);
});

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    setInterval(spawnEnemy, 1000);
    gameLoop();
});
