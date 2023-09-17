addEventListener('load',go())
function go(){
    //canvas setup
    const canvas=document.getElementById('canvas1');
    const ctx=canvas.getContext('2d');
    canvas.width=800;
    canvas.height=500;
    var devlop=false;

    class InputHandler{
        constructor(game){
            this.game=game;
            window.addEventListener("keydown",e=>{
                
                if((e.key==="ArrowUp" || e.key==="ArrowDown" )&& this.game.keys.indexOf(e.key)===-1)
                    this.game.keys.push(e.key);
                else if(e.key===" ")
                    this.game.player.shoot();
                else if(e.key==="D" || e.key==="d") 
                    if(devlop===false){
                        devlop=true;
                    }
                    else{
                        devlop=false
                    }
                    
            })
            window.addEventListener("keyup",e=>{
                this.game.keys.splice(this.game.keys.indexOf(e.key),1);
                
            })
            
            

        }

    }
    class Projectile{
        constructor(game,x,y){
            this.game=game;
            this.width=10;
            this.height=3;
            this.speed=3;
            this.x=x+180;
            this.y=y+65;
            this.delated=false;

        }
        update(){
            this.x+=this.speed;
            if(this.x>0.8*this.game.width)this.delated=true;
        }
        draw(context){
            context.fillStyle="yellow";
            context.fillRect(this.x,this.y,this.width,this.height);
        }

    }
    class background{
        constructor(game){
            this.game=game;
            this.background=document.getElementById("background");
            this.framex=0;
            this.frameWidth=871.125;
            this.framexT=8*500;
            this.timer=0;
            this.speed=0.01

        }
        update(delta){
            this.timer+=delta;
            if(this.timer>41.6){//1000ms for 24 frames 
                if(this.framex<this.framexT)this.framex++;
                else{this.framex=0;}
                this.timer=0;
            }
        }
        draw(context){
            context.drawImage(this.background,this.frameWidth*this.framex/500,0,this.frameWidth,800,0,0,this.game.width,this.game.height);

        }
    }
    class Particle{

    }

    class Player{
        constructor(game){
            this.spaceShip=document.getElementById("player");
            this.game=game;
            this.width=200;
            this.height=120;
            this.x=20;
            this.y=200;
            this.speedY=5;
            this.Projectiles=[];
        }
        update(){
            if(this.game.keys.includes("ArrowDown")){
            if(this.y<400) this.y+=this.speedY;
           }
            else if(this.game.keys.includes("ArrowUp") && this.y>0)
            this.y-=this.speedY;
            // bullets
            this.Projectiles.forEach(Projectile=>{
                Projectile.update();

            });
            this.Projectiles=this.Projectiles.filter(Projectile=> !Projectile.delated);

        }
        draw(context){
            context.fillStyle="black";
            if(devlop==true)context.strokeRect(this.x,this.y,this.width,this.height);
            //context.drawImage(this.spaceShip,200,200,900,500,this.x,this.y,this.width,this.height);
            context.drawImage(this.spaceShip,0,0,220,180,this.x,this.y,this.width,this.height);
            this.Projectiles.forEach(Projectile=>{
                Projectile.draw(context);
            });
        }
        shoot(){
            if(this.game.ammo>0){
            this.Projectiles.push(new Projectile(this.game,this.x,this.y));
            this.game.ammo-=1;}
        }
    }

    class enemy{
        constructor(game){
            this.game=game;
            this.x=this.game.width;
            this.speedx=Math.random() * -1.5 -0.5;
            this.delated=false;
            this.color="red";
            
        }
        update(){
            this.x+=this.speedx;
            if(this.x+this.width<0)this.delated=true;
        }
        draw(context){
            context.fillStyle="red";
            context.fillRect(this.x,this.y,this.width,this.height);
        }
    }
    class slav extends enemy{
        constructor(game){
            super(game);
            this.width=120;
            this.height=70;
            this.lives=2;
            this.score=5;
            this.image=document.getElementById("enemy2");
            this.y=Math.random()*(this.game.height*0.9-this.height);

        }
        update(){
            this.x+=this.speedx;
            if(this.x+this.width<0)this.delated=true;

        }
        draw(context){
            context.fillStyle="red";
            if(devlop==true){context.strokeRect(this.x,this.y,this.width,this.height);
            context.fillText(this.lives,this.x,this.y);}
            context.drawImage(this.image,this.x,this.y,this.width,this.height);
        }

    }
    class Ui{
        constructor(game){
            this.game=game;
            this.color="white";
            this.ammoH=2;
            this.ammoW=1;
            this.fontSize=15;
            this.fontF="Helvetica";
        }
        update(){
            
        }
        draw(context){
            context.fillStyle=this.color;
            context.font=this.fontSize+ "px " +this.fontF;
            context.fillText("score ="+this.game.score,20,15);
            context.fillText("Time: "+ (this.game.gameTimer*0.001).toFixed(1),20,60);
            let winMsg="Congractulations";
            let lossMsg="You_Lose."

            for(let i=0;i<this.game.ammo;i++)
                context.fillRect(20+5*i,20,2,20);
            if(this.game.gameOver){
                if(this.game.score>=this.game.target){
                    context.fillText(winMsg,this.game.width*0.5,this.game.height*0.5);
                }
                else{
                    context.fillText(lossMsg,this.game.width*0.5,this.game.height*0.5);
                }
            }
        }
    }
    class Game{
        constructor(width,height){
            this.width=width;
            this.height=height;
            this.player=new Player(this);
            this.input=new InputHandler(this);
            this.ui=new Ui(this);
            this.keys=[];
            this.enemies=[];
            //ammo
            this.ammo=20;
            this.maxAmmo=50;
            this.timer=0;
            this.timeIntervel=500;
            //enemies
            this.enemyTimer=0;
            this.enemyTimeIntervel=1500;
            //gaming
            this.gameOver=false;
            this.score=0;
            this.target=100;
            //timer
            this.gameTimer=0;
            this.gameTimeUp=100;
            //background
            this.background=new background(this);


        }
        update(delta){
            this.player.update();
            //ammo
            if(this.ammo<this.maxAmmo)
            if(this.timer>this.timeIntervel){
            this.ammo++;this.timer=0;}
            else {
                this.timer+=delta;
            }

            this.enemies.forEach(enemy=>{
                enemy.update();
                if(this.checkCollision(this.player,enemy)){
                    enemy.delated=true;
                   
                }
            this.player.Projectiles.forEach(projectile=>{
                if(this.checkCollision(projectile,enemy)){
                    projectile.delated=true;
                    if(enemy.lives==0){
                    enemy.delated=true;
                    console.log("del");
                    this.score+=enemy.score;}
                    else{enemy.lives--;}
                    
                }
            })
            })

            this.enemies=this.enemies.filter(enemy=>!enemy.delated);
            if(this.enemyTimer>this.enemyTimeIntervel && !this.gameOver){
                this.addEnemy();this.enemyTimer=0;}
            else{
                this.enemyTimer+=delta;
            }
            if(this.score>=this.target || this.gameTimer*0.001>this.gameTimeUp){
                this.gameOver=true;
                this.ammo=0;}
            else{this.gameTimer+=delta; }
            this.background.update(delta);

        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            
            this.enemies.forEach(enemy=>{
                enemy.draw(context);
            })
            this.ui.draw(context);
        }
        addEnemy(){
            this.enemies.push(new slav(this));
        }
        checkCollision(rect1, rect2){
            return(rect1.x <rect2.x 
                +rect2.width && rect1.x+rect1.width >rect2.x &&
                rect1.y < rect2.y +rect2.height && rect1.y+rect1.height >rect2.y )

        }
    }
    const game=new Game(canvas.width,canvas.height);

    let lastTime=0;

    //animation loop
    function animate(timeStamp){
        const delta= timeStamp-lastTime;
        lastTime=timeStamp;
        timeStamp++;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.update(delta);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0)

}