
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
