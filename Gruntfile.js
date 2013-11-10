module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    watch: {
      coffee: {
        files: ['src/*.coffee'],
        tasks: 'coffee'
      }
    },
    coffee: {
      glob_to_multiple: {
        expand: true,
        flatten: true,
        cwd: 'src/',
        src: ['*.coffee'],
        dest: 'build/js',
        ext: '.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', 'coffee');

};