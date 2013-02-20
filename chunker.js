/*Copyright (c) 2013 Jake Scott
Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in 
	all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE. */

/*
Chunker allows you to process large sets of data in 'chunks' which will prevent
the annoying 'this script has been executing for a long time' dialog when doing
heavy computations.  To use chunker, feed any of its functions an object in 
this form:

{
	array: [...],					REQUIRED - a large array of data that you 
										want to process

	fn: function() {...},			REQUIRED - a function you would feed to 
										map/filter/forEach to apply to each 
										element

	size: 100, 						OPTIONAL - the number of items to process 
										in a single chunking. Defaults to 100.

	callback: function () {...}		OPTIONAL - a function to execute upon 
										completion of processing the array
}

Any time you would use map/filer/forEach:

		var a = someArray.map(someFunc);
  
You could replace it with...

		var a;
		chunker.map(someArray, someFunc, 10, function(result) {
    		a = result;	
		});
 */
var chunker = (function() {
	var _validateInput = function(options) {
		var array = options.array;
		var fn = options.fn;
		var missingParams = [];
		if(!array) missingParams.push("array");
		if(!fn) missingParams.push("fn");
		if(missingParams.length > 0) 
			throw "chunker.map passed an object without required params ("
				+ missingParams.join(', ') + ")";
	};

	var _chunker = {
		map: function(options) {
			var array = options.array;
			var fn = options.fn;
			var size = options.size || 50;
			var callback = options.callback || function(){};
			_validateInput(options);

			var map = [];
			var chunk = function(start, size) {
				if(start < array.length) {
					array.slice(start, start+size).forEach( function(obj) {
						map.push( fn(obj) );
					});
					setTimeout( function() {
						chunk(start+size, size);
					}, 0);
				}
				else {
					callback(map);
				} 
			}
			chunk(0, size);
		},

		filter: function(options) {
			var array = options.array;
			var fn = options.fn;
			var size = options.size || 50;
			var callback = options.callback || function(){};
			_validateInput(options);

			var filter = [];
			var chunk = function(start, size) {
				if(start < array.length) {
					array.slice(start, start+size).forEach( function(obj) {
						if(fn(obj)) 
							filter.push(obj);
					});
					setTimeout( function() {
						chunk(start+size, size);
					}, 0);
				}
				else {
					callback(filter);
				} 
			}
			chunk(0, size);
		},

		forEach: function(options) {
			var array = options.array;
			var fn = options.fn;
			var size = options.size || 50;
			var callback = options.callback || function(){};
			_validateInput(options);
			
			var chunk = function(start, size) {
				if(start < array.length) {
					array.slice(start, start+size).forEach(fn);
					setTimeout( function() {
						chunk(start+size, size);
					}, 0);
				}
				else {
					callback();
				} 
			}
			chunk(0, size);
		}
	};

	return _chunker;
})();