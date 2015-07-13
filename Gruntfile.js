module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      }, 
      dist: {
        src: ['src/*.js'], 
        dest: 'build/<%= pkg.name %>.js'
      }
    }, 
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> Copyright Zack Proser */\n'
      },
      dist: {
        files: {
          'build/<%= pkg.name %>.min.js' : ['<%= concat.dist.dest %>']
        }
      }
    }, 
    exec: {
      //Compile Final JS File
      compile: 'java -jar compiler.jar --js build/CanyonRunner.js --js_output_file build/CanyonRunner.min.js --warning_level QUIET && echo "Successfully Compiled CanyonRunner Dist Build"', 
      //Output Clean Distribution Build 
      createDistributionFolder: "mkdir -p CanyonRunner-distribution/{assets/{audio,backgrounds,sprites},build/custom,css,icons,images}", 
      //Move assets 
      copyIndex: 'cp index.html ./CanyonRunner-distribution',

      copyFavicon: 'cp ./assets/favicon.png ./CanyonRunner-distribution/assets',

      copyAudio: "cp ./assets/audio/{audio.ogg,audio.m4a,audio.json} ./CanyonRunner-distribution/assets/audio", 

      copySprites: "cp ./assets/sprites/{sprites.png,sprites.json} ./CanyonRunner-distribution/assets/sprites",

      copyBackgrounds: "cp ./assets/backgrounds/{desert-open.png,level1-background.png,level2-background.png,level3-background.png,sad-desert.png} ./CanyonRunner-distribution/assets/backgrounds", 

      copyPhaser: "cp ./build/custom/phaser-arcade-physics.min.js ./CanyonRunner-distribution/build/custom", 

      copyCanyonRunner: "cp ./build/CanyonRunner.min.js ./CanyonRunner-distribution/build",

      copyCss: "cp ./css/stylesheet.css ./CanyonRunner-distribution/css", 

      copyIcons: "cp ./icons/* ./CanyonRunner-distribution/icons", 

      copyImages: "cp ./images/* ./CanyonRunner-distribution/images"

      //Move sprites.json & sprites.png to Dist /assets/sprites

    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat'); 
  grunt.loadNpmTasks('grunt-exec'); 

  grunt.registerTask('default', ['concat', 'uglify', 'exec']);
  /*grunt.registerTask('bundle', 'Prepare Named CanyonRunner Distribution', function(name) {
    var name = grunt.option('name'); 
    console.log(name);
    grunt.task.run('concat', 'uglify', 'exec:' + name);
  });*/

};