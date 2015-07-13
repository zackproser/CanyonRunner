CanyonRunner.EmotionalFulcrum = function (game) {

	this.angelicVoices = null;
};

CanyonRunner.EmotionalFulcrum.prototype = {

	create: function () {
		this.sound = this.game.add.audioSprite('sound'); 
    	this.sound.play('sonar'); 

		//Set Background
        this.background = this.game.add.tileSprite(0, 0, 1200, 800, 'sad-desert');
    	this.background.fixedToCamera = true;
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
	    //READ LOCAL STORAGE
	    //////////////////////
	    this.playerStats;
	    if (localStorage.getItem('Canyon_Runner_9282733_playerStats') != null) {
	        this.playerStats = JSON.parse(localStorage.getItem('Canyon_Runner_9282733_playerStats'));
	    } else {
	        this.playerStats = { topScore: 0, topTime: 0, returnPlayerToState: 'NavigationHome'};
	    }
	    //////////////////
	    //CREATE PLAYER
	    //////////////////
	    this.player = this.game.add.sprite(64, 64, 'sprites', 'rocket-sprite');
	    this.player.y = 120;
	    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
	    ///////////////////////////////////
	    //Create Particle Jet Engine Burn
	    ///////////////////////////////////
	    this.emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 400);
	    this.emitter.makeParticles('sprites', ['fire1', 'fire2', 'fire3', 'smoke-puff'] );
	    this.emitter.gravity = 20;
	    this.emitter.setAlpha(1, 0, 3000);
	    this.emitter.setScale(0.4, 0, 0.4, 0, 5000);
	    this.emitter.start(false, 3000, 5);
	    this.emitter.emitX = this.player.x - 25;
	    this.emitter.emitY = this.player.y + 30;
	    this.burnEngines = true;

	    this.descendToLearnTheTruth(); 
	},

	update: function () {

		this.emitter.emitX = this.player.x - 25;
        this.emitter.emitY = this.player.y + 30;

        if (this.landing) {
        	this.landingEmitter.emitX = this.player.x + 27;
        	this.landingEmitter.emitY = this.player.y + 30; 
        }

	    //At rest, player should not move
	    this.player.body.velocity.x = 0;
	    this.player.body.velocity.y = 0;

	    this.playerSpeed = 250;
	    this.backgroundTileSpeed = 4;

        //Scroll background for flying appearance
        if (this.slowRocket) {
        	this.background.tilePosition.x -= 4;
        	this.sound.play('sonar-found');
        } else if (this.stopRocket) {
        	this.background.tilePosition.x = 0; 
        	if (Math.floor(this.player.angle == -90)) {
    			this.stopRocket = false; 
    			this.player.angle = -90; 
    			this.rocketLanding(); 
        	}
        	this.player.angle -= 2;
        } else if (!this.landing) {
        	this.background.tilePosition.x -= 10; 
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
	descendToLearnTheTruth: function() {
		this.sound.play('sonar-found'); 
		this.homeSignatureLockedTextStyle = { font: "25px Arial", fill: "#09e000", stroke: "#000", strokeThickness: 4, align: "center" }; 
		this.homeSignatureLockedTextString = "Home Signature Detected! Calculating Landing Trajectory!"
		this.homeSignatureLockedText = this.game.add.text(this.player.x + 20, this.player.y, this.homeSignatureLockedTextString, this.homeSignatureLockedTextStyle);
		this.homeSignatureLockedTextExpiration = this.game.time.create(this.game);
		this.homeSignatureLockedTextExpiration.add(4000, function(){
			this.homeSignatureLockedText.destroy(); 
		}, this); 
		this.homeSignatureLockedTextExpiration.start();
		this.game.add.tween(this.player).to({ x: this.game.world.centerX, y: this.game.world.centerY + 100 }, 5000, Phaser.Easing.Linear.None, true);
		this.descendTimer = this.game.time.create(this.game);
        this.descendTimer.add(4900, function(){
            this.slowRocket = true; 
            this.emitter.kill();
        }, this);
        this.descendTimer.start();
        this.beginLandingTimer = this.game.time.create(this.game);
        this.beginLandingTimer.add(5300, function(){
        	this.slowRocket = false;
        	this.stopRocket = true;  
        }, this); 
        this.beginLandingTimer.start();
	},
	rocketLanding: function() {
		this.sound.stop('sonar');
		this.sound.play('angel');
		this.landing = true;
		this.landingEmitter = this.game.add.emitter(this.player.x, this.player.y, 400);
	    this.landingEmitter.makeParticles('sprites', ['smoke-puff'] );
	    this.landingEmitter.gravity = 20;
	    this.landingEmitter.setAlpha(1, 0, 3000);
	    this.landingEmitter.setScale(0.4, 0, 0.4, 0, 5000);
	    this.landingEmitter.start(false, 3000, 5);
	    this.landingEmitter.emitX = this.player.x - 25;
	    this.landingEmitter.emitY = this.player.y + 30;
	    //Landing Tween
		this.game.add.tween(this.player).to({ y: this.player.y + 350 }, 10500, Phaser.Easing.Linear.None, true);
		//Jump to Final Scene Timer
		this.showFinalSceneTimer = this.game.time.create(this.game);
		this.showFinalSceneTimer.add(10500, function(){ 
			this.sound.stop('sonar');
			this.sound.stop('angel');
			if (this.playerStats.topTime > 355) {
				this.state.start('EveryThingYouBelievedAboutYourFamilyWasHellishlyWrong');	
			} else if (this.playerStats.topTime <= 375) {
				this.state.start('HomeSweetHome'); 
			} else {
				this.state.start('EveryThingYouBelievedAboutYourFamilyWasHellishlyWrong');
			}
		}, this);	
		this.showFinalSceneTimer.start(); 
	}

};