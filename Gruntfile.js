module.exports = (grunt) => {
    // Config plugin
    grunt.initConfig({
        uglify: {
            build: {
                files: [
                    {
                        src: "public/javascripts/main.js",
                        dest: "build/production.js",
                    },
                ],
            },
        },
    });

    // Load plugin
    grunt.loadNpmTasks("grunt-contrib-uglify");
};
