
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
