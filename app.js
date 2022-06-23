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

//class of a bullet...
class Bullet {
    constructor({position, velocity}) { // passing in properties as an argument...
        this.position = position;
        this.velocity = velocity;
        this.radius = 2;
    }
    draw() {
        cxt.beginPath();
        cxt.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        cxt.fillStyle = 'red';
        cxt.fill();
        cxt.closePath();
        // cxt.fillRect(this.pos_X + ship.width/2, this.pos_Y, this.width, this.height)
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

const ship = new Spaceship();
// const bullet = new BULLET(
//     {position: 
//         {x: ship.position.x,
//          y: ship.position.y}, 
//      velocity: 
//         {x: 0, 
//          y: -10}}
//     );
let bullet = [];

const LEFT_key = 37;
const RIGHT_key = 39;
const SPACE_BAR_key = 32;
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

document.addEventListener('keydown', key => {
    switch (key.keyCode) {
        case RIGHT_key:
            keys.RIGHT.pressed = true;
            break;
        case LEFT_key: 
            keys.LEFT.pressed = true;
            break;
        case SPACE_BAR_key:
            keys.SPACE.pressed = true;
            createBullet();
            break;
    }
    // bullet.draw();
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

// function to loop the space_ship on to the screen...
function animate_ship() {
    requestAnimationFrame(animate_ship)
    cxt.fillStyle = 'black';
    cxt.fillRect(0, 0, canvas.width, canvas.height);
    ship.update();

    bullet.forEach((shot, index) => {
        shot.update();
        // if bullet hits the upper wall remove it from the 'bullet' array...
        if(shot.position.y < 0) {
            bullet.splice(shot[index], 1);
        }
    })
    
    // bullet.draw();
    // bullet.update();

    if(keys.RIGHT.pressed && ship.position.x < canvas.width - ship.width) {
        ship.velocity.x = 5;
    }
    else if(keys.LEFT.pressed && ship.position.x > 0) {
        ship.velocity.x = -5;
    }
    else {
        ship.velocity.x = 0;
        if(keys.SPACE.pressed) {
           
    }  
}
}
animate_ship();

//function to create a bullet...
function createBullet() {
    bullet.push(new Bullet({
        position : {
            x: ship.position.x + ship.width / 2,
            y: ship.position.y
        },
        velocity: {
            x: 0,
            y: -5
        }
    }))
console.log(bullet)
}