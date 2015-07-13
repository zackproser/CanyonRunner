
CanyonRunner.Level2 = function (game) {

};

CanyonRunner.Level2.prototype = {

	create: function () {
    ///////////////////
    //START MUSIC
    ///////////////////
    this.sound = this.game.add.audioSprite('sound'); 
    this.sound.play('AngryMod');
    //////////////////
    //SET BACKGROUND
    //////////////////
    this.background = this.game.add.tileSprite(0, -100, 4464, 800, 'desert2');
    this.background.fixedToCamera = true;
    ///////////////////////
    //CREATE TOUCH GAMEPAD
    ///////////////////////
    //Only Mobile Gets Touchpad
    if (!this.game.device.desktop){
        this.buttonUp = this.game.add.button(this.game.world.centerX - 300, this.game.world.centerY + 50, 'sprites', null, this, 'up-arrow', 'up-arrow', 'up-arrow');
        this.buttonUp.fixedToCamera = true;
        this.buttonUp.onInputDown.add(function(){
            this.up = true;
        }, this);
        this.buttonUp.onInputUp.add(function(){
            this.up = false;
        }, this);

        this.buttonRight = this.game.add.button(this.game.world.centerX - 200, this.game.world.centerY + 100, 'sprites', null, this, 'right-arrow', 'right-arrow', 'right-arrow');
        this.buttonRight.fixedToCamera = true;
        this.buttonRight.onInputDown.add(function() {
            this.right = true;
        }, this);
        this.buttonRight.onInputUp.add(function(){
            this.right = false;
        }, this);

        this.buttonDown = this.game.add.button(this.game.world.centerX - 300, this.game.world.centerY + 150, 'sprites', null, this, 'down-arrow', 'down-arrow', 'down-arrow');
        this.buttonDown.fixedToCamera = true;
        this.buttonDown.onInputDown.add(function(){
            this.down = true;
        }, this);
        this.buttonDown.onInputUp.add(function(){
            this.down = false;
        }, this);

        this.buttonLeft = this.game.add.button(this.game.world.centerX - 400, this.game.world.centerY + 100, 'sprites', null, this, 'left-arrow', 'left-arrow', 'left-arrow');
        this.buttonLeft.fixedToCamera = true;
        this.buttonLeft.onInputDown.add(function(){
            this.left = true;
        }, this);
        this.buttonLeft.onInputUp.add(function(){
            this.left = false;
        }, this);
    }
     //Desktop & Mobile Get Different Firing Buttons
    if (this.game.device.desktop) {
        this.fireButton = this.game.add.button(this.game.world.centerX - 60, this.game.world.centerY - 300, 'sprites', null, this, 'fire-missile-button-desktop', 'fire-missile-button-desktop', 'fire-missile-button-desktop');        
        this.fireButton.fixedToCamera = true;
        this.fireButton.onInputDown.add(function(){
            this.fireMissile();
        }, this);
    
    } else {
        this.fireButton = this.game.add.button(this.game.world.centerX - 350, this.game.world.centerY -150, 'sprites', null, this, 'fire-missile-button-mobile', 'fire-missile-button-mobile', 'fire-missile-button-mobile');
        this.fireButton.fixedToCamera = true;
        this.fireButton.onInputDown.add(function(){
            this.fireMissile();
        }, this);
    }
    /////////////////////////////
    //CREATE SOUND TOGGLE BUTTON
    /////////////////////////////
    this.soundButton = this.game.add.button(this.game.world.centerX + 240, this.game.world.centerY -290, 'sprites', this.toggleMute, this, 'sound-icon', 'sound-icon', 'sound-icon');
    this.soundButton.fixedToCamera = true;
    if (!this.game.sound.mute){
        this.soundButton.tint = 16777215;
    } else {
        this.soundButton.tint = 16711680;
    }
    //////////////////////
    //CREATE PAUSE BUTTON
    //////////////////////
    this.pauseButton = this.game.add.sprite(this.game.world.centerX + 320, this.game.world.centerY -280, 'sprites', 'pause-button');
    this.pauseButton.inputEnabled = true;
    this.pauseButton.fixedToCamera = true;
    this.pauseButton.events.onInputUp.add(function () {
        this.game.paused = true; 
        this.pauseButton.tint = 16711680; 
    },this);
    this.game.input.onDown.add(function () {
        if(this.game.paused)this.game.paused = false;
        this.pauseButton.tint = 16777215;
    },this);
    //////////////////////
    //READ LOCAL STORAGE
    //////////////////////
    this.playerStats;
    if (localStorage.getItem('Canyon_Runner_9282733_playerStats') != null) {
        this.playerStats = JSON.parse(localStorage.getItem('Canyon_Runner_9282733_playerStats'));
    } else {
        this.playerStats = { topScore: 0, topTime: 0, returnPlayerToState: 'HowToPlay'};
    }
    //////////////////
    //CREATE PLAYER
    //////////////////
    this.player = this.game.add.sprite(64, 64, 'sprites', 'rocket-sprite');
    this.player.y = 320;

    ////////////////
    //BANDIT
    ////////////////
    this.bandit = null;
    this.banditTimer = 0;

    /////////////////////////////
    //SET UP PLAYER HEALTH TIMER
    /////////////////////////////
    this.health = 3;
    this.healthTimer = 0;

    ////////////////////////////////
    //SET UP FULL HEALTH TEXT TIMER
    ////////////////////////////////
    this.healthTextTimer = 0;

    //////////////////////////////
    //Set Up Missile Launch Timer
    //////////////////////////////
    this.missileTimer = 0;

    ////////////////////////////////////
    //Set Up Whoosh Sound Effect Timer
    ////////////////////////////////////
    this.wooshTimer = 0;

    ////////////////////////////////////
    //Set Up Missile Away Variable
    ////////////////////////////////////
    this.missilesAway = false;

    ////////////////////
    //Handle Touch Events:
    ///////////////////////
    this.player.inputEnabled = true;
    this.player.input.enableDrag(false, true, true);

    //Apply Physics to Player
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.bounce.y = 0.2;
    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(64, 34, 0, 15);

    ///////////////////////////////////
    //Create Particle Jet Engine Burn
    ///////////////////////////////////
    if (this.game.device.desktop) {
        this.emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 400);
        this.emitter.makeParticles('sprites', ['fire1', 'fire2', 'fire3', 'smoke-puff'] );
        this.emitter.gravity = 20;
        this.emitter.setAlpha(1, 0, 3000);
        this.emitter.setScale(0.4, 0, 0.4, 0, 5000);
        this.emitter.start(false, 3000, 5);
        this.emitter.emitX = this.player.x - 25;
        this.emitter.emitY = this.player.y + 30;
        this.burnEngines = true;
    }

    //////////////////////////
	//Turn off Body Debugging
    //////////////////////////
    this.debugMode = false;

    ///////////////////////////////////////////////////
    //Game Starts Not Over for Sound Effects Purposes
    ///////////////////////////////////////////////////
    this.gameOver = false;

    /////////////////////////////////////////////////////////////
    //Level Complete Variable to Check - Prevent State Collision
    /////////////////////////////////////////////////////////////
    this.levelComplete = false;
    this.handleLevelCompleteCalled = false;

    ////////////////////////////
    //Set Up Shake World Effect
    ////////////////////////////
    this.shakeWorld = 0;
    ////////////////////////////
    //BANDIT ATTACK IN PROGRESS
    ///////////////////////////
    this.banditAttackInProgress = false;
    /////////////////////////////////
    //CHECK IF ROCK PASSING HAS BEGUN
    /////////////////////////////////
    this.checkPlayerAvoidance = true;
    ////////////////////////////
    //INITIALIZE SCORE COUNTER
    ////////////////////////////
    this.score = 0;
    this.survivalTimer = this.game.time.create(this.game);
    this.survivalTimer.start();
    ////////////////////////
    //START PHYSICS SYSTEM
    ////////////////////////
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //////////////////////////
    //ATTACH CAMERA TO PLAYER
    //////////////////////////
    this.game.camera.follow(this.player);
    //////////////////////////
    //ACCEPT KEYBOARD INPUTS
    //////////////////////////
    cursors = this.game.input.keyboard.createCursorKeys();
    /////////////////////////////////
    //WIRE SPACEBAR TO FIRE MISSILE
    /////////////////////////////////
    spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceBar.onDown.add(this.fireMissile, this);
    /////////////////////
    //CREATE HEALTHKITS
    /////////////////////
    this.healthkits = this.game.add.group();
    this.healthkits.enableBody = true;
    this.healthkits.createMultiple(20, 'sprites', 'healthkit');
    ///////////////////
    //CREATE MISSILES
    ///////////////////
    this.missiles = this.game.add.group();
    this.missiles.enableBody = true;
    this.missiles.createMultiple(20, 'sprites', 'missile');

    this.banditMissiles = this.game.add.group();
    this.banditMissiles.enableBody = true;
    this.banditMissiles.createMultiple(20, 'sprites', 'bandit-missile');
    //////////////////////////////////////
    //CREATE ROCKS GROUP
    //////////////////////////////////////
    this.lower_rocks = this.game.add.group();
    this.lower_rocks.enableBody = true;
    this.lower_rocks.createMultiple(20, 'sprites', 'rock');

    this.upper_rocks = this.game.add.group();
    this.upper_rocks.enableBody = true;
    this.upper_rocks.createMultiple(20, 'sprites', 'inverted-rock');
    ////////////////////
    //CREATE BANDITS
    ////////////////////
    this.bandits = this.game.add.group();
    this.bandits.enableBody = true;
    this.bandits.createMultiple(20, 'sprites',  'bandit');
    ////////////////////////////
    //SCORING TEXT
    ////////////////////////////
    this.scoreTextStyle = { font: "25px Arial", fill: "#fff", stroke: "#000", strokeThickness: 5, align: "center" };
    this.scoreText = this.game.add.text(20, 20, "Deadly Spires Avoided:", this.scoreTextStyle);

    this.scoreCounterStyle = { font: "25px Arial", fill: "#f3f3f3", stroke: "#000", strokeThickness: 5, align: "center"};
    this.scoreCounter = this.game.add.text(290, 20, "0", this.scoreCounterStyle);
    //////////////////////////////
    //LOOPED GAME EVENTS
    //////////////////////////////
    this.lowerRocksLoop = this.game.time.events.loop(3500, this.addLowerRocks, this);
    this.upperRocksLoop = this.game.time.events.loop(4000, this.addUpperRocks, this);
    this.healthKitsLoop = this.game.time.events.loop(9000, this.addHealthKits, this);
    this.banditsLoop = this.game.time.events.loop(2000, this.banditAttack, this);
    this.banditAttackLoop = this.game.time.events.loop(4000, this.banditFireMissile, this);
	},
    /////////////////////////////
    //TIME & PLAY WOOSHING NOISE
    /////////////////////////////
    playWoosh: function() {
        if (this.game.time.now > this.wooshTimer && !this.levelComplete) {
            if (!this.mute){
                this.sound.play('swoosh');
            }
            this.wooshTimer = this.game.time.now + 4000;
        }
    },
    toggleMute: function() {
        if (!this.mute) {
            this.game.sound.mute = true; 
            this.mute = true;
            this.soundButton.tint = 16711680;
        } else {
            this.game.sound.mute = false; 
            this.mute = false;
            this.soundButton.tint = 16777215;
            
        }
    },
	update: function () {
    ///////////////////////
    //CHECK WIN CONDITIONS
    ///////////////////////
    if (this.score >= 50) {
        if (!this.handleLevelCompleteCalled) {
        this.handleLevelComplete();
        }
    }
    //////////////////////
    //START AFTERBURNERS
    //////////////////////
    if (this.burnEngines) {
        this.emitter.emitX = this.player.x - 25;
        this.emitter.emitY = this.player.y + 30;
    }

    if (this.missilesAway) {
        this.missileTrailEmitter.emitX = this.missile.x +5;
        this.missileTrailEmitter.emitY = this.missile.y +27;
    }
    if (this.banditMissilesAway) {
        this.banditMissileTrailEmitter.emitX = this.banditMissile.x + 45;
        this.banditMissileTrailEmitter.emitY = this.banditMissile.y + 27;
    }
    if (this.banditAttackInProgress) {
        this.banditShadowPlayer();
    }
    /*if (this.banditAttackInProgress) {
        this.banditEmitter.emitX = this.bandit.x - 25;
        this.banditEmitter.emitY = this.bandit.y + 30;
    }*/
    ////////////////////////////
    //COLLISION EVENTS
    ////////////////////////////
    this.game.physics.arcade.overlap(this.player, [this.upper_rocks, this.lower_rocks], this.handleShipCollision, null, this);
    this.game.physics.arcade.overlap(this.player, this.healthkits, this.healShip, null, this);
    this.game.physics.arcade.overlap(this.missiles, [this.upper_rocks, this.lower_rocks], this.handleMissileCollision, null, this);
    this.game.physics.arcade.overlap(this.player, this.bandit, this.handleBanditCollision, null, this);
    this.game.physics.arcade.overlap(this.missiles, this.bandit, this.banditHitByMissile, null, this);
    this.game.physics.arcade.overlap(this.banditMissiles, this.player, this.playerHitByMissile, null, this);
    /////////////////////////////////////////////////
    //PASSING ROCKS WHOOSHING AND INCREMENTING SCORE
    /////////////////////////////////////////////////
    if (this.checkPlayerAvoidance) {
        if (this.upper_rocks.getFirstAlive()) {
            if (this.player.x > this.upper_rocks.getFirstAlive().x) {
                //Increment Score and Play Whoosh for passing Rock
                this.playWoosh();
                this.scoreCounter.setText(this.score);
            }
        }
        if (this.lower_rocks.getFirstAlive()) {
            if (this.player.x > this.lower_rocks.getFirstAlive().x) {
                //Increment Score and Play Whoosh for passing Rock
                this.playWoosh();
                this.scoreCounter.setText(this.score);
            }
        }
    }
    ///////////////////////////////////
    //Handle Keypresses & Touch Events
    ///////////////////////////////////

    //At rest, player should not move
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    this.playerSpeed = 250;
    this.backgroundTileSpeed = 4;

    if (!this.levelComplete) {
        //Scroll background for flying appearance
        this.background.tilePosition.x -= 2;
    } else {
        this.background.tilePosition.x -= 10;
    }

    //Set Boundings for Background TileSprite
    this.bottomTileBound = -80;
    this.topTileBound = 80;

    if (cursors.left.isDown || this.left === true)
    {
        this.player.body.velocity.x = -this.playerSpeed;
        this.background.tilePosition.x += this.backgroundTileSpeed;

    }
    else if (cursors.right.isDown || this.right === true)
    {
        this.player.body.velocity.x = this.playerSpeed;
        this.background.tilePosition.x -= this.backgroundTileSpeed;

    }
    else if (cursors.up.isDown || this.up === true)
    {

        this.player.body.velocity.y = -this.playerSpeed;
        if (this.background.tilePosition.y < this.topTileBound) {
            this.background.tilePosition.y += 1;
        }

    }
    else if (cursors.down.isDown || this.down === true)
    {

        this.player.body.velocity.y = this.playerSpeed;
        if (this.background.tilePosition.y > this.bottomTileBound) {
            this.background.tilePosition.y -= 1;
        }

    }
    ////////////////////////////////////
    //SHAKE WORLD WHEN ROCKET COLLIDES
    ////////////////////////////////////
    if (this.shakeWorld > 0) {
        var rand1 = this.game.rnd.integerInRange(-20, 15);
        var rand2 = this.game.rnd.integerInRange(-20, 15);
        this.game.world.setBounds(rand1, rand2, this.game.width + rand1, this.game.height + rand2);
        this.shakeWorld--;
        if (this.healthkit){
            this.healthkit.checkWorldBounds = false;    
        }
        if (this.shakeWorld == 0) {
            this.game.world.setBounds(0, 0, this.game.width, this.game.height);
            if (this.healthkit) {
                this.healthkit.checkWorldBounds = true;
            }
        }
    }

	},
    placeBottomRock: function(x, y, speed) {

        this.score += 1;

        //Get first dead Rock of group
        var rock = this.lower_rocks.getFirstDead();
        //Tint Rock on This Level
        rock.tint = 16489839; 

        //Set new position of the rock
        rock.reset(x, y);

        //Add velocity to the rock to make it move left;
        rock.body.velocity.x = -speed;
        rock.body.setSize(70, 378, 50, 0);

        //Kill the rock when it's no longer visible
        rock.checkWorldBounds = true;
        rock.outOfBoundsKill = true;

    },
    placeUpperRock: function(x, y, speed) {

        this.score += 1;

        //Get first dead Rock of group
        var rock = this.upper_rocks.getFirstDead();
        //Tint Rock on This Level
        rock.tint = 16489839; 

        //Set new position of the rock
        rock.reset(x, y);

        //Add velocity to the rock to make it move left;
        rock.body.velocity.x = -speed;
        rock.body.setSize(80, 360, 20, 0);

        //Kill the rock when it's no longer visible
        rock.checkWorldBounds = true;
        rock.outOfBoundsKill = true;

    },
    banditAttack: function() {

        if (!this.banditAttackInProgress && this.game.time.now > this.banditTimer){
            this.banditAttackInProgress = true;
            this.banditTimer = this.game.time.now + 15000;
        } else {
            return;
        }

        this.bandit = this.game.add.sprite(64, 64, 'sprites', 'bandit');
        this.game.physics.enable(this.bandit, Phaser.Physics.ARCADE);

        this.bandit.body.bounce.y = 0.2;
        this.bandit.body.collideWorldBounds = true;
        this.bandit.body.setSize(64, 34, 0, 15);

        this.bandit.x = 730;

        this.bandit.y = this.player.y;

        //this.game.add.tween(this.bandit).to({ x: 690 }, 2000, Phaser.Easing.Linear.None, true);

        this.bandit.checkWorldBounds = false;
        this.bandit.outOfBoundsKill = false;

        this.incomingMissileAlertTextStyle = { font: "25px Arial", fill: "#ff9800", stroke: "#000", strokeThickness: 3, align: "center" };
        this.incomingMissileAlertTextString = "Incoming Missile Alert!";

        this.incomingMissileAlertText = this.game.add.text(this.player.x, this.player.y, this.incomingMissileAlertTextString, this.incomingMissileAlertTextStyle);
        //this.healthTextTimer = this.game.time.now + 1200;
        this.incomingMissileAlertTextExpiration = this.game.time.create(this.game);
        this.incomingMissileAlertTextExpiration.add(1000, function() {
            this.incomingMissileAlertText.destroy();
        }, this);
        this.incomingMissileAlertTextExpiration.start();

        this.sound.play('missile-lock');

    },
    banditFireMissile: function() {
        if (!this.banditAttackInProgress || !this.bandit) {
            return;
        }
        if (!this.mute) {
            this.sound.play('launch');
            this.sound.play('missile-lock');
        }
        this.banditMissile = this.banditMissiles.getFirstDead();
        if (this.banditMissile) {
             this.banditMissile.reset(this.bandit.x -15, this.bandit.y);
            this.banditMissile.body.velocity.x = -400;
            if (this.game.device.desktop) {
                this.banditMissileTrailEmitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 400);
                this.banditMissileTrailEmitter.makeParticles('sprites', ['fire1', 'fire2', 'fire3', 'smoke-puff'] );
                this.banditMissileTrailEmitter.gravity = 50;
                this.banditMissileTrailEmitter.setAlpha(1, 0, 3000);
                this.banditMissileTrailEmitter.setScale(0.3, 0, 0.3, 0, 2000);
                this.banditMissileTrailEmitter.start(false, 3000, 5);
                this.banditMissilesAway = true;
                this.banditMissileEmitterExpiration = this.game.time.create(this.game);
                this.banditMissileEmitterExpiration.add(1200, function() {
                    if (this.banditMissileTrailEmitter) {
                        this.banditMissileTrailEmitter.destroy();
                    }
                }, this);
                this.banditMissileEmitterExpiration.start();
            }    
        }
    },
    banditShadowPlayer: function() {
        this.bandit.y = this.player.y;
    },
    placeHealthkit: function(x, y, speed) {
        //Get first dead of Health Kit group
        this.healthkit = this.healthkits.getFirstDead();

        //Set new position of healthkit
        this.healthkit.reset(x, y);

        //Add velocity to healthkit to make it move left
        this.healthkit.body.velocity.x = -speed;

        //Kill the healthkit when no longer visible
        this.healthkit.checkWorldBounds = true;
        this.healthkit.outOfBoundsKill = true;
    },
    addLowerRocks: function() {
        var speed = Math.floor(Math.random()*200) + 200;
        var y_placement = Math.ceil(Math.random()*400) + 250;

        this.placeBottomRock(800, y_placement, speed);

    },
    addUpperRocks: function() {
        var speed = Math.floor(Math.random()*200) + 200;
        var y_placement = Math.floor(Math.random()* -149) -1;

        this.placeUpperRock(800, y_placement, speed);

    },
    addBandits: function() {
        var speed = Math.floor(Math.random()*200) + 200;
        var y_placement = Math.floor(Math.random()* -149) -1;

        this.placeBandit(800, y_placement, speed);
    },
    addHealthKits: function() {
        var speed = Math.floor(Math.random()*200) + 100;
        var y_placement = this.game.world.centerY;

        this.placeHealthkit(800, speed, y_placement);

    },
    healShip: function() {
        if (this.health < 3) {
            ++this.health;
            this.healthkits.getFirstAlive().kill();
            if (!this.mute){
                this.sound.play('heal');
            }
            if (this.game.device.desktop) {
                this.healthEmitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 100);
                this.healthEmitter.makeParticles('sprites', ['healthorb1', 'healthorb2', 'healthorb3'] );
                this.healthEmitter.gravity = 50;
                this.healthEmitter.setAlpha(1, 0, 4000);
                this.healthEmitter.start(true, 2000, 4);
                this.healthEmitter.emitX = this.player.x;
                this.healthEmitter.emitY = this.player.y;
            }
            this.handleShipTint();
        } else {
           this.fullHealthTextStyle = { font: "25px Arial", fill: "#09e000", stroke: "#000", strokeThickness: 4, align: "center" };
           this.fullHealthTextString = "Already at full health!";
           if (this.game.time.now > this.healthTextTimer) {
                 this.fullHealthText = this.game.add.text(this.player.x, this.player.y, this.fullHealthTextString, this.fullHealthTextStyle);
                 this.healthTextTimer = this.game.time.now + 1200;
                 this.healthTextExpiration = this.game.time.create(this.game);
                 this.healthTextExpiration.add(1000, function() {
                    this.fullHealthText.destroy();
                 }, this);
                 this.healthTextExpiration.start();
           }
        }
    },
     ////////////////////////////////////////////////////
    //Create Scrap Emitter for Rocket Collision Effect
    ////////////////////////////////////////////////////
    handleShipCollision: function(player, rock) {
        rock.kill(); 
        if (this.health <= 0) {
            this.restartGame();
        }
        this.decrementHealth();
        this.shakeWorld = 80;
        if (!this.mute) {
            this.sound.play('crash');
        }
        if (this.game.device.desktop) {    
            this.scrapEmitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 100);
            this.scrapEmitter.makeParticles('sprites', ['scrap1', 'scrap2', 'scrap3', 'scrap4'] );
            this.scrapEmitter.gravity = 400;
            this.scrapEmitter.setAlpha(1, 0, 4000);
            this.scrapEmitter.start(true, 2000, 4);
            this.scrapEmitter.emitX = this.player.x;
            this.scrapEmitter.emitY = this.player.y;
        }    
    },
    playerHitByMissile: function(player, missile) {
        this.restartGame();
        this.shakeWorld = 80;

        this.sound.play('explosion');
        
        missile.kill();
        if (this.banditMissileTrailEmitter){
            this.banditMissileTrailEmitter.destroy();
        }
    },
    handleMissileCollision: function(missile, rock) {
       if (this.game.device.desktop) {
           this.rockEmitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 100);
           this.rockEmitter.makeParticles('sprites', ['scrap1', 'scrap2', 'scrap3', 'scrap4'] );
           this.rockEmitter.gravity = 400;
           this.rockEmitter.setAlpha(1, 0, 4000);
           this.rockEmitter.start(true, 2000, 5);
           this.rockEmitter.emitX = missile.x;
           this.rockEmitter.emitY = missile.y;
        }
       
        this.sound.play('explosion');
       
        rock.kill();
        missile.kill();
        if (this.missileTrailEmitter) {
            this.missileTrailEmitter.destroy();
        }
    },
    handleBanditCollision: function(player, bandit) {
        if (this.health <= 0) {
            this.restartGame();
        }
        this.decrementHealth();
        this.shakeWorld = 80;

        this.sound.play('explosion');
    },
    banditHitByMissile: function(missile, bandit){
        missile.kill();
        this.destroyBandit(bandit);
        this.banditTimer = this.game.time.now + 6000;
    },
    destroyBandit: function(bandit) {
        this.banditExplosion = this.game.add.sprite(64, 64, 'sprites', 'explosion1');
        this.banditExplosion.animations.add('explode', ['explosion1', 'explosion2', 'explosion3', 'explosion4', 'explosion5', 'explosion6', 'explosion7', 'explosion8', 'explosion9', 'explosion10', 'explosion11', 'explosion12', 'explosion13', 'explosion14', 'explosion15', 'explosion16']);
        this.banditExplosion.animations.play('explode', 20);
        this.banditExplosion.x = bandit.x;
        this.banditExplosion.y = bandit.y;
        
        this.sound.play('explosion');
        
        bandit.kill();
        this.banditAttackInProgress = false;
        this.banditExplosionCleanup = this.game.time.create(this.game);
        this.banditExplosionCleanup.add(800, function() {
            this.banditExplosion.destroy();
         }, this);
        this.banditExplosionCleanup.start();
        this.banditTimer = this.game.time.now + 6000;

    },
    decrementHealth: function() {
        if (this.game.time.now > this.healthTimer) {
            this.health -= 1;
            this.healthTimer = this.game.time.now + 750;
            //Handle Damage Tinting
            this.handleShipTint();
        }
    },
    handleShipTint: function() {
        switch(this.health) {
            case 3:
                this.player.tint = 16777215;
                break;
            case 2:
                this.player.tint = 16743485;
                break;
            case 1:
                this.player.tint = 16711680;
                break;
        }
    },
    fireMissile: function() {
        if (this.game.time.now > this.missileTimer) {
            this.missileTimer = this.game.time.now + 9000;
            this.fireButton.tint = 7896446;
            this.reloadTintTimer = this.game.time.create(this.game);
            this.reloadTintTimer.add(9000, function(){
                this.fireButton.tint = 16777215;
                
                this.sound.play('missile-reload');
                
            }, this);
            this.reloadTintTimer.start();
            
            this.sound.play('launch');
            
            this.missile = this.missiles.getFirstDead();
            this.missile.reset(this.player.x + 15, this.player.y);
            this.missile.body.velocity.x = 400;
             if (this.game.device.desktop) {
                this.missileTrailEmitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 400);
                this.missileTrailEmitter.makeParticles('sprites', ['fire1', 'fire2', 'fire3', 'smoke-puff'] );
                this.missileTrailEmitter.gravity = 50;
                this.missileTrailEmitter.setAlpha(1, 0, 3000);
                this.missileTrailEmitter.setScale(0.3, 0, 0.3, 0, 2000);
                this.missileTrailEmitter.start(false, 3000, 5);
                this.missilesAway = true;
                this.missileEmitterExpiration = this.game.time.create(this.game);
                this.missileEmitterExpiration.add(1200, function() {
                    if (this.missileTrailEmitter) {
                        this.missileTrailEmitter.destroy();
                    }
                }, this);
                this.missileEmitterExpiration.start();
            }    
        } else {

            this.sound.play('negative');
        }
    },
    handleLevelComplete: function() {
        this.handleLevelCompleteCalled = true;
        this.levelComplete = true;
        //Kill Loops
        this.game.time.events.remove(this.lowerRocksLoop);
        this.game.time.events.remove(this.upperRocksLoop);
        this.game.time.events.remove(this.healthKitsLoop);
        this.game.time.events.remove(this.banditsLoop);
        this.game.time.events.remove(this.banditAttackLoop);
        //Remove Controls
        this.fireButton.kill();
        if (!this.game.device.desktop) {
            this.buttonLeft.kill();
            this.buttonRight.kill();
            this.buttonUp.kill();
            this.buttonDown.kill();
        }  
        //Stop Player From Interacting With Objects
        this.player.body.enable = false;
        //Stop Theme Music
        this.sound.stop('AngryMod');
        //Play Success Music
        this.sound.play('success');
        this.successText = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'sprites', 'success');
        this.successText.anchor.set(0.5, 0.5);
        //Tween player ship above success text
        if (this.player) {
            this.game.add.tween(this.player).to({ x: this.game.world.centerX, y: this.game.world.centerY - 150 }, 2000, Phaser.Easing.Linear.None, true);
        }
        //If bandit is attacking, make player accelerate past him
        if (this.banditAttackInProgress){
            if (this.bandit) {
                this.bandit.checkWorldBounds = true; 
                this.bandit.outOfBoundsKill = true; 
                this.game.add.tween(this.bandit).to({ x: -300, y: this.game.world.centerY + 400}, 3000, Phaser.Easing.Linear.None, true);

            }
            if (this.banditMissile) {
                this.game.add.tween(this.banditMissile).to({ x: -300, y: this.game.world.centerY + 400}, 3000, Phaser.Easing.Linear.None, true);
            }
        }
        //Save scores and Level Progress
        this.handleUserDataLevelComplete();
    },
    restartGame: function() {
        //Create Explosion Sprite & Play at Crash Site
        if (!this.levelComplete) {
            this.handleLevelCompleteCalled = true; 
            this.explosion = this.game.add.sprite(64, 64, 'sprites', 'explosion1');
            this.explosion.animations.add('explode', ['explosion1', 'explosion2', 'explosion3', 'explosion4', 'explosion5', 'explosion6', 'explosion7', 'explosion8', 'explosion9', 'explosion10', 'explosion11', 'explosion12', 'explosion13', 'explosion14', 'explosion15', 'explosion16']);
            this.explosion.animations.play('explode', 20);
            this.explosion.x = this.player.x;
            this.explosion.y = this.player.y;
            
            this.sound.play('explosion');

            this.sound.stop('AngryMod');
            this.player.kill();
            this.gameOver = true;
            if (this.game.device.desktop) {
                this.emitter.kill();
            }    
            this.sound.stop('swoosh');
            //Remove Controls
            this.fireButton.kill();
            if (!this.game.device.desktop) {
                this.buttonLeft.kill();
                this.buttonRight.kill();
                this.buttonUp.kill();
                this.buttonDown.kill();
            }  
            //Show Ending Text Then Reset Game
            this.kaboomText = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'sprites', 'kaboom');
            this.kaboomText.anchor.set(0.5, 0.5);

            //Bandit Attack In Progress? Hande Bandit & Sounds
            if (this.banditAttackInProgress) {
                if (this.bandit) {
                    this.bandit.checkWorldBounds = true; 
                    this.bandit.outOfBoundsKill = true; 
                }
                this.game.add.tween(this.bandit).to({ x: this.game.world.centerX, y: this.game.world.centerY - 700}, 3000, Phaser.Easing.Linear.None, true);
                //Clean-up Bandit Sounds
                this.sound.stop('missile-lock');
            }

            this.game.time.events.remove(this.banditAttackLoop);
            this.game.time.events.remove(this.banditsLoop);

            //Handle User Data Persistance
            this.handleUserDataGameLoss();
        }

    },
    handleUserDataGameLoss: function() {
        this.interval = 50; 
        this.step = this.playerStats.topScore - this.interval; 
        if (this.score > this.step) {
            this.playerStats.topScore = this.interval + this.score;
        }
        this.playerStats.topTime = this.playerStats.topTime + this.survivalTimer.seconds;
        this.playerStats.returnPlayerToState = 'NavigationBandit';
        localStorage.setItem('Canyon_Runner_9282733_playerStats', JSON.stringify(this.playerStats));
        //Reset Game After Pause
        this.resetTimer = this.game.time.create(this.game);
        this.resetTimer.add(4000, function(){
            this.explosion.kill();
            this.game.state.start('MainMenu');
        }, this);
        this.resetTimer.start();
    },
    handleUserDataLevelComplete: function() {
        //Handle New Scores and Times
        this.playerStats.topScore = 100;
        this.playerStats.topTime = this.playerStats.topTime + this.survivalTimer.seconds;
        //Set Highest Level Completed by Player
        this.playerStats.returnPlayerToState = 'NavigationHome';

        localStorage.setItem('Canyon_Runner_9282733_playerStats', JSON.stringify(this.playerStats));
        //Place Advance To Next Level Button

        this.buttonAdvance = this.game.add.button(350, 500, 'sprites', this.nextLevel, this, 'advance-button', 'advance-button', 'advance-button');
        this.buttonAdvance.fixedToCamera = true;
    },
    nextLevel: function() {
        this.sound.stop('success');
        this.state.start('NavigationHome');
    },
	quitGame: function (pointer) {

		this.state.start('NavigationHome');
	}
};
