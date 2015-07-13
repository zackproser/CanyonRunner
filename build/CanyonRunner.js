CanyonRunner = {
    music: null,
    /* Your game can check CanyonRunner.orientated in internal loops to know if it should pause or not */
    orientated: false
};

CanyonRunner.Boot = function (game) {

    game.state.add('Preloader', CanyonRunner.Preloader);
    game.state.add('MainMenu', CanyonRunner.MainMenu);
    game.state.add('HowToPlay', CanyonRunner.HowToPlay);
    game.state.add('NavigationSupply', CanyonRunner.NavigationSupply);
    game.state.add('NavigationBandit', CanyonRunner.NavigationBandit);
    game.state.add('NavigationHome', CanyonRunner.NavigationHome);
    game.state.add('Level1', CanyonRunner.Level1);
    game.state.add('Level2', CanyonRunner.Level2);
    game.state.add('Level3', CanyonRunner.Level3);
    game.state.add('EmotionalFulcrum', CanyonRunner.EmotionalFulcrum);
    game.state.add('HomeSweetHome', CanyonRunner.HomeSweetHome); 
    game.state.add('EveryThingYouBelievedAboutYourFamilyWasHellishlyWrong', CanyonRunner.EveryThingYouBelievedAboutYourFamilyWasHellishlyWrong);

};

CanyonRunner.Boot.prototype = {

    init: function () {

        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.setScreenSize(true);
            this.scale.refresh();
        }
        else
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.forceOrientation(true, false);
            this.scale.setResizeCallback(this.gameResized, this);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
            this.scale.setScreenSize(true);
            this.scale.refresh();
        }

    },

    preload: function () {
        //Load Texture Atlas and Tilemap
        this.game.load.atlasJSONHash('sprites', 'assets/sprites/sprites.png', 'assets/sprites/sprites.json');
        this.game.load.image('desert-open', 'assets/backgrounds/desert-open.png');
    },

    create: function () {

        this.state.start('Preloader');

    },

    gameResized: function (width, height) {

    },

    enterIncorrectOrientation: function () {

        CanyonRunner.orientated = false;

        document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function () {

        CanyonRunner.orientated = true;

        document.getElementById('orientation').style.display = 'none';

    }

};;CanyonRunner.EmotionalFulcrum = function (game) {

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

};;CanyonRunner.EveryThingYouBelievedAboutYourFamilyWasHellishlyWrong = function (game) {
	
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
};;CanyonRunner.HomeSweetHome = function (game) {
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
};;
CanyonRunner.HowToPlay = function (game) {

	this.advanceButton = null;
};

CanyonRunner.HowToPlay.prototype = {

	create: function () {

		//Show Correct How-To-Play Screen By Device Type

        if (!this.game.device.desktop){

		    this.background = this.add.sprite(0, 0, 'sprites',  'how-to-play-mobile');

        } else {

            this.background = this.add.sprite(0, 0, 'sprites', 'how-to-play-desktop');

        }

		this.advanceButton = this.add.button(350, 500, 'sprites', this.startGame, this, 'start-button', 'start-button', 'start-button');

	},

	update: function () {

	},

	startGame: function (pointer) {

		this.state.start('NavigationSupply');

	}

};
;
CanyonRunner.Level1 = function (game) {

};

CanyonRunner.Level1.prototype = {

	create: function () {

    //START MUSIC
    ///////////////////
    this.sound = this.game.add.audioSprite('sound'); 
    this.sound.play('aronara');
    //////////////////
    //SET BACKGROUND
    //////////////////
    this.background = this.game.add.tileSprite(0, -100, 2731, 800, 'desert');
    //this.background = this.game.add.sprite(0, 0, 'desert');
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
    //////////////////////////////////////
    //CREATE ROCKS GROUP
    //////////////////////////////////////
    this.lower_rocks = this.game.add.group();
    this.lower_rocks.enableBody = true;
    this.lower_rocks.createMultiple(20, 'sprites', 'rock');

    this.upper_rocks = this.game.add.group();
    this.upper_rocks.enableBody = true;
    this.upper_rocks.createMultiple(20, 'sprites', 'inverted-rock');
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
	},
    /////////////////////////////
    //TIME & PLAY WOOSHING NOISE
    /////////////////////////////
    playWoosh: function() {
        if (this.game.time.now > this.wooshTimer && !this.levelComplete) {
            this.sound.play('swoosh');
            this.wooshTimer = this.game.time.now + 4000;
        }
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
    ////////////////////////////
    //COLLISION EVENTS
    ////////////////////////////
    this.game.physics.arcade.overlap(this.player, [this.upper_rocks, this.lower_rocks], this.handleShipCollision, null, this);
    this.game.physics.arcade.overlap(this.player, this.healthkits, this.healShip, null, this);
    this.game.physics.arcade.overlap(this.missiles, [this.upper_rocks, this.lower_rocks], this.handleMissileCollision, null, this);
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
            this.lower_rocks.checkWorldBounds = true; 
        }
    }

	},
    placeBottomRock: function(x, y, speed) {

        this.score += 1;

        //Get first dead Rock of group
        var rock = this.lower_rocks.getFirstDead();

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

        //Set new position of the rock
        rock.reset(x, y);

        //Add velocity to the rock to make it move left;
        rock.body.velocity.x = -speed;
        rock.body.setSize(80, 360, 20, 0);

        //Kill the rock when it's no longer visible
        rock.checkWorldBounds = true;
        rock.outOfBoundsKill = true;

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
    addHealthKits: function() {
        var speed = Math.floor(Math.random()*200) + 100;
        var y_placement = this.game.world.centerY;

        this.placeHealthkit(800, speed, y_placement);

    },
    healShip: function() {
        if (this.health < 3) {
            ++this.health;
            this.healthkits.getFirstAlive().kill();
            this.sound.play('heal');
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
        this.sound.play('crash');
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
        this.player.body.enable = false;
        //Remove Controls
        this.fireButton.kill();
        if (!this.game.device.desktop) {
            this.buttonLeft.kill();
            this.buttonRight.kill();
            this.buttonUp.kill();
            this.buttonDown.kill();
        }    

        this.sound.stop('aronara');
        this.sound.play('success');
        this.successText = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'sprites', 'success');
        this.successText.anchor.set(0.5, 0.5);

        //Tween player ship above success text
        this.game.add.tween(this.player).to( { x: this.game.world.centerX, y: this.game.world.centerY - 150 }, 2000, Phaser.Easing.Linear.None, true);

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
            this.sound.stop('aronara');
            this.player.kill();
            this.gameOver = true;
            if (this.game.device.desktop){
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

            //Handle User Data Persistance
            this.handleUserDataGameLoss();
        }

    },
    handleUserDataGameLoss: function() {
        //Handle Player Scores and Times
        this.interval = 0; 
        this.step = this.playerStats.topScore - this.interval; 
        if (this.score > this.step) {
            this.playerStats.topScore = this.interval + this.score;
        }
        this.playerStats.topTime = this.playerStats.topTime + this.survivalTimer.seconds;
       
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
        //Handle Player Scores and Times
        this.playerStats.topScore = 50;
        this.playerStats.topTime = this.playerStats.topTime + this.survivalTimer.seconds;
        //Set Highest Level Completed by Player
        this.playerStats.returnPlayerToState = 'NavigationBandit';

        localStorage.setItem('Canyon_Runner_9282733_playerStats', JSON.stringify(this.playerStats));

        this.buttonAdvance = this.game.add.button(350, 500, 'sprites', this.nextLevel, this, 'advance-button', 'advance-button', 'advance-button');
        this.buttonAdvance.fixedToCamera = true;
    },
    nextLevel: function() {
        this.sound.stop('success');
        this.state.start('NavigationBandit');
    },
	quitGame: function (pointer) {

		this.state.start('MainMenu');

	}
};
;
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
;
CanyonRunner.Level3 = function (game) {

};

CanyonRunner.Level3.prototype = {

	create: function () {
    ///////////////////
    //START MUSIC
    ///////////////////
    this.sound = this.game.add.audioSprite('sound'); 
    this.sound.play('sonar');
    //////////////////
    //SET BACKGROUND
    //////////////////
    //this.background = this.game.add.tileSprite(0, 0, 1600, 800, 'canyon-night');
    this.background = this.game.add.tileSprite(0, 0, 1200, 700, 'dark-forest');
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
        this.playerStats = { topScore: 0, topTime: 0, returnPlayerToState: 'NavigationHome'};
    }
    //////////////////
    //CREATE PLAYER
    //////////////////
    this.player = this.game.add.sprite(64, 64, 'sprites', 'rocket-sprite');
    this.player.y = 320;
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

    //////////////////////////
    //Set Up Crash Sound Timer
    //////////////////////////
    this.crashTimer = 0; 

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
    if (this.game.device.desktop){
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
    this.debugMode = true;

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
    //////////////////////////////////////
    //CREATE ROCKS GROUP
    //////////////////////////////////////
    this.lower_rocks = this.game.add.group();
    this.lower_rocks.enableBody = true;
    this.lower_rocks.createMultiple(20, 'sprites', 'rock');

    this.upper_rocks = this.game.add.group();
    this.upper_rocks.enableBody = true;
    this.upper_rocks.createMultiple(20, 'sprites', 'inverted-rock');
    /////////////////////////
    //CREATE ASTEROIDS GROUP
    /////////////////////////
    this.asteroids = this.game.add.group();
    this.asteroids.enableBody = true;
    this.asteroids.createMultiple(20, 'sprites', 'asteroid1');

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
        this.asteroids1Loop = this.game.time.events.loop(1000, this.addAsteroids1, this);
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
    ////////////////////////////
    //COLLISION EVENTS
    ////////////////////////////
    this.game.physics.arcade.overlap(this.player, [this.upper_rocks, this.lower_rocks], this.handleShipCollision, null, this);
    this.game.physics.arcade.overlap(this.player, this.healthkits, this.healShip, null, this);
    this.game.physics.arcade.overlap(this.missiles, [this.upper_rocks, this.lower_rocks], this.handleMissileCollision, null, this);
    this.game.physics.arcade.overlap(this.player, this.asteroids, this.handleShipCollision, null, this);
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
    this.bottomTileBound = -60;
    this.topTileBound = 0;

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
        var rand1 = this.game.rnd.integerInRange(-20, 20);
        var rand2 = this.game.rnd.integerInRange(-20, 20);
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
        //Darken Rocks on this Level
        rock.tint = 7356038; 

        //Set new position of the rock
        rock.reset(x, y);

        //Add velocity to the rock to make it move left;
        rock.body.velocity.x = -speed;
        rock.body.setSize(70, 378, 50, 0);
        this.game.debug.body(rock);

        //Kill the rock when it's no longer visible
        rock.checkWorldBounds = true;
        rock.outOfBoundsKill = true;

    },
    placeUpperRock: function(x, y, speed) {

        this.score += 1;

        //Get first dead Rock of group
        var rock = this.upper_rocks.getFirstDead();
        //Darken Rocks on this Level
        rock.tint = 7356038; 
        //Set new position of the rock
        rock.reset(x, y);

        //Add velocity to the rock to make it move left;
        rock.body.velocity.x = -speed;
        rock.body.setSize(80, 360, 20, 0);

        //Kill the rock when it's no longer visible
        rock.checkWorldBounds = true;
        rock.outOfBoundsKill = true;

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
    placeAsteroid1: function(x, y, speed) {
        var asteroid = this.asteroids.getFirstDead();

        asteroid.reset(x, y);

        asteroid.body.velocity.y = speed;
        asteroid.body.setSize(64, 64, 0, 0);

        asteroid.animations.add('rotate', ['asteroid1', 'asteroid2', 'asteroid3', 'asteroid4', 'asteroid5', 'asteroid6', 'asteroid7', 'asteroid8', 'asteroid9', 'asteroid10', 'asteroid11', 'asteroid12', 'asteroid13', 'asteroid14', 'asteroid15', 'asteroid15', 'asteroid16', 'asteroid17', 'asteroid18', 'asteroid19', 'asteroid20']);
        asteroid.animations.play('rotate', 20, true);

        asteroid.checkWorldBounds = true;
        asteroid.outOfBoundsKill = true;
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
    addHealthKits: function() {
        var speed = Math.floor(Math.random()*200) + 100;
        var y_placement = this.game.world.centerY;

        this.placeHealthkit(800, speed, y_placement);

    },
    addAsteroids1: function() {
        var speed = Math.floor(Math.random()*250) + 100;
        var x_placement = Math.floor(Math.random()*100) + Math.floor(Math.random() * 800) + 1;
        var y_placement = 0;

        this.placeAsteroid1(x_placement, y_placement, speed);
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
        rock.kill()
        if (this.health <= 0) {
            this.restartGame();
        }
        this.decrementHealth();
        this.shakeWorld = 80;
        
        this.sound.play('crash');
        
        if (this.game.device.desktop){
            this.scrapEmitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 100);
            this.scrapEmitter.makeParticles('sprites',  ['scrap1', 'scrap2', 'scrap3', 'scrap4'] );
            this.scrapEmitter.gravity = 400;
            this.scrapEmitter.setAlpha(1, 0, 4000);
            this.scrapEmitter.start(true, 2000, 4);
            this.scrapEmitter.emitX = this.player.x;
            this.scrapEmitter.emitY = this.player.y;
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
            if (this.game.device.desktop){
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
        //Kill Sonar Ping Sound
        this.sound.stop('sonar');
        //Play Success Music
        this.sound.play('success');
        //Kill Loops
        this.game.time.events.remove(this.lowerRocksLoop);
        this.game.time.events.remove(this.upperRocksLoop);
        this.game.time.events.remove(this.healthKitsLoop);
        this.game.time.events.remove(this.asteroids1Loop);
        //Remove controls
        this.fireButton.kill();
        if (!this.game.device.desktop) {
            this.buttonLeft.kill();
            this.buttonRight.kill();
            this.buttonUp.kill();
            this.buttonDown.kill();
        }    
        //Stop Player From Interacting With Objects
        this.player.body.enable = false;
        this.successText = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'sprites', 'success');
        this.successText.anchor.set(0.5, 0.5);
        //Tween player ship above success text
        this.game.add.tween(this.player).to( { x: this.game.world.centerX, y: this.game.world.centerY - 150 }, 2000, Phaser.Easing.Linear.None, true);
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
            
            this.sound.stop('sonar');     
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

            //Handle User Data Persistance
            this.handleUserDataGameLoss();
        }

    },
    handleUserDataGameLoss: function() {
        //Handle Player Scores and Times
        this.interval = 100; 
        this.step = this.playerStats.topScore - this.interval; 
        if (this.score > this.step) {
            this.playerStats.topScore = this.interval + this.score;
        }
        this.playerStats.topTime = this.playerStats.topTime + this.survivalTimer.seconds;
        this.playerStats.returnPlayerToState = 'NavigationHome';
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
        this.playerStats.topScore = 150;
        this.playerStats.topTime = this.playerStats.topTime + this.survivalTimer.seconds;
        //Set Highest Level Completed by Player
        this.playerStats.returnPlayerToState = 'NavigationSupply';

        localStorage.setItem('Canyon_Runner_9282733_playerStats', JSON.stringify(this.playerStats));
        //Place Advance To Next Level Button
        this.buttonAdvance = this.game.add.button(350, 500, 'sprites', this.nextLevel, this, 'advance-button', 'advance-button', 'advance-button');
        this.buttonAdvance.fixedToCamera = true;
    },
    nextLevel: function() {
        this.sound.stop('success');
        this.state.start('EmotionalFulcrum');
    }, 
	quitGame: function (pointer) {

		this.state.start('MainMenu');

	}
};
;
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
;
CanyonRunner.NavigationBandit = function (game) {

	this.advanceButton = null;
};

CanyonRunner.NavigationBandit.prototype = {

	create: function () {
		//Load Audio
		this.sound = this.game.add.audioSprite('sound'); 
		//Show Navigation Supply Screen
        this.background = this.add.sprite(0, 0, 'sprites', 'navigation-bandit');
        /////////////////////////////
	    //CREATE SOUND TOGGLE BUTTON
	    /////////////////////////////
	    this.mute = false;
	    this.soundButton = this.game.add.button(this.game.world.centerX + 240, this.game.world.centerY -290, 'sprites', this.toggleMute, this, 'sound-icon', 'sound-icon', 'sound-icon');
	    this.soundButton.fixedToCamera = true;
	    if (!this.game.sound.mute){
	        this.soundButton.tint = 16777215;
	    } else {
	        this.soundButton.tint = 16711680;
	    }
		this.advanceButton = this.add.button(320, 500, 'sprites', this.startGame, this, 'start-button', 'start-button', 'start-button');


		//Set Content
		this.content = [
			" ",
			"Scans of This Canyon Reveal Hostile Activity",
			"Bandits Here Are Famed For Their Violence",
			"You Will Kill Or You Will Be Killed...",
			"Your Children Are Starving and Terrified..."
		];
		this.index = 0;
		this.line = '';

		//Show Specific Level Objective Text
		this.level1ObjectiveTextStyle = { font: "35px Helvetica", fill: "#05c619", stroke: "#000", strokeThickness: 10, align: "center" };
        this.text = this.game.add.text(this.game.world.centerX - 350, this.game.world.centerY -275, this.level1ObjectiveTextString, this.level1ObjectiveTextStyle);

		//Loop Sonar Sound on This Screen
		this.sound.play('sonar');

		this.nextLine();
	},

	updateLine: function() {
		if (this.line.length < this.content[this.index].length) {
			this.line = this.content[this.index].substr(0, this.line.length + 1);
			this.text.setText(this.line);
		} else {
			this.game.time.events.add(Phaser.Timer.SECOND * 2, this.nextLine, this);
		}

	},
	nextLine: function() {
		this.index++;
		if (this.index < this.content.length) {
			this.line = '';
			this.game.time.events.repeat(80, this.content[this.index].length + 1, this.updateLine, this);
		}
	},
	update: function () {
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
	startGame: function (pointer) {

		this.sound.stop('sonar');
		this.state.start('Level2');

	}

};
;
CanyonRunner.NavigationHome = function (game) {

	this.advanceButton = null;
};

CanyonRunner.NavigationHome.prototype = {

	create: function () {
		this.sound = this.game.add.audioSprite('sound'); 
		//Show Navigation Supply Screen
        this.background = this.add.sprite(0, 0, 'sprites', 'navigation-home');
        /////////////////////////////
	    //CREATE SOUND TOGGLE BUTTON
	    /////////////////////////////
	    this.mute = false;
	    this.soundButton = this.game.add.button(this.game.world.centerX + 240, this.game.world.centerY -290, 'sprites', this.toggleMute, this, 'sound-icon', 'sound-icon', 'sound-icon');
	    this.soundButton.fixedToCamera = true;
	    if (!this.game.sound.mute){
	        this.soundButton.tint = 16777215;
	    } else {
	        this.soundButton.tint = 16711680;
	    }
		this.advanceButton = this.add.button(320, 500, 'sprites', this.startGame, this, 'start-button', 'start-button', 'start-button');
		//Set Content
		this.content = [
			" ",
			"Night Falls. You Approach Your Home Sector",
			"There Are 50 Major Spires To Avoid Here...",
			"Heavy Meteor Showers Detected In This Area",
			"You Must Obtain a Fix On Your Home Beacon",
			"Navigate Through the Storm. Ping Your Home."
		];
		this.index = 0;
		this.line = '';

		//Show Specific Level Objective Text
		this.level1ObjectiveTextStyle = { font: "35px Helvetica", fill: "#05c619", stroke: "#000", strokeThickness: 10, align: "center" };
        this.text = this.game.add.text(this.game.world.centerX - 350, this.game.world.centerY -275, this.level1ObjectiveTextString, this.level1ObjectiveTextStyle);

		//Loop Sonar Sound on This Screen
		this.sound.play('sonar');

		this.nextLine();
	},

	updateLine: function() {
		if (this.line.length < this.content[this.index].length) {
			this.line = this.content[this.index].substr(0, this.line.length + 1);
			this.text.setText(this.line);
		} else {
			this.game.time.events.add(Phaser.Timer.SECOND * 2, this.nextLine, this);
		}

	},
	nextLine: function() {
		this.index++;
		if (this.index < this.content.length) {
			this.line = '';
			this.game.time.events.repeat(80, this.content[this.index].length + 1, this.updateLine, this);
		}
	},
	update: function () {
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
	startGame: function (pointer) {

		this.sound.stop('sonar');
		this.state.start('Level3');

	}

};
;
CanyonRunner.NavigationSupply = function (game) {

	this.advanceButton = null
};

CanyonRunner.NavigationSupply.prototype = {

	create: function () {
		this.sound = this.game.add.audioSprite('sound'); 
		//Show Navigation Supply Screen
        this.background = this.add.sprite(0, 0, 'sprites', 'navigation-supply');
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
		this.advanceButton = this.add.button(320, 500, 'sprites', this.startGame, this, 'start-button', 'start-button', 'start-button');

		//Set Content
		this.content = [
			" ",
			"Race Your Supplies Home to Your Family",
			"Scans of This Canyon Reveal 50 Major Spires",
			"Your Family Is Counting on You to Return..."
		];
		this.index = 0;
		this.line = '';

		//Show Specific Level Objective Text
		this.level1ObjectiveTextStyle = { font: "35px Helvetica", fill: "#05c619", stroke: "#000", strokeThickness: 10, align: "center" };
        this.text = this.game.add.text(this.game.world.centerX - 350, this.game.world.centerY -275, this.level1ObjectiveTextString, this.level1ObjectiveTextStyle);

		//Loop Sonar Sound on This Screen
		this.sound.play('sonar');

		this.nextLine();
	},
	updateLine: function() {
		if (this.line.length < this.content[this.index].length) {
			this.line = this.content[this.index].substr(0, this.line.length + 1);
			this.text.setText(this.line);
		} else {
			this.game.time.events.add(Phaser.Timer.SECOND * 2, this.nextLine, this);
		}

	},
	nextLine: function() {
		this.index++;
		if (this.index < this.content.length) {
			this.line = '';
			this.game.time.events.repeat(80, this.content[this.index].length + 1, this.updateLine, this);
		}
	},
	update: function () {
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
	startGame: function (pointer) {

		this.sound.stop('sonar');
		this.state.start('Level1');

	}

};
;
CanyonRunner.Preloader = function (game) {

	this.ready = false;
};

CanyonRunner.Preloader.prototype = {

	preload: function () {
		
		this.background = this.add.sprite(0, 0, 'desert-open');
		this.splashscreen = this.add.sprite(0, 0, 'sprites', 'canyon-runner-splash');

	 	this.preloadBar = this.add.sprite(this.game.world.centerX - 127.5, this.game.world.centerY, 'sprites', 'progress');
        this.load.setPreloadSprite(this.preloadBar);

		this.game.load.image('desert-open', 'assets/backgrounds/desert-open.png');		
		this.game.load.image('sad-desert', 'assets/backgrounds/sad-desert.png');
		this.game.load.image('dark-forest', 'assets/backgrounds/level3-background.png');
		this.game.load.image('desert', 'assets/backgrounds/level1-background.png');
		this.game.load.image('desert2', 'assets/backgrounds/level2-background.png');	
	
		//AudioSprites
		if (this.game.device.firefox || this.game.device.chrome || this.game.device.chromeOS) {

			this.game.load.audiosprite('sound', 'assets/audio/audio.ogg', 'assets/audio/audio.json');

		} else {

			this.game.load.audiosprite("sound", 'assets/audio/audio.m4a', 'assets/audio/audio.json'); 
		}
	},	
		

	create: function () {

		this.preloadBar.cropEnabled = false;

	},

	update: function () {

		if (this.cache.isSoundDecoded('sound') && this.ready == false)
		{
			this.state.start('MainMenu');
		}

	}

};
