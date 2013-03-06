chunker
=======

A javascript library for processing large amounts of data without blocking the main thread for too long.

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
