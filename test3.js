//Main menu scene
class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
        this.active;
        this.currentScene;

        this.menu;
    }
    
    //Set assets
    preload() {
        this.load.image('titlescreen', 'assets/titlescreen.png');
        this.load.image('playbutton', 'assets/playbutton2.png');
        this.load.audio('menumusic', 'assets/wolf_music.mp3');
    }
    
    //Load assets
    create() {
        let menu = this.add.sprite(0, 0, 'titlescreen');
        let button = this.add.sprite(308, 232, 'playbutton');
        button.setScale(1, 1);

        let menumusic = this.sound.add('menumusic');
        menumusic.play();

        menu.setOrigin(0, 0);
        button.setOrigin(0, 0);

        button.setInteractive();
        button.on('pointerdown', () => this.scene.start('gameScene'));
        button.on('pointerdown', () => menumusic.stop());
    }
}


//Pause scene
class pauseScene extends Phaser.Scene {
    constructor() {
        super('pauseScene');
        this.active;
        this.currentScene;

        var pauseText;
        var controlsText;
        var clickText;
        
        this.pauseScene;
    }
    
    preload() {
        
    }
    
    create() {
        let pauseText = this.add.text(70, 130, 'Game Paused', { fontSize: '18px', fill: '#ffffff' });
        let controlsText = this.add.text(70, 230, "Click to jump - don't jump too early or you'll land on a rock!", { fontSize: '18px', fill: '#ffffff' });
        let clickText = this.add.text(70, 330, "Click anywhere to resume game", { fontSize: '18px', fill: '#ffffff' });
    }
    
    //Update function contains methods used to do actions in the game
    update() {
        
        this.input.once('pointerdown', function(event) {
            
            this.scene.resume('gameScene');
            this.scene.stop('pauseScene');
            
        }, this);
    }
}


//Game Over scene
class gameOverScene extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
        this.active;
        this.currentScene;

        var gameOverText;
        var restartText;
        
        this.gameOverScene;
    }
    
    preload() {
        
    }
    
    create() {
        let gameOverText = this.add.text(300, 220, 'GAME OVER', { fontSize: '32px', fill: '#ffffff' });
        let restartText = this.add.text(210, 310, "Reload to play again", { fontSize: '32px', fill: '#ffffff' });
        
    }
    
    update() {
        
        /*this.input.once('pointerdown', function(event) {
            
            this.scene.launch('gameScene');
            this.scene.stop('gameOverScene');
            
        }, this);*/
    }
}


//Gameplay scene
//let gameScene = new Phaser.Scene('Game');
class gameScene extends Phaser.Scene {
    constructor() {
        super('gameScene');
        
        this.ground;
        
        this.wolf;
        
        this.jump;

        this.music;

        this.test;

        this.score = 0;
        this.scoreText;
        
        this.pausebutton;
      
        this.mutebutton;

        this.gameOver;
      
        this.paused;
    }
    
    
    preload() {
        
        this.load.image('background', 'assets/sprites/background.png');
    
        this.load.image('ground', 'assets/sprites/largeplatform6.png');

        this.load.image('rock', 'assets/sprites/rock2.png');

        this.load.image('coin', 'assets/sprites/coin1.png');

        this.load.image('pausebutton', 'assets/sprites/pausebutton2.png');

        this.load.image('mutebutton', 'assets/sprites/mutebutton2.png');

        //Player character spritesheet
        //6 frames in the spritesheet - 0 to 5
        this.load.spritesheet('wolf', 'assets/sprites/wolfsheet4.png', {
            frameWidth: 90, frameHeight: 100, endFrame: 5});

        this.load.spritesheet('jump', 'assets/sprites/jumpsheet2.png', {
            frameWidth: 114, frameHeight: 100, endFrame: 2});

        //Game sounds and background music
        this.load.audio('music', 'assets/celtic_music_legend_chiptune.mp3')

        this.load.audio('jumpsound', 'assets/jumpsound.mp3')

        this.load.audio('coinsound', 'assets/coin1.mp3')

        //cursors = this.input.keyboard.createCursorKeys();
    
    }
    
    create() {
        
        let music = this.sound.add('music', true);
        music.play();

        console.log(music.play());

        var loop = music.loop;
        music.loop = true; //music will loop

        let bg = this.add.sprite(0, -580, 'background');
        bg.setOrigin(0,0);
        bg.setScale(1.5, 1.5);

        this.scoreText = this.add.text(600, 16, 'Coins: 0', { fontSize: '32px', fill: '#ffffff' }); //adds text to show score

        let pausebutton = this.add.sprite(40, 40, 'pausebutton');
        pausebutton.setScale(1.9, 1.9); //adds pause button

        let mutebutton = this.add.sprite(110, 40, 'mutebutton');
        mutebutton.setScale(1.9, 1.9); //adds mute button
        mutebutton.setInteractive();
        mutebutton.on('pointerdown', () => music.pause());
        /*mutebutton.on('pointerdown', () => music.play());*/

    /*    ground = this.add.sprite(222, 400, 'ground');*/
    /*    ground.setScale(1.5, 1.5);*/
    /*    ground = this.physics.add.staticGroup();*/
    /*    ground.create(330, 400, 'ground').setScale(1).refreshBody();*/

        //Add physics to ground so player character (wolf) can run on it 
               this.ground = this.physics.add.group({
                    key: 'ground',
                    repeat: 10,
                    setXY: {
                        x: 0,
                        y: 800,
                        stepX:  100
                    }
                });
                this.ground.children.iterate(function(child) {

                    child.setCollideWorldBounds(true);
                });

        //Max and min x positions for rock obstacles
        this.rockMaxX = 800;
        this.rockMinX = 0;

        //Animate Ground
        this.test = this.add.tileSprite(400, 525, 1000, 100, "ground");
    /*  this.test = this.add.tileSprite(400, 525, 100, 100, "rock");*/

        //Add rock obstacles
                //this.rocks = this.physics.add.group({
                this.rocks = this.physics.add.group({
                        key: 'rock',
                        repeat: 200,
                        setXY: {
                            x: 800,
                            y: 463,
                            stepX: 970
                        }
                    });
                    /*this.rocks.children.iterate(function(child) {

                        child.setCollideWorldBounds(true);
                    });*/

        //Add pickup object - coins
                this.coins = this.physics.add.group({
                        key: 'coin',
                        repeat: 200,
                        setXY: { 
                            x: 800, 
                            y: 463, 
                            stepX: 200 
                        }   
                    });


        //Add player sprite - wolf
        this.wolf = this.physics.add.sprite(10, 116, 'wolf');
        /*wolf.antiAlias = false;*/
        this.wolf.setScale(2.1, 2.1);
        this.wolf.body.setCollideWorldBounds(true);

        this.jump = this.physics.add.sprite(20, 416, 'jump');
        this.jump.setScale(2, 2);
        this.jump.visible = false;

        //Animate the wolf sprite
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('wolf', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'click',
            frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        console.log(this.ground);

        //Keeps coins on the ground
        this.coins.children.iterate(function (child) {

                //console.log(child);
                child.body.allowGravity = false;
                //gameScene.physics.add.collider(wolf, this.coins, gameScene.collectCoin(child));

        });  

        //Keeps rocks on the ground
        this.rocks.children.iterate(function (child) {

                //console.log(child);
                child.body.allowGravity = false;

        });

        //Overlap works as a collider - if the wolf sprite overlaps with another sprite, it triggers a certain method
        
        this.physics.add.overlap(this.wolf, this.coins, this.collectCoin, null, this);

        this.physics.add.overlap(this.wolf, this.rocks, this.hitRock, null, this);

        //Both wolf and ground have colliders
        this.physics.add.collider(this.wolf, this.ground);

        this.isPlayerAlive = true;
    
    }
    
    update() {
        
        /*console.log("test");*/
    
        if (!this.isPlayerAlive) {
            return;
        }

       /* wolf.anims.add('run', [0,1,2,3,4,5], 10);
        wolf.anims.add('jump', [0,1,2], 10);*/

        //Running animation
            this.wolf.anims.play('right', true);
            this.wolf.visible = true;
            //this.jump.visible = false;
            this.wolf.body.setVelocityX(0);
            this.wolf.visible = true;
            //this.jump.visible = false;

        //Jumping animation
        if (this.input.activePointer.isDown && this.wolf.body.touching.down) {
            /*jump.visible = true;
            wolf.visible = false;*/
            /*jump.anims.play('click', true);*/
            this.wolf.setVelocityY(-470);
            this.wolf.setVelocityX(4.3);
            let jumpsound = this.sound.add('jumpsound', true);
            jumpsound.play();
            /*jump.body.gravity.y = 600;*/
            /*jump.anims.play('click', true);*/
            /*console.log('jump pressed');*/
        }

        //Animate scrolling ground
        this.test.tilePositionX += 5.8;

        //console.log(rocks);

        //Set rock obstacles
        let rocks = this.rocks.getChildren();
        let numRocks = rocks.length;


        //Move rock obstacles
        for (let i = 0; i < numRocks; i++) {

            /*console.log(rocks[i].x);*/

            //rocks[i].x -= rocks[i].speed;

            rocks[i].x = rocks[i].x -4;
           

            /*if (rocks[i].x >= this.rockMax && rocks[i].speed > 0) {
                rocks[i].speed *= -1;
            } else if (rocks[i].x <= this.rockMinX && rocks[i].speed < 0) {
                rocks[i].speed *= -1;
            }*/  
            
            //if the rock x position is less than 10 reset the rock x to 700
            if (rocks[i].x < 0) {
                rocks[i].reset;
            }

        }

        //Set coins
        let coins = this.coins.getChildren();
        let numCoins = coins.length;

        //Move coins
        for (let i = 0; i < numCoins; i++) {

            /*console.log(coins[i].x);*/

            coins[i].x = coins[i].x -4;
            
            //if the coin x position is less than 0 reset the coin x to 650
            if (coins[i].x < 0) {
                coins[i].reset;
            }

        }   
        
        /*this.coins.children.iterate(function (child)) {
            if (child.x > 800)  {

                child.disableBody(true, true);
                child.enableBody(true, child.x, 0, true, true);

            }               
        }*/

        //Creates a clickable container for the pause button
        let pauseContainer = this.add.container(40, 40);
        pauseContainer.setSize(32, 32);
        pauseContainer.setInteractive();
        pauseContainer.once('pointerdown', function () {

            this.scene.pause('gameScene');
            this.scene.launch('pauseScene');
            /*this.scene.pause();
            paused = true;*/

        }, this);
        
        /*//Creates a clickable container for the mute button
        let muteContainer = this.add.container(110, 40);
        muteContainer.setSize(32, 32);
        muteContainer.setInteractive();
        muteContainer.once('pointerdown', function () {

            this.scene.launch('muteScene');

        }, this);*/
    }
        
    //Game Over function    
    gameOver() {

            //player set to dead
            this.isPlayerAlive = false;
        
            //Launch gameOverScene
            this.scene.launch('gameOverScene');

    }

    //Function for collision between wolf and rock
    hitRock(wolf, rock){

            wolf.anims.stop();
            wolf.setTint(0xff0000);
            this.gameOver()

    }

    //Function for collecting coins
    collectCoin(wolf, coin) {
        
            /*console.log("Collect coins");*/
            /*console.log(coin);*/

            coin.disableBody(true, true);
            let coinsound = this.sound.add('coinsound', true);
            coinsound.play();

            //Score increases by 1 every time a coin is collected
            this.score += 1;
            this.scoreText.setText('Coins: ' + this.score);

            /*if (coin.countActive(true) === 0)
            {
                coins.children.iterate(function (child) {

                    child.enableBody(true, child.x, 0, true, true);

                });
            }*/
    }

        
}

//Project configuration
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 650
            },
            debug: false
        }
    },
    scene: [Menu, gameScene, pauseScene, gameOverScene],
    audio: {
        disableWebAudio: false
    }
};

var game = new Phaser.Game(config);




