const canvas = document.getElementById('canvas');
const cxt = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const getScore = document.getElementById('score');
let score = 0;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

// storing the image of the space_ship in the image object
const image = new Image();
image.src = 'images/space_ship.png';
const image_invader = new Image();
image_invader.src = 'images/space_invader.png';
//let gun_shot_audio = new Audio('audio/P226-9mm-Far-Single-Gunshot-E-www.fesliyanstudios.com.mp3')

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
        this.opacity = 1
    }
    draw() {
        cxt.save();  // takes the snapshot of the current canvas...
        cxt.globalAlpha = this.opacity 
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

class InvaderBullet {
    constructor({position, velocity}) { // passing in properties as an argument...
        this.position = position;
        this.velocity = velocity;
        this.width = 5;
        this.height = 20;
    }
    draw() {
        cxt.fillStyle = '#204a87';
        cxt.fillRect(this.position.x, this.position.y, this.width, this.height);
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
    shoot(invader_bullets) {
        invader_bullets.push(new InvaderBullet({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 3
            }
        }));
    }
}

let grids = [];

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

//particles for after death...
class Particles {
    constructor({position, velocity, radius}) {
        this.position = position;
        this.velocity = velocity
        this.radius = radius
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

let count_radius_growth = 0;
//class to create background stars...
class Star {
    constructor() {
        this.position = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        }
        this.velocity = {
            x: 0, 
            y: -0.5
        }
        this.radius = Math.random() * 1.5 + 0.5;    //random radius between 0.5 and 2...
        this.previous_star_size = this.radius;
        this.opacity = Math.random() * 0.8 + 0.3;
    }
    draw() {
        cxt.beginPath();
        cxt.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        cxt.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        cxt.fill();
        cxt.closePath();
    }
    update() {
        this.draw();
        this.radius += 0.01
        count_radius_growth ++;
        if(count_radius_growth > 10) {
            this.radius = Math.random() * 1.5 + 0.5;
        }
        this.position.y -= this.velocity.y;
    }
}

const ship = new Spaceship();
const grid = new Grid();
grids.push(grid);
let bullet = []; //this... index (position)equal
let particles_array = [];
let invader_bullet = [];

let stars = []
for(let i = 0; i < 100; i++) {
    stars.push(new Star())
}

let control = true;
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
    if(control == false) return;
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

function createParticles({object}) {
    for(let p = 0; p < 10; p++) {
        particles_array.push(new Particles(
            {position:
                {
                x: object.position.x + object.height / 2,
                y: object.position.y + object.height / 2
                }
            ,
                velocity: 
                {
                    x: Math.random() * 5 - 2.5,     //velocity between (-2.5) and 2.5
                    y: Math.random() * 5 - 2.5
                }
            ,
            radius: Math.random() * 5 + 1    
        }))
    }
}

function animate() {
    requestAnimationFrame(animate)
    cxt.fillStyle = 'black';
    cxt.fillRect(0, 0, canvas.width, canvas.height);
   
    ship.update();
    console.log(stars)
    
    bullet.forEach((shot, index) => {
        shot.update();
        // if bullet hits the upper wall remove it from the 'bullet' array...
        if(shot.position.y < 0) {
            bullet.splice(shot[index], 1);
        }
    })

    stars.forEach(star => {
        star.update();
        if(star.position.y > canvas.height) {
            star.position.y = 0;
        }
    })
    
    grids.forEach(grid => {
        grid.update();

        //spawning the bullets from invaders...
        if(frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invader_bullet);
            console.log(ship.position.y)
            invader_bullet.forEach((bullet, index) => {
                if(bullet.position.y >= canvas.height) {
                    setTimeout(() => {
                        invader_bullet.splice(bullet[index], 1);
                    }, 0)
                }
            })
        }

        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity});

            //kill the invader...
            bullet.forEach((shot, index) => {
                if(shot.position.y - shot.radius <= invader.position.y + invader.height &&
                    shot.position.y + shot.radius >= invader.position.y &&
                    shot.position.x - shot.radius <= invader.position.x  &&
                    shot.position.x + shot.radius >= invader.position.x) {
                    createParticles({
                        object: invader
                    });

                        setTimeout(() => {      //to remove the invader and a bullet instantly...
                            const invaderFound = grid.invaders.find(invader2 => {   //find the closest element in array...
                                return invader2 === invader
                            })
                            const bulletFound = bullet.find(bullet2 => {
                                return bullet2 === shot
                            })

                            if(invaderFound && bulletFound) {
                                score ++;
                                getScore.textContent = score;
                                grid.invaders.splice(i, 1)
                                bullet.splice(index, 1);
                            }

                            if(grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0];
                                const lastInvader = grid.invaders[grid.invaders.length - 1];

                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                                grid.position.x = firstInvader.position.x;
                                console.log(grid.invaders.length)
                            }
                        }, 0)
                    }
           })
        })
    })

    //update every particles....
    particles_array.forEach((particle, index) => {
        particle.update();
        if(particle.radius < 0.3) particles_array.splice(index, 1);
    })
let explosion = [];
    //update every invader_bullets...
    invader_bullet.forEach((bullet, index) => {
        bullet.update();
        if(bullet.position.y + bullet.height >= ship.position.y &&
           bullet.position.x - bullet.width >= ship.position.x &&
           bullet.position.x <= ship.position.x + ship.width - 20 &&
           bullet.position.y <= ship.position.y + ship.height &&
           ship.opacity === 1) {
            createParticles({
                object: ship
            });
            invader_bullet.splice(index, 1)
            ship.opacity = 0;
            control = false;
            console.log("u r doomed!")
        }
        console.log(explosion)
        explosion.forEach(particle => {
            particle.draw(cxt.fillStyle = 'red')
            particle.update();
        })
    })
    
    //remove the particles from an array if the radius of particle is less than 0.3...
    
    if(keys.RIGHT.pressed && ship.position.x < canvas.width - ship.width) {
        ship.velocity.x = 10;
        ship.rotation = 0.15;
    }
    else if(keys.LEFT.pressed && ship.position.x > 0) {
        ship.velocity.x = -10;
        ship.rotation = -0.15;
    }
    else {
        ship.velocity.x = 0;
        ship.rotation = 0;
}
frames ++;
if(frames % random_Interval === 0) {
    grids.push(new Grid());
}
}
animate();

//function to create a bullet...
function createBullet() {
    //gun_shot_audio.currentTime = 0;
    //gun_shot_audio.play();
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
}