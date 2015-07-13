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

};