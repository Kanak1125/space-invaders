const canvas = document.getElementById('canvas');
const cxt = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

// storing the image of the space_ship in the image object
const image = new Image();
image.src = 'images/space_ship.png';

class Spaceship {
    constructor() {
        this.position = {
            x: canvas.width / 2,
            y: canvas.height - 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.image = image
        this.width = 100
        this.height = 100
    }
    draw() {
        cxt.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
    }
}
const ship = new Spaceship();
const LEFT_key = 37;
const RIGHT_key = 39;
const keys = {
    LEFT: {
        pressed: false      //property defined to stop the animation when the event is keyUP...
    },
    RIGHT: {
        pressed: false
    },
    SPACE: {
        pressed: false
    }
}

// function to loop the space_ship on to the screen...
function animate_ship() {
    requestAnimationFrame(animate_ship)
    cxt.fillStyle = 'black';
    cxt.fillRect(0, 0, canvas.width, canvas.height);
    ship.update();

    if(keys.RIGHT.pressed && ship.position.x < canvas.width - ship.width) {
        ship.velocity.x = 5;
    }
    else if(keys.LEFT.pressed && ship.position.x > 0) {
        ship.velocity.x = -5;
    }
    else {
        ship.velocity.x = 0;
    }
}
animate_ship();

document.addEventListener('keydown', key => {
    switch (key.keyCode) {
        case RIGHT_key:
            keys.RIGHT.pressed = true;
            break;
        case LEFT_key: 
            keys.LEFT.pressed = true;
            break;
    }
})

document.addEventListener('keyup', key => {
    switch (key.keyCode) {
        case RIGHT_key:
            keys.RIGHT.pressed = false;
            break;
        case LEFT_key: 
            keys.LEFT.pressed = false;
            break;
    }
})