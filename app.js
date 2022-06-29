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
const image_invader = new Image();
image_invader.src = 'images/space_invader.png';

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
        this.rotation = 0
    }
    draw() {
        cxt.save();  // takes the snapshot of the current canvas...
        cxt.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2);
        cxt.rotate(this.rotation);
        cxt.translate(
            -this.position.x - this.width / 2,
            -this.position.y - this.height / 2);

        cxt.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

        cxt.restore(); // restores the canvas to where it was...
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
        this.radius = 5;
    }
    draw() {
        cxt.beginPath();
        cxt.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        cxt.fillStyle = 'red';
        cxt.fill();
        cxt.closePath();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

// const invader_velocity_X = Math.random() * 5 + 2;
class Invader {
    constructor({position}) {
        this.position = {
            x: position.x,
            y: position.y
        }
        this.velocity = {
            x: 0, 
            y: 0
        }
        this.width = this.height = 30;
        this.image = image_invader;
    }

    draw() {
        cxt.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
    update({velocity}) {
        this.draw();
        this.position.x += velocity.x;
        this.position.y += velocity.y;
    }
}

let grids = [];

console.log(grids)
class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: Math.random() * 5 + 2,
            y: 0
        }
        this.invaders = []; //this... (position)index

        const rows = Math.floor(Math.random() * 10 + 3);
        const columns =  Math.floor(Math.random() * 5 + 2);
        this.width = columns * 30;

        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < columns; j++) {
                this.invaders.push(new Invader({position: {
                    x: i * 30,
                    y: j * 30
                }}));
            }
        }
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.y = 0  //initializing the vertical velocity so that it will only be implement ones after the condition...
        if(this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.y = 30;
            this.velocity.x = -this.velocity.x;
        }
    }
}

class Invader_bullet {
    constructor({position, velocity}) { // passing in properties as an argument...
        this.position = position;
        this.velocity = velocity;
        this.radius = 10;
    }
    draw() {
        cxt.beginPath();
        cxt.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        cxt.fillStyle = '#204a87';
        cxt.fill();
        cxt.closePath();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

//particles for after death...
class Particles {
    constructor({position}) {
        this.position = position;
        this.velocity = {
            x: Math.random() * 5 - 2.5,     //velocity between (-2.5) and 2.5
            y: Math.random() * 5 - 2.5
         }
        this.radius = Math.random() * 4 + 1;
    }
    draw() {
        cxt.beginPath();
        cxt.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        cxt.fillStyle = '#204a87';
        cxt.fill();
        cxt.closePath();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.radius > 0.2) this.radius -= 0.1;
    }
}

const ship = new Spaceship();
// const invader = new Invader();
const grid = new Grid();
grids.push(grid);
let bullet = []; //this... index (position)equal
let invader_bullet = [];
let particles_array = [];

const LEFT_key = 37;
const RIGHT_key = 39;
// const UP_key = 38;
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
            // if(ship.velocity.x != 0) return
            createBullet();
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

// function to loop the space_ship on to the screen...
const random_Interval = Math.floor((Math.random() * 500) + 500);
let frames = 0;
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

    grids.forEach(grid => {
        grid.update();
        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity});

            //kill the invader...
            bullet.forEach((shot, index) => {
                if(shot.position.y - shot.radius <= invader.position.y + invader.height &&
                    shot.position.y + shot.radius >= invader.position.y &&
                    shot.position.x - shot.radius <= invader.position.x  &&
                    shot.position.x + shot.radius >= invader.position.x) {
                        for(let p = 0; p < 10; p++) {
                            particles_array.push(new Particles({position: 
                                {x: invader.position.x + invader.height / 2,
                                 y: invader.position.y + invader.height / 2
                                }}))
                        }
                        setTimeout(() => {      //to remove the invader and a bullet instantly...
                            grid.invaders.splice(i, 1)
                            bullet.splice(index, 1);

                            if(grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0];
                                const lastInvader = grid.invaders[grid.invaders.length - 1];

                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                                grid.position.x = firstInvader.position.x;
                            }
                        }, 0)
                    }
           })
        })
    })

    //update every bullets....
    invader_bullet.forEach(bullet => {
        bullet.update();
    })

    //update every particles....
    particles_array.forEach((particle, index) => {
        particle.update();
        if(particle.radius < 0.3) particles_array.splice(index, 1);
    })
    
    //remove the particles from an array if the radius of particle is less than 0.3...
    
    // console.log(grid.invaders)
    if(keys.RIGHT.pressed && ship.position.x < canvas.width - ship.width) {
        ship.velocity.x = 10;
        ship.rotation = 0.1;
    }
    else if(keys.LEFT.pressed && ship.position.x > 0) {
        ship.velocity.x = -10;
        ship.rotation = -0.1;
    }
    else {
        ship.velocity.x = 0;
        ship.rotation = 0;
}
frames ++;
console.log(frames)
if(frames % random_Interval === 0) {
    grids.push(new Grid());
    console.log(grids)
    invader_bullet.push(new Invader_bullet({
        position: {x: 100, y: 100},
        velocity: {x: 0, y: 5}
    }))
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
            y: -7
        }
    }))
console.log(bullet)
}