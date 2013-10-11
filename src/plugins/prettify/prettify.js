/*
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * @title Prettify Plugin
 * @overview Wrapper for Google Code Prettify library: https://code.google.com/p/google-code-prettify/
 * @license wet-boew.github.io/wet-boew/License-en.html / wet-boew.github.io/wet-boew/Licence-fr.html
 * @author @patheard
 *
 * Syntax highlighting of source code snippets in an html page using [google-code-prettify](http://code.google.com/p/google-code-prettify/).
 *
 * 1. Apply `class="prettyprint"` to a `pre` or `code` element to apply syntax highlighting. Alternatively use `class="all-pre"` to apply syntax highlighting to all `pre` elements on the page.
 * 2. Apply `class="linenums"` to a `pre` or `code` element to add line numbers. Alternatively use `class="all-linenums"` to all applicable `pre` elements. Specify the starting number by adding `linenums:#` before `linenums`.
 * 3. Add extra language support by applying `class="lang-*"` to each applicable `pre` or `code` element.  Supported language syntax CSS classes are as follows:
 *    - lang-apollo
 *    - lang-clj
 *    - lang-css
 *    - lang-dart
 *    - lang-go
 *    - lang-hs
 *    - lang-lisp
 *    - lang-lua
 *    - lang-ml
 *    - lang-n
 *    - lang-proto
 *    - lang-scala
 *    - lang-sql
 *    - lang-tex
 *    - lang-vb
 *    - lang-vhdl
 *    - lang-wiki
 *    - lang-xq
 *    - lang-yaml
 */
(function( $, window, vapour ) {
"use strict";

/* 
 * Variable and function definitions. 
 * These are global to the plugin - meaning that they will be initialized once per page,
 * not once per instance of plugin on the page. So, this is a good place to define
 * variables that are common to all instances of the plugin on a page.
 */
var selector = ".wb-prettify",
	$document = vapour.doc,

	/*
	 * Plugin users can override these defaults by setting attributes on the html elements that the
	 * selector matches.
	 */
	defaults = {
		linenums: false,
		allpre: false
	},

	/*
	 * Init runs once per plugin element on the page. There may be multiple elements. 
	 * It will run more than once per plugin if you don't remove the selector from the timer.
	 * @method init
	 * @param {jQuery DOM element} $elm The plugin element being initialized
	 */
	init = function() {
		var i, len, $pre,
			$elm = $( this ),
			classes = $elm.attr( "class" ).split( " " ),
			modeJS = vapour.getMode() + ".js",
			deps = [ "site!deps/prettify" + modeJS ],

			// Merge default settings with overrides from the selected plugin element. There may be more than one, so don't override defaults globally!
			settings = $.extend( {}, defaults, $elm.data() );


		// All plugins need to remove their reference from the timer in the init sequence unless they have a requirement to be poked every 0.5 seconds
		window._timer.remove( selector );

		// Check the element for `lang-*` syntax CSS classes
		for ( i = 0, len = classes.length; i !== len; i += 1 ) {
			if ( classes[ i ].indexOf( "lang-" ) === 0 ) {
				deps.push( "site!deps/" + classes[ i ] + modeJS );
			}
		}

		// CSS class overides of settings
		settings.allpre = settings.allpre || $elm.hasClass( "all-pre" );
		settings.linenums = settings.linenums || $elm.hasClass( "linenums" );

		// Apply global settings
		if ( settings.allpre || settings.linenums ) {
			$pre = $document.find( "pre" );
			if ( settings.allpre ) {
				$pre.addClass( "prettyprint" );
			}
			if ( settings.linenums ) {
				$pre.filter( ".prettyprint" ).addClass( "linenums" );
			}
		}

		// Load the required dependencies and prettify the code once finished
		window.Modernizr.load({
			load: deps,
			complete: function() {
				$document.trigger( "prettyprint.wb-prettify" );
			}
		});
	},

	/*
	 * Invoke the Google pretty print library if it has been initialized
	 * @method prettyprint
	 */
	prettyprint = function() {
		if ( typeof window.prettyPrint === "function" ) {
			window.prettyPrint();
		}
	};

// Bind the plugin events
$document
	.on( "timerpoke.wb", selector, init )
	.on( "prettyprint.wb-prettify", prettyprint );

// Add the timer poke to initialize the plugin
window._timer.add( selector );

})( jQuery, window, vapour );
