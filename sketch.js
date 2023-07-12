var bg,bgImg
var runner_right,runner_left,runner_jump
var platform,platformImg,platformGroup
var coin,coinImg,coinGroup
var laser,laserImg,laserGroup
var rock,rockImg,rockGroup
var gem,gemImg,gemGroup
var gameState="play"
var score=0
var life=3
var invisibleGround
var rightKeyActive=true
var invisibleTopGround

function preload(){
bgImg=loadImage("Assets/bgmerge2.png")
 platformImg=loadImage("Assets/platform.png")
 gemImg=loadImage("Assets/gem1.png")
 laserImg=loadImage("Assets/laser1.png")
 rockImg=loadImage("Assets/rock1.png")
 coinImg=loadAnimation("Assets/c1.png","Assets/c2.png","Assets/c3.png","Assets/c4.png","Assets/c5.png","Assets/c6.png")
 runner_right=loadAnimation("Assets/b1.png","Assets/b2.png","Assets/b3.png","Assets/b4.png","Assets/b5.png",)
 runner_left=loadAnimation("Assets/b1left.png","Assets/b2left.png","Assets/b3left.png","Assets/b4left.png","Assets/b5left.png",)
 runner_jump=loadImage("Assets/b3.png")
}

function setup(){
    createCanvas(1200,600)
    bg=createSprite(600,300,1200,600)
    bg.addImage(bgImg)

    runner=createSprite(80,470,60,60)
    //runner.debug=true
    runner.setCollider("rectangle",0,0,150,runner.height)
    runner.addAnimation("runnerRight",runner_right)
    runner.addAnimation("runnerLeft",runner_left)
    runner.addImage("runnerJump",runner_jump)
    runner.scale=0.5

    platformGroup=new Group()
    coinGroup=new Group()
    laserGroup=new Group()
    rockGroup=new Group()
    gemGroup=new Group()

    invisibleGround=createSprite(20,500,30000,20)
    invisibleGround.visible=false

    invisibleTopGround=createSprite(20,90,30000,20)
    invisibleTopGround.visible=false
}

function draw(){
background(0)
drawSprites()

if(gameState==="play"){
bg.velocityX=-2
camera .position.x=runner.x
camera.position.y=runner.y
    if(bg.x<200){
        bg.x=1000
    }

    if(keyDown("right")){
      rightKeyActive=true
        runner.changeImage("runnerRight")
        runner.x+=5
    }
    if(keyDown("left")){
         rightKeyActive=false
        runner.changeImage("runnerLeft")
        runner.x-=5   
    }
    if(keyDown("up")){
        runner.velocityY=-10
        runner.changeImage("runnerJump")
    }
    if(runner.isTouching(invisibleGround)){
        if(rightKeyActive){
            runner.changeImage("runnerRight")
        }
        else{
            runner.changeImage("runnerLeft")
        }
    }
    
    
    runner.velocityY+=0.8
    runner.collide(invisibleGround)
    runner.collide(invisibleTopGround)
    spawnPlatforms()
    spawnGems()
    spawnRocks()
    spawnLaser()

    coinGroup.isTouching(runner,destroyCoin)
    gemGroup.isTouching(runner,destroyGem)
    rockGroup.isTouching(runner,destroyRock)
    //laserGroup.istouching(runner,destroyLaser)

    if(platformGroup.isTouching(runner)){
        runner.velocityY=0
        runner.collide(platformGroup)
    }
    if(laserGroup.isTouching(runner)||score<0||life<=0){
        gameState="end"
    }

}
if(gameState==="end"){
runner.destroy()
platformGroup.setVelocityXEach(0)
platformGroup.destroyEach()
coinGroup.destroyEach()
laserGroup.setVelocityXEach(0)
laserGroup.destroyEach()
gemGroup.setVelocityXEach(0)
gemGroup.destroyEach()
rockGroup.setVelocityXEach(0)
rockGroup.destroyEach()
bg.velocityX=0

gameOver()
}

textSize(15)
stroke(0)
fill (0)
strokeWeight(1)
text("SCORE :"+score,runner.x-100,runner.y-200)
text("LIFE :"+life,runner.x-100,runner.y-150)
}
function spawnPlatforms(){
    if(frameCount%100===0){
         platform=createSprite(runner.x+300,250,60,60)
         //platform.debug=true
         platform.setCollider("rectangle",0,0,80,100)
        platform.y=random (200,350)
        platform.addImage(platformImg)
        platform.scale=0.3
        platform.velocityX=-2
        platform.lifetime=600
        runner.depth=platform.depth
        runner.depth+=1
        platformGroup.add(platform)

        coin=createSprite(platform.x,platform.y-50,40,40)
        coin.addAnimation("coin",coinImg)
        coin.scale=0.15
        coin.x=platform.x
        coin.velocityX=-2
        coin.lifetime=600
        coin.depth=runner.depth
        coinGroup.add(coin)
    }
}
 function spawnGems(){
    if(frameCount%500===0){
         gem=createSprite(runner.x+600,random(200,350),60,60)
         gem.addImage(gemImg)
         gem.scale=0.15
         gem.velocityX=-2
         gem.lifetime=600
         gemGroup.add(gem)
    }
 }
 function spawnRocks(){
    if(frameCount%300===0){
        rock=createSprite(runner.x+600,500,60,60)
        rock.addImage(rockImg)
        rock.scale=0.1
        rock.velocityX=-4
        rock.lifetime=600
        rockGroup.add(rock)
    }
 }

 function spawnLaser(){
    if(frameCount%200===0){
    laser=createSprite(runner.x+600,random(200,350),60,60)
     laser.addImage(laserImg)
    laser.scale=0.1
    laser.velocityX=-12
    laser.lifetime=600
    laserGroup.add(laser)
    }
 }

 function destroyCoin(coin){
    coin.destroy()
    score+=2

 }
 function destroyGem(gem){
    gem.destroy()
    score+=5
 }
 function destroyRock(rock){
    rock.destroy()
    score-=2
    life-=1
 }

 function gameOver(){
    swal({
        title:"G A M E  O V E R ! ! !",
        text:"Better Luck Next Time.....",
        imageUrl:"Assets/Gameover.png",
        imageSize:"150x150",
        confirmButtonText:"Play Again"
    },
    function (isConfirm){
        if(isConfirm){
            location.reload()
        }
    }
    )
 }