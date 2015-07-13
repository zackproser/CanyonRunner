
CanyonRunner.MainMenu = function (game) {

};

CanyonRunner.MainMenu.prototype = {

	create: function () {
        this.sound = this.game.add.audioSprite('sound'); 

        //Check if Returning Player & If Has Level Progress Saved
        this.playerStats;
        if (localStorage.getItem('Canyon_Runner_9282733_playerStats') != null) {
            this.playerStats = JSON.parse(localStorage.getItem('Canyon_Runner_9282733_playerStats'));
        } else {
            this.playerStats = { topScore: 0, topTime: 0, returnPlayerToState: 'HowToPlay'};
        }
		//Load Main Menu
        this.background = this.game.add.tileSprite(0, 0, 1200, 600, 'desert-open');
        this.background.fixedToCamera = true;
		this.splashscreen = this.add.sprite(0, 0, 'sprites', 'canyon-runner-splash');

        
        this.sound.play('aronara'); 

        this.soundButton = this.game.add.button(this.game.world.centerX + 335, this.game.world.centerY -285, 'sprites', this.toggleMute, this, 'sound-icon', 'sound-icon', 'sound-icon');
        this.soundButton.fixedToCamera = true;
         if (!this.game.sound.mute) {
             this.soundButton.tint = 16777215;
        } else {
           this.soundButton.tint = 16711680;
        }
        //Read Player Stats & Display
        //this.playerStats = localStorage.getItem('Canyon_Runner_9282733_playerStats') ? JSON.parse(localStorage.getItem('Canyon_Runner_9282733_playerStats')) : { topScore: 0, topTime: 0, returnPlayerToState: 'HowToPlay'};
        if (this.playerStats.topScore > 0 && this.playerStats.topTime > 0) {
            this.playerStatTextStyle = { font: "30px Helvetica", fill: "#fff", stroke: "#000", strokeThickness: 5, align: "center" };
            this.playerStatString = "YOUR TOP SCORE: " + this.playerStats.topScore + " & YOUR TOP TIME: " + Math.round(this.playerStats.topTime);
            this.playerStatText = this.game.add.text(this.game.world.centerX - 350, this.game.world.centerY -275, this.playerStatString, this.playerStatTextStyle);
        }

		//Create Intro Player
		this.player = this.game.add.sprite(64, 64, 'sprites', 'rocket-sprite');
		this.player.y = 320;
		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.bounce.y = 0.2;
		this.player.body.collideWorldBounds = true;
		this.player.body.setSize(64, 34, 0, 15);

		 //Set up Initial Events
    	this.game.time.events.add(300, this.introFlyingScene, this);

		this.startbutton = this.add.button(350, 500, 'sprites', this.startGame, this, 'start-button', 'start-button', 'start-button');

	},

	update: function () {
        //Scroll Background
        if (!this.jetFired) {
            //Scroll background for flying appearance
            this.background.tilePosition.x -= 2;
        } else {
            this.background.tilePosition.x -= 10;
        }

		//Do an Initial Barrel Roll
	    if (this.barrelRoll) {
	        this.rollTimer = this.game.time.create(this.game);
	        this.rollTimer.add(300, function() {
	            this.player.angle += 10;
	        }, this);
	        this.rollTimer.start();
	    }

	    //Start Afterburners
	    if (this.burnEngines) {
	        this.emitter.emitX = this.player.x - 25;
	        this.emitter.emitY = this.player.y + 30;
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
	introFlyingScene: function() {

	    //Fly Rocket to Center Screen
	    this.introTween = this.game.add.tween(this.player);
    	this.introTween.to({ x: 420 }, 2000);
    	this.introTween.start();

        //Fly the ship into view and do a barrel roll
        this.introFlyingTimer = this.game.time.create(this.game);
        this.introFlyingTimer.add(1100, function(){
            //this.doABarrelRoll();
            this.hoverShipAnimation();
        }, this);
        this.introFlyingTimer.start();

        //Turn on Afterburners
        this.engineBurnTimer = this.game.time.create(this.game);
        this.engineBurnTimer.add(2000, function() {
            this.startEngines();
            this.jetFired = true;
        }, this);
        this.engineBurnTimer.start();
        this.initialPauseTimer = this.game.time.create(this.game);
        //Pause the Player
        this.initialPauseTimer.add(2500, function(){
            this.hoverShip = false;
        }, this);
        this.initialPauseTimer.start();
    },

	hoverShipAnimation: function() {
        //Temporarily pause ship above text
        this.hoverShip = true;
        this.hoverShipTimer = this.game.time.create(this.game);
        this.hoverShipTimer.add(2000, function() {
            this.hoverShip = false;
            this.player.angle = 0;
        }, this);
        this.hoverShipTimer.start();
    },

    startEngines: function() {

        //Create Particle Jet Engine Burn
        this.emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 400);
        this.emitter.makeParticles( 'sprites',['fire1', 'fire2', 'fire3', 'smoke-puff'] );
        this.emitter.gravity = 200;
        this.emitter.setAlpha(1, 0, 2000);
        this.emitter.setScale(0.4, 0, 0.4, 0, 2000);
        this.emitter.start(false, 3000, 3);
        this.burnEngines = true;
        this.sound.play('rocket-start');
    },

    doABarrelRoll: function() {
        this.barrelRoll = true;
        this.rollExpirationTimer = this.game.time.create(this.game);
        this.rollExpirationTimer.add(1200, function() {
            this.barrelRoll = false;
        }, this);
        this.rollExpirationTimer.start();
    },

	startGame: function (pointer) {

		this.sound.stop('aronara'); 
        
        //Load Proper State for Player
        this.state.start(this.playerStats.returnPlayerToState);
    }

};
