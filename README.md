chunker
=======

A javascript library for processing large amounts of data without blocking the main thread for too long.

Chunker allows you to process large sets of data in 'chunks' which will prevent
the annoying 'this script has been executing for a long time' dialog when doing
heavy computations.  To use chunker, feed any of its functions an object in 
this form:

`(Required) array`: the array to process

`(Required) fn(item)`: a function to call on each array element as you would with Array.map(fn)

`(Optional) size`: how many items to process at once

`(Optional) progress(done, total)`: a function called on completion of each chunk.
Provides two arguments; dividing the first by the second gives you the percentage complete.

`(Optional) error(err)`: a function called if an error is thrown

`(Optional) callback(result, cancelled)`: a function called upon the completion (or cancelation) of the method.


Any time you would use map/filter/forEach/every:

		var a = someArray.map(someFunc);
  
You could replace it with...

		var a;
		chunker.map(someArray, someFunc, 10, function(result) {
    		a = result;	
		});

You can stop chunking at any time using `chunker.cancel();`, which will cause the callback to be called with any 
partial results available at the time of cancelation.
