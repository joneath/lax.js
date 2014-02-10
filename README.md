#Lax.js
Lax.js makes building scrolling reactive UI's easy (aka parallax). Lax works by watching the user's scroll position and calling the defined callback when the element(s) come into view. The callback method is passed the percentage of the user's scroll from the define element as a decimal (.1, .2, .3, ..., .99). This lets you define any sort of transform, top, bottom, color, background-position, etc. as the user scrolls.

##Usage
Pass the Lax constructor an object literal of jQuery selectors and callback functions to be called when the elements are visible in the user's viewport. The callback function is called with the scroll differential percentage from the current element, the current jQuery element, and the scroll event.

```javascript
var options = {};
var lax = new Lax({
	// jQuery selector: callback function
	'.move-up': function(diff, $el, e) {
		var translate = -(diff * $el.height());
	    $el.css({
      		transform: 'translate3d(0,' + translate + 'px,0)'
  		});
	},
	'.move-down': function(diff, $el, e) {
		var translate = (diff * $el.height());
	    $el.css({
      		transform: 'translate3d(0,' + translate + 'px,0)'
  		});
	},
	'.parallax-background': function(diff, $el, e) {
		var percent = diff * 100;
	    $el.css({
      		background-position: '50% ' + percent + '%'
  		});
	}
}, options);

lax.disable(); // removes scroll and resize handlers.
lax.enable(); // reinstate scroll and resize handlers.
lax.destroy(); // kill lax
```

##Options
```javascript
{
  $target: $(window), // scrolling target to watch
  watchResize: true, // Lax watches when the window is resized to recalculate the elements positions.
  resizeDelay: 100 // resize event time delay before element positions are recalculated.
}
```
