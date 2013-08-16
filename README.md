Grid.js
=======

Grid.js is a jQuery dynamic grid generator that supports boxes that are
1x1, 1x2, 2x1 and 2x2. It creates a full width grid using a highly efficient
algorithm to support grids with many elements with minimal performance degradation.

Usage
=======

##Init##
To create a new grid manager, create a new object:

```javascript
var grid = new GY3_Grid(object);
```

The `GY3_Grid` constructor takes an object with any of the optional following parameters:

`ideal_width` - The ideal width in pixels for the box, the box can't be guaranteed to be this wide as the grid adapts to fill its container, but it'll try and get as close as possible. *Default: `150`*

`width_tolerance` - The initial tolerance on how much larger or smaller we make each box to try and fit the current number of boxes wide the grid is. *Default: `0.05`*

`height_by_width` - The ratio of height to width that we want each box to be. *Default: `1`*

`gutter` - The distance in pixels between boxes and on the edges. *Default: `10`*

`grid_dom` - The CSS selector of the parent element of the grid. *Default: `#grid`*

`resize_fonts` - Whether or not to resize any fonts within the grid boxes based on the size of the box relative to the box's initial size. *Default: `true`*

`resize_correction` - Amount to add to the resize factor. Generally fonts end up a little small if resized directly proportional. *Default: `0.15`*

##Building##

```javascript
grid.grid_build();
```

Whenever this method is called the grid rebuilds itself. The build process consists of:

 - Calculating the width of each box and the number of boxes per row
 - Calculates the new font size factor and applies it to all grid items
 - Loops through the boxes and places them appropriately within the grid, one thing that sets Grid.js apart is that we only loop through the grid DOM once per build.

We can make the grid responsive by running this build method on window resize as such:

```javascript
$(window).resize(function() {
	grid.grid_build();
});
```

##Changing Grid Parameters##

The only other method used externally is to change the grid build parameters. Such as to change them to size the boxes differently with different window widths. That method is as follows:

```javascript
grid.set_args(object);
```

The object passed contains the same parameters as the constructor and any parameters can be changed.

##HTML##

The grid expects the following markup to work:

```html
<div id="grid">
	<div data-size="0" data-active="true">
		Box Content goes here
	</div>
	<div data-size="0" data-active="true">
		Box Content goes here
	</div>
</div>
```

The tags involved here can be anything as long as the `grid_dom` parameter points to the grid parent element.

The `data-size` attribute defines which size box to fit that element into. The options are as follows:

`0` - A 1x1 box

`1` - A 1x2 box

`2` - A 2x1 box

`3` - A 2x2 box

The `data-active` attribute can be used to toggle display of grid items. Items with this marked `false` will be hidden on the next run of `grid_build()`.

##CSS##

The grid does not do any self styling. Instead, it requires the following base styles:

```css
#grid {
    position: relative;
}
#grid > * {
    position: absolute;
    overflow: hidden;
}
```

Compatibility
=======

 - IE8+
 - WebKit and Blink Browsers
 - Firefox

Sightings in the Wild
=======

 - [Lakeshore PAWS][1]
 - [Crane + Grey][2]
 - [George Yates III][3]

Future Development Ideas
=======

 - Apply limitless box sizes, allowing any grid square width and height
 - Self style the grid DOM on initialization to remove CSS requirements
 - Add in responsive functionality natively to remove need to manually call `grid_build()` on window resize.
 - Strip out jQuery reliance

  [1]: http://www.lakeshorepaws.org
  [2]: http://www.craneandgrey.com
  [3]: http://www.georgeyatesiii.com
