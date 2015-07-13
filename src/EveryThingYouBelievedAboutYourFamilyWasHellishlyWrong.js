CanyonRunner.EveryThingYouBelievedAboutYourFamilyWasHellishlyWrong = function (game) {
	
};

CanyonRunner.EveryThingYouBelievedAboutYourFamilyWasHellishlyWrong.prototype = {

	create: function () {
		this.sound = this.game.add.audioSprite('sound'); 
		this.sound.play('Ariely');
		this.sound.stop('aronara');
		//Set Background
        this.background = this.game.add.sprite(-300, 0, 'sprites', 'home-burning');
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
	    /////////////////
	    //BURN THE HOUSE
	    /////////////////
	    this.houseEmitter = this.game.add.emitter(620, 200, 400); 
	    this.houseEmitter.makeParticles('sprites', ['fire1', 'fire2', 'fire3', 'smoke-puff'] );
	    this.houseEmitter.gravity = -200;
	    this.houseEmitter.setAlpha(1, 0, 3000); 
	    this.houseEmitter.setScale(0.4, 0, 0.4, 0, 5000); 
	    this.houseEmitter.start(false, 3000, 5); 
	    this.houseEmitter.emitX = 640; 
	    this.houseEmitter.emitY = 370;

	    //////////////////
	    //CREATE PLAYER
	    //////////////////
	    this.player = this.game.add.sprite(64, 64, 'sprites', 'rocket-sprite');
	    this.player.x = 510;
	    this.player.y = 0;
	    this.player.angle = -90; 
	    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
	    ///////////////////////////////////
	    //Create Particle Jet Engine Burn
	    ///////////////////////////////////
	    this.landingEmitter = this.game.add.emitter(this.player.x, this.player.y, 400);
	    this.landingEmitter.makeParticles('sprites', ['smoke-puff'] );
	    this.landingEmitter.gravity = 20;
	    this.landingEmitter.setAlpha(1, 0, 3000);
	    this.landingEmitter.setScale(0.4, 0, 0.4, 0, 5000);
	    this.landingEmitter.start(false, 3000, 5);
	    this.landingEmitter.emitX = this.player.x - 25;
	    this.landingEmitter.emitY = this.player.y + 30;
	    //Landing Tween
		this.faceTheBurning(); 
	},

	update: function () {
    	this.landingEmitter.emitX = this.player.x + 27;
    	this.landingEmitter.emitY = this.player.y + 30; 
	},
	toggleMute: function() {
        if (!this.game.sound.mute) {
            this.game.sound.mute = true; 
            this.soundButton.tint = 16711680;
        } else {
            this.game.sound.mute = false; 
            this.soundButton.tint = 16777215;
        }
    },
	faceTheBurning: function() {
		this.bandit = this.game.add.sprite(64, 64, 'sprites',  'bandit'); 
		this.bandit.x = 750; 
		this.bandit.y = 200; 
		this.bandit.checkWorldBounds = true; 
		this.bandit.outOfBoundsKill = true; 
		this.game.add.tween(this.bandit).to({ x: -100 }, 5500, Phaser.Easing.Linear.None, true); 

		this.game.add.tween(this.player).to({ y: 440 }, 7500, Phaser.Easing.Linear.None, true);
		this.exhaustTimer = this.game.time.create(this.game); 
		this.exhaustTimer.add(7500, function(){
			this.landingEmitter.kill(); 
			if (this.bandit){
				this.bandit.kill();
			}
			this.showFinalSplashScreen(); 
		}, this); 
		this.exhaustTimer.start(); 
	},
	showFinalSplashScreen: function() {
		this.game.add.sprite(0, 0, 'sprites', 'sad-splashscreen'); 
		this.addFinalButtons(); 
	}, 
	addFinalButtons: function() {
		this.tryAgainButton = this.add.button(this.game.world.centerX - 300, this.game.world.centerY + 170, 'sprites', this.tryAgain, this, 'try-again-button', 'try-again-button', 'try-again-button');
		this.cryAboutItButton = this.add.button(this.game.world.centerX + 100, this.game.world.centerY + 170, 'sprites', this.cryAboutIt, this, 'cry-about-it-button', 'cry-about-it-button', 'cry-about-it-button');
	}, 
	tryAgain: function() {
		this.sound.stop('Ariely'); 
		this.playerStats = { topScore: 0, topTime: 0, returnPlayerToState: 'HowToPlay' }; 
        localStorage.setItem('Canyon_Runner_9282733_playerStats', JSON.stringify(this.playerStats));
        this.state.start('MainMenu'); 
	}, 
	cryAboutIt: function() {
		window.open('https://twitter.com/share?text=I+just+finished+CanyonRunner+and+the+ending+was+seriously+messed+up&hashtags=html5,games&via=zackproser', '_blank');
	}
};