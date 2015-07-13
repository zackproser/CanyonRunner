CanyonRunner.HomeSweetHome = function (game) {
};

CanyonRunner.HomeSweetHome.prototype = {

	create: function () {
		this.sound = this.game.add.audioSprite('sound'); 
		this.sound.play('3rdBallad');
		//Set Background
        this.background = this.game.add.sprite(-300, 0, 'sprites',  'home-burning');
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
	    /////////////////
	    //FIRE THE CHIMNEY
	    /////////////////
	    this.houseEmitter = this.game.add.emitter(0, 0, 400); 
	    this.houseEmitter.makeParticles('sprites',  ['smoke-puff'] );
	    this.houseEmitter.gravity = -800;
	    this.houseEmitter.setAlpha(1, 0, 9000); 
	    this.houseEmitter.setScale(0.2, 0.5, 0.2, 0.5, 0); 
	    this.houseEmitter.start(false, 3000, 5); 
	    this.houseEmitter.emitX = 675; 
	    this.houseEmitter.emitY = 300;
	    //////////////////
	    //CREATE PLAYER
	    //////////////////
	    this.player = this.game.add.sprite(64, 64, 'sprites',  'rocket-sprite');
	    this.player.x = 510;
	    this.player.y = 0;
	    this.player.angle = -90; 
	    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
	    ///////////////////////////////////
	    //Create Particle Jet Engine Burn
	    ///////////////////////////////////
	    this.landingEmitter = this.game.add.emitter(this.player.x, this.player.y, 400);
	    this.landingEmitter.makeParticles('sprites',  ['smoke-puff'] );
	    this.landingEmitter.gravity = 20;
	    this.landingEmitter.setAlpha(1, 0, 3000);
	    this.landingEmitter.setScale(0.4, 0, 0.4, 0, 5000);
	    this.landingEmitter.start(false, 3000, 5);
	    this.landingEmitter.emitX = this.player.x - 25;
	    this.landingEmitter.emitY = this.player.y + 30;
	    //Landing Tween
		this.homeComing(); 
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
	homeComing: function() {
		this.game.add.tween(this.player).to({ y: 440 }, 7500, Phaser.Easing.Linear.None, true);
		this.exhaustTimer = this.game.time.create(this.game); 
		this.exhaustTimer.add(7500, function(){
			this.landingEmitter.kill(); 
			this.showFinalSplashScreen(); 
		}, this); 
		this.exhaustTimer.start(); 
	},
	showFinalSplashScreen: function() {
		this.game.add.sprite(0, 0, 'sprites', 'happy-splashscreen'); 
		this.addFinalButtons(); 
	}, 
	addFinalButtons: function() {
		this.tryAgainButton = this.add.button(this.game.world.centerX - 300, this.game.world.centerY + 170, 'sprites', this.playAgain, this, 'play-again-button', 'play-again-button', 'play-again-button');
		this.cryAboutItButton = this.add.button(this.game.world.centerX + 100, this.game.world.centerY + 170, 'sprites', this.cryAboutIt, this, 'share-the-love-button', 'share-the-love-button', 'share-the-love-button');
	}, 
	playAgain: function() {
		this.sound.stop('sonar');
		this.sound.stop('angel');
		this.sound.stop('3rdBallad'); 
		this.playerStats = { topScore: 0, topTime: 0, returnPlayerToState: 'HowToPlay' }; 
        localStorage.setItem('Canyon_Runner_9282733_playerStats', JSON.stringify(this.playerStats));
        this.state.start('MainMenu'); 
	}, 
	cryAboutIt: function() {
		window.open('https://twitter.com/share?text=I+Ran+The+Whole+Canyon+and+Made+it+Home+Safe+Playing+CanyonRunner&hashtags=html5,games&via=zackproser', '_blank');
	}
};