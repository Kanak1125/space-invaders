const canvas = document.getElementById('canvas');
const cxt = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const half_canvas_width = canvas.width / 2; 

let dx = 10; // for horizontal velocity...
let b_dy = 10; //vertical velocity for bullet...

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

let spaceship = [{x: half_canvas_width - 10, y: canvas.height - 10},
                    {x: half_canvas_width, y: canvas.height - 20},
                    {x: half_canvas_width + 10, y: canvas.height - 10},
                    {x: half_canvas_width, y: canvas.height - 10}
                    ]

let bullets = [];

drawShip()

    document.addEventListener('keydown', move_ship);

//function to draw spaceship...
function drawShip() {
    // drawBullet()
    spaceship.forEach(drawShipPart);
}

//function to create spaceship parts...
function drawShipPart(part) {
    cxt.fillStyle = 'white';
    cxt.strokeStyle = 'black';
    cxt.fillRect(part.x + dx, part.y, 10, 10);
    cxt.strokeRect(part.x + dx, part.y, 10, 10);
}

//function to clear previous parts...
function clearPart() {
    cxt.clearRect(0, 0, canvas.width, canvas.height);
}

//function to move the spaceship...
function move_ship(event) {
    clearPart();
    const RIGHT = 39;
    const LEFT = 37;
    const keyPressed = event.keyCode;
    spaceship.forEach(part => {
    // if(part.x < 0 || part.x > canvas.width) alert('touched');
        if(keyPressed === LEFT && keyPressed != RIGHT) 
        {
            part.x -= dx;
        }
        if(keyPressed === RIGHT && keyPressed != LEFT) {
            part.x += dx;
        }
    });
    // console.log(spaceship)
    drawShip()
}

//creating class for every bullet to be shoot...
class BULLET {
    constructor() {
        this.pos_x = spaceship[1].x;
        this.pos_y = spaceship[1].y;
        this.speed_Y = 10;
    }
    shoot() {
        this.pos_x = spaceship[1].x;
        this.pos_y -= this.speed_Y;
        console.log(this.pos_x, this.pos_y);
        // setTimeout(shoot, 500)
    }
    //method to create bullet...
    drawBullet() {
        cxt.fillStyle = 'red';
        cxt.strokeStyle = 'black';
        cxt.fillRect(this.pos_x + 10, this.pos_y, 10, 10);
        cxt.strokeRect(this.pos_x + 10, this.pos_y, 10, 10);
        console.log('bullet drawn')
    //  setTimeout(drawBullet, 500)
}
}

document.addEventListener('keydown', fire)
//function to fire...
function fire(event) {
    const UP = 38;
    const SPACE_BAR = 32;
    if(event.keyCode === UP || event.keyCode === SPACE_BAR) {
        const call_bullet = new BULLET();
        console.log(call_bullet);
        call_bullet.shoot();
        call_bullet.drawBullet();
        console.log('fire')
    }
}




