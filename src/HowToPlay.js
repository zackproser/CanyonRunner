
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
