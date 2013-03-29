module.exports = function( grunt )
{
	"use strict";
	
	/* jshint -W070 */ // Allow trailing commas only in the Gruntfile
	
	grunt.initConfig({
	
		concat: {
			options: {
				process: true,
			},
			all: {
				files: {
					'lib/parchment.debug.js': [
						'src/parchment/header.txt',
						'src/lib/class.js',
						'src/lib/iff.js',
						'src/structio/intro.js',
						'src/structio/input.js',
						'src/structio/textgrid.js',
						'src/structio/api.js',
						'src/structio/outro.js',
						'src/structio/runner.js',
						'src/parchment/intro.js',
						'src/parchment/error-handling.js',
						'src/parchment/file.js',
						'src/parchment/ui.js',
						'src/parchment/library.js',
						'src/parchment/quixe.js',
						'src/parchment/ifvms.js',
						'src/parchment/gnusto.js',
						'src/parchment/outro.js',
					],
					'lib/parchment.debug.css': [
						'src/parchment/header.txt',
						'src/parchment/parchment.css',
						'src/structio/structio.css',
					],
					'lib/gnusto.debug.js': [
						'src/gnusto/header.txt',
						'src/ifvms.js/src/zvm/quetzal.js',
						'src/gnusto/remedial.js',
						'src/gnusto/engine/gnusto-engine.js',
						'src/ifvms.js/src/zvm/ui.js',
						'src/gnusto/runner.js',
					],
					'lib/quixe.debug.js': [
						'src/quixe/quixe/header.txt',
						'src/quixe/quixe/quixe.js',
						'src/quixe/quixe/gi_dispa.js',
					],
					'lib/glkote.debug.js': [
						'src/quixe/glkote/header.txt',
						'src/quixe/glkote/glkote.js',
						'src/quixe/glkote/dialog.js',
						'src/quixe/glkote/glkapi.js',
						'src/quixe/runner.js',
					],
					'lib/glkote.debug.css': [
						'src/quixe/glkote/header.txt',
						'src/quixe/media/i7-glkote.css',
						'src/quixe/media/dialog.css',
					],
					'lib/zvm.debug.js': [
						'src/ifvms.js/dist/zvm.js'
					],
				},
			},
		},
		
		jshint: {
			options: {
				// Enforcing options
				curly: true, // Require brackets for all blocks
				eqeqeq: true, // Require === and !==
				latedef: true, // require all vars to be defined before being used
				newcap: true, // require classes to begin with a capital
				strict: true, // ES5 strict mode
				undef: true, // all vars must be defined
				unused: true, // warn for unused vars
				
				// Relaxing options
				boss: true, // Allow assignments in if, return etc
				evil: true, // eval() :)
				funcscope: true, // don't complain about using variables defined inside if statements
				
				// Environment
				browser: true,
				nonstandard: true,
				predef: [
					'DEBUG',
					'module',
				],
			},
			all: [
				'Gruntfile.js'
			],
		},
		
		uglify: {
			options: {
				compress: {
					global_defs: {
						DEBUG: false,
					},
				},
				preserveComments: function( node, token ) { return (/Built/).test( token.value ); },
				report: false,
			},
			parchment: {
				files: {
					'lib/parchment.min.js': [ 'lib/parchment.debug.js' ],
					'lib/gnusto.min.js': [ 'lib/gnusto.debug.js' ],
					'lib/quixe.min.js': [ 'lib/quixe.debug.js' ],
					'lib/glkote.min.js': [ 'lib/glkote.debug.js' ],
				},
			},
			zvm: {
				options: {
					compress: {
						global_defs: {
							DEBUG: false,
							ZVM: true,
							GVM: false,
						},
					},
				},
				files: {
					'lib/zvm.min.js': [ 'lib/zvm.debug.js' ],
				}
			},
		},
	});

	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-update-submodules' );

	grunt.registerTask( 'default', [ 'update_submodules', 'concat', 'jshint', 'uglify' ] );
};