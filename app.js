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
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

// function to loop the space_ship on to the screen...
function animate_ship() {
    requestAnimationFrame(animate_ship)
    cxt.fillStyle = 'black';
    cxt.fillRect(0, 0, canvas.width, canvas.height);
    ship.update();

    if(keys.d.pressed) {
        ship.velocity.x = 5;
    }
    else if(keys.a.pressed) {
        ship.velocity.x = -5;
    }
    else {
        ship.velocity.x = 0;
    }
}
animate_ship();

document.addEventListener('keydown', key => {
    switch (key) {
        case 'd':
            keys.d.pressed = true;
            console.log('move right');
            break;
        case 'a': 
            keys.a.pressed = true;
            console.log('move LEFT');
            break;
    }
})

document.addEventListener('keyup', key => {
    switch (key) {
        case 'd':
            keys.d.pressed = false;
            console.log('move right');
            break;
        case 'a': 
            keys.a.pressed = false;
            console.log('move LEFT');
            break;
    }
})
