const scoreEl = document.querySelector('#scoreEl')
const canvas = document.querySelector('canvas')

const c = canvas.getContext("2d")
console.log(scoreEl)
canvas.width = 1024
canvas.height = 576

class Player {
    constructor(){
       
        this.velocity = {
            x: 0,
            y: 0
        }
        this.opacity = 1
        this.rotation = 0
        
        const image = new Image()
        image.src = "./img/spaceship.png"
        image.onload = () => {
        const scale =.15
        this.image = image 
        this.width = image.width *scale
        this.height = image.height *scale
        this.position = {
            x: canvas.width /2  - this.width/2,
            y: canvas.height - this.height -25

        }

        }

        

    }
    draw() {
       
         //c.fillStyle="red"
         // c.fillRect(this.position.x, this.position.y, this.width, this.height  )
        c.save()
        c.globalAlpha = this.opacity
        c.translate(player.position.x + player.width/2, player.position.y + player.height/2 )
        c.rotate(this.rotation)
        c.translate(-player.position.x - player.width/2, -player.position.y -player.height/2 )

         c.drawImage(this.image,
            this.position.x ,
            this.position.y ,
            this.width,
            this.height)

        c.restore()
    }
    update(){
        if(this.image){
        this.draw()
        this.position.x += this.velocity.x
        }
    }

}




class projectile {
    constructor({position,velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 4
    }

    draw(){
       c.beginPath()  
       c.arc(this.position.x ,  this.position.y , this.radius , 0, Math.PI*2 )
       c.fillStyle ="red"
       c.fill()
       c.closePath()

    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}




class particle {
    constructor({position,velocity , radius , color , fades }){
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw(){
        c.save()
        c.globalAlpha = this.opacity
       c.beginPath()  
       c.arc(this.position.x ,  this.position.y , this.radius , 0, Math.PI*2 )
       c.fillStyle = this.color
       c.fill()
       c.closePath()
       c.restore()

    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.fades) this.opacity -= 0.01
    }
}

class invaderprojectile {
    constructor({position,velocity}){
        this.position = position
        this.velocity = velocity

        this.width = 3;
        this.height = 10; 
    }

    draw(){
        c.fillStyle = "white"
       c.fillRect(this.position.x , this.position.y , this.width , this.height )

    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}



class Invader {
    constructor({position}){
       
        this.velocity = {
            x: 0,
            y: 0
        }
       
        
        const image = new Image()
        image.src = "./img/invader.png"
        image.onload = () => {
        const scale = 1
        this.image = image 
        this.width = image.width *scale
        this.height = image.height *scale
        this.position = {
            x:position.x,
            y: position.y

        }

        }

        

    }
    draw() {
       
         //c.fillStyle="red"
         // c.fillRect(this.position.x, this.position.y, this.width, this.height  )
            c.drawImage(this.image,
            this.position.x ,
            this.position.y ,
            this.width,
            this.height)

       
    }
    update({velocity}){
        if(this.image){
        this.draw()
        this.position.x += velocity.x
        this.position.y += velocity.y
        }
    }
    shoot(invaderprojectiles){
        invaderprojectiles.push(new invaderprojectile ({
            position : {
                x: this.position.x + this.width/2,
                y: this.position.y + this.height
            },
            velocity :{
                x: 0,
                y: 5
            }
        } )
        )
    }
}
class Grid{
    constructor(){
        this.position = {
            x :0 ,
            y: 0
        }

        this.velocity = {
            x : 3,
            y: 0
        }
        
        this.invaders = []
        const rows = Math.floor(Math.random()*5 +2)
        const columns = Math.floor(Math.random()*10 + 5)
        this.width = rows *30
        for (let i= 0;i<rows;i++ ){
            for (let y= 0;y<columns;y++ ){

            this.invaders.push(new Invader({
                position:{
                    x: i*30, 
                    y: y*30
                }
            }))
        }
        }
        console.log(this.invaders)

    }
    update()
    {
        this.position.x+= this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y = 0
        if(this.position.x + this.width >= canvas.width || this.position.x <=0){
            this.velocity.x= - this.velocity.x
            this.velocity.y = 25
        }
    }
}


 
const player = new Player() 
const projectiles = []
const grids = []
const invaderprojectiles = []
const particles = []
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


let frames = 0
let randominterval = Math.floor(Math.random()*400 + 400)
let game = {
    over : false ,
    active : true 
}
let score =0

  // console.log(randominterval)
for(let i=0; i< 100 ; i++){
    particles.push(new particle ({
        position :{
            x: Math.random()* canvas.width ,
            y: Math.random()* canvas.height
        },
        velocity :{
            x : 0, 
            y: 0.4
        },
        radius :  Math.random()* 3,
        color : "white"
    }))
}
function createexplosions({object , color , fades}){
    
    for(let i=0; i< 10 ; i++){
        particles.push(new particle ({
            position :{
                x: object.position.x + object.width/2,
                y: object.position.y + object.height/2
            },
            velocity :{
                x : (Math.random () - 0.5)*2 , 
                y: (Math.random() - 0.5)*2
            },
            radius :  Math.random()* 3,
            color : color || "#BAA0DE" , 
            fades
        }))
    }
}

function animate() {
    if(! game.active) return
    requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0,0,canvas.width , canvas.height)
    particles.forEach((particle , i ) => {
        if( particle.position.y - particle.radius >= canvas.height){
            particle.position.x = Math.random()* canvas.width 
            particle.position.y = Math.random()* canvas.height
        }
        if(particle.opacity<=0){
        setTimeout(() => {
            particles.splice(i, 1) 
        }, 0) }
        else{
         particle.update()
        }
    })

    player.update()
    invaderprojectiles.forEach((invaderprojectile , index) => {

        
        if(invaderprojectile.position.y + invaderprojectile.height >= canvas.height ){
            setTimeout(() => {
                invaderprojectiles.splice(index , 1)
            }, 0)
        }else 
        invaderprojectile.update()

        // splice out player 
        if(invaderprojectile.position.y + invaderprojectile.height >= player.position.y && 
            invaderprojectile.position.x + invaderprojectile.width >= player.position.x && 
            invaderprojectile.position.x <= player.position.x + player.width ){

                setTimeout(() => {
                    invaderprojectiles.splice(index , 1)
                    player.opacity =0
                    game.over = true
                }, 0)
                setTimeout(() => {
                   game.active = false
                }, 2000)


                createexplosions({ 
                    object : player ,
                    color : 'white' , 
                    fades : true
                })
                console.log('you lose ')
            }
    })
  
     projectiles.forEach((projectile , index) => {
         if(projectile.position.y + projectile.radius <=0 ){
             setTimeout(() => {
                projectiles.splice(index, 1)
             }, 0);
                 
         }else{
             projectile.update()
         }
         projectile.update()

     })
 
     grids.forEach((grid) => {
         grid.update()
         // spawn projectiles 
         if(frames %100 ===0 && grid.invaders.length>0){
             grid.invaders[Math.floor(Math.random()* grid.invaders.length)].shoot(invaderprojectiles)

         }
         grid.invaders.forEach((invader , i)=> {
             invader.update({velocity : grid.velocity})
             projectiles.forEach((projectile , j) => {
                 if( projectile.position.y - projectile.radius <= invader.position.y + invader.height
                    && projectile.position.x + projectile.radius >=invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y ){

                        
                     setTimeout( () => {
                         const invaderfound = grid.invaders.find((invader2 ) =>{
                             return invader2 === invader
                         })
                         const projectilefound = projectiles.find((projectile2 ) =>{
                           
                            return projectile2 === projectile
                        })
                        // eleminate the invaders 
                        if(invaderfound && projectilefound){
                           
                            
                            score+= 100
                            console.log(score)
                            scoreEl.innerHTML = score
                            createexplosions({
                                object : invader , 
                                fades : true
                            })
                         grid.invaders.splice(i,1);
                         projectiles.splice(j,1);
                        }

                        if(grid.invaders.length>0){
                            const firstinvader= grid.invaders[0];
                            const lastinvader = grid.invaders[grid.invaders.length -1 ];
                            grid.width = lastinvader.position.x -  firstinvader.position.x +lastinvader.width  ;
                            grid.position.x = firstinvader.position.x
                        }

                     },0)
                 }
             })


         })  
     })
   
    if(keys.a.pressed && player.position.x>=0){
        player.velocity.x = -7
        player.rotation = -0.15
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width){
        player.velocity.x = 7
        player.rotation = 0.15

    }
     else {
        player.velocity.x = 0
        player.rotation = 0
    }
   if(frames % randominterval === 0 ){
    randominterval = Math.floor(Math.random()*400 + 400)
    grids.push(new Grid())
    frames=0
   }
 //  console.log(frames)
frames ++
   
}
animate()

addEventListener('keydown' , ({key}) => {
    if(game.over)  return 
    
    switch (key){
        case 'a':
           // console.log('left')    
            keys.a.pressed = true 
            break
        case 'd':
            //console.log('right')
            keys.d.pressed= true 
            break
        case ' ':
            //console.log('space')
            projectiles.push(new projectile({
                position: {
                    x: player.position.x + player.width/2,
                    y: player.position.y
                },
                velocity: {
                    x: 0 ,
                    y: -7
            
                }

            }))
          //  console.log("projectile")
            break
    }


})

addEventListener('keyup' , ({key}) => {
    
    switch (key){
        case 'a':
           // console.log('left')    
            keys.a.pressed = false
            break
        case 'd':
           // console.log('right')
            keys.d.pressed= false 
            break
        case ' ':
             //console.log('space')
            break
    }


})

