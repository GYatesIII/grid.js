function CNG_Grid(args) {
	// Defining Defaults, any of these can be passed into the args defition and that will be used instead.
	var default_width = 150; // The initial widths
	var default_tolerance = 0.05; // Percentage that we're initially ok with grid items being larger and smaller
	var default_height_by_width = 1; // The default aspect ratio of height/width
	var default_gutter = 10; // The gutter spacing between grid items
	var default_grid_dom = '#grid'; // The CSS selector for the grid container
	var default_resize_fonts = true; // Whether or not to resize the font sizes of elements in the grid
	var default_resize_correction = 0.15; // The amount to add to the resize factor, usually fonts are a little small if resized directly proportional

	// Making jQuery work in this object
	var $ = jQuery;
	// Checking if our declaration arguments are set and defining the arguments to use against those
	var input_args = typeof (args) === 'undefined' ? {} : args; // Making sure we have at least arguments
	var ideal_width = typeof (input_args.ideal_width) === 'undefined' ? default_width : input_args.ideal_width;
	var width_tolerance = typeof (input_args.width_tolerance) === 'undefined' ? default_tolerance : input_args.width_tolerance;
	var height_by_width = typeof (input_args.height_by_width) === 'undefined' ? default_height_by_width : input_args.height_by_width;
	var gutter = typeof (input_args.gutter) === 'undefined' ? default_gutter : input_args.gutter;
	var grid_dom = typeof (input_args.grid_dom) === 'undefined' ? default_grid_dom : input_args.grid_dom;
	var resize_fonts = typeof (input_args.resize_fonts) === 'undefined' ? default_resize_fonts : input_args.resize_fonts;
	var resize_correction = typeof (input_args.resize_correction) === 'undefined' ? default_resize_correction : input_args.resize_correction;
	// Setting up the initial values for all the factors of the grid
	this.grid_width = $(grid_dom).width();
	this.grid_wide = 7;
	this.grid = [];
	this.box_width = 0;
	this.box_height = 0;
	this.available_buffer = [];
	
	var self = this;

	$('*', grid_dom).each(function() {
		$(this).data('font', parseInt($(this).css('font-size'), 10));
	});
	
	// This function allows you to reset the arguments after init
	self.set_args = function(args) {
		var input_args = typeof (args) === 'undefined' ? {} : args; // Making sure we have at least arguments
		ideal_width = typeof (input_args.ideal_width) === 'undefined' ? ideal_width : input_args.ideal_width;
		width_tolerance = typeof (input_args.width_tolerance) === 'undefined' ? width_tolerance : input_args.width_tolerance;
		height_by_width = typeof (input_args.height_by_width) === 'undefined' ? height_by_width : input_args.height_by_width;
		gutter = typeof (input_args.gutter) === 'undefined' ? gutter : input_args.gutter;
		grid_dom = typeof (input_args.grid_dom) === 'undefined' ? grid_dom : input_args.grid_dom;
		resize_fonts = typeof (input_args.resize_fonts) === 'undefined' ? resize_fonts : input_args.resize_fonts;
		resize_correction = typeof (input_args.resize_correction) === 'undefined' ? resize_correction : input_args.resize_correction;
	}

	// This function examines the width of the grid container and the ideal width of the boxes to set
	// how many boxes wide the grid is, the box width, and box height
	self.set_grid_size = function () {
		self.grid_width = $(grid_dom).width();

		if (self.grid_width < ideal_width + (ideal_width*width_tolerance))
		{
			self.grid_wide = 1;
			self.box_width = parseInt((self.grid_width-((self.grid_wide+1)*gutter))/self.grid_wide, 10);
			self.box_height = parseInt(self.box_width*height_by_width, 10);
			return;
		}

		self.box_width = parseInt((self.grid_width-((self.grid_wide+1)*gutter))/self.grid_wide, 10);


		var k = 0;
		while (self.box_width < ideal_width - (ideal_width*width_tolerance) || self.box_width > ideal_width + (ideal_width*width_tolerance))
		{
			if (k > 10)
			{
				width_tolerance += 0.01;
				k = 0;
			}

			if (self.box_width < ideal_width - (ideal_width*width_tolerance))
			{
				self.grid_wide--;
				self.box_width = parseInt((self.grid_width-((self.grid_wide+1)*gutter))/self.grid_wide, 10);
			}
			else
			{
				self.grid_wide++;
				self.box_width = parseInt((self.grid_width-((self.grid_wide+1)*gutter))/self.grid_wide, 10);
			}
			k++;
		}

		self.box_height = parseInt(self.box_width*height_by_width, 10);
	}

	// Here we scale down the fonts on the items in the grid to acceptable sizes for the box width
	self.resize_fonts = function ()
	{
		var resize_factor = (self.box_width/ideal_width) + resize_correction;
		$('*', grid_dom).each(function() {
			var orig_font = $(this).data('font');
			$(this).css('font-size', Math.min(parseInt(resize_factor*orig_font, 10), orig_font) + 'px');
		});
	}

	self.resize_boxes = function()
	{
		if ( self.grid_wide > 1 )
		{
			$('*[data-size="0"]', grid_dom).css({
				'width' : self.box_width + 'px',
				'height' : self.box_height + 'px'
			});

			$('*[data-size="1"]', grid_dom).css({
				'width' : self.box_width + 'px',
				'height' : (self.box_height)*2 + gutter + 'px'
			});

			$('*[data-size="2"]', grid_dom).css({
				'width' : (self.box_width*2) + gutter + 'px',
				'height' : self.box_height + 'px'
			});

			$('*[data-size="3"]', grid_dom).css({
				'width' : (self.box_width*2) + gutter + 'px',
				'height' : (self.box_height*2) + gutter + 'px'
			});
		}
		else
		{
			$('*[data-size="0"]', grid_dom).css({
				'width' : self.box_width + 'px',
				'height' : self.box_height + 'px'
			});

			$('*[data-size="1"]', grid_dom).css({
				'width' : self.box_width + 'px',
				'height' : (self.box_height*2) + gutter + 'px'
			});

			$('*[data-size="2"]', grid_dom).css({
				'width' : self.box_width + 'px',
				'height' : self.box_height + 'px'
			});

			$('*[data-size="3"]', grid_dom).css({
				'width' : self.box_width + 'px',
				'height' : (self.box_height*2) + gutter + 'px'
			});
		}
	}

	self.find_one_by_one = function ()
	{
		if (self.grid.length == 1)
		{
			self.grid[0]++;
			return [0, self.grid[0]-1];
		}

		if (self.available_buffer.length > 0)
		{
			out = self.available_buffer.shift();
			return out;
		}

		r = self.grid.min();
		c = self.grid.indexOf(r);
		self.grid[c] = r+1;
		return [c, r];
	}

	self.find_one_by_two = function ()
	{
		if (self.grid.length == 1)
		{
			self.grid[0] += 2;
			return [0, self.grid[0]-2];
		}

		if (self.available_buffer.length > 0)
		{
			for (var i = 0; i < self.available_buffer.length; i++)
			{
				var spot = self.available_buffer[i];
				var spot_below = [spot[0], spot[1]+1];

				if (self.available_buffer.indexOf(spot_below) != -1)
				{
					self.available_buffer.splice(i, 1);
					self.available_buffer.splice(self.available_buffer.indexOf(spot_below), 1);
					return spot;
				}
			}
		}

		r = self.grid.min();
		c = self.grid.indexOf(r);
		self.grid[c] = r+2;
		return [c, r];
	}

	self.find_two_by_one = function ()
	{
		var grid_copy = self.grid.slice(0);

		var i = self.grid.length;
		if (i == 1)
		{
			self.grid[0] += 1;
			return [0, self.grid[0]-1];
		}
		else if (i == 2)
		{
			if (self.grid[0] < self.grid[1])
			{
				var n = self.grid[0];
				while (n < self.grid[1])
				{
					self.available_buffer.push([0, n]);
					n++;
				}
				self.grid[0] = n+1;
				self.grid[1] = n+1;
			}
			else if (self.grid[0] > self.grid[1])
			{
				var n = self.grid[1];
				while (n < self.grid[0])
				{
					self.available_buffer.push([1, n]);
					n++;
				}
				self.grid[0] = n+1;
				self.grid[1] = n+1;
			}
			else
			{
				self.grid[0] += 1;
				self.grid[1] += 1;
			}

			return [0, self.grid.max()-1];
		}
		else
		{
			while (i > 0)
			{
				var r = grid_copy.min();
				var c = grid_copy.indexOf(r);

				if (self.grid[c+1] == self.grid[c]) {
					self.grid[c] = r+1;
					self.grid[c+1] = r+1;
					return [c, r];
				}
				else if (self.grid[c+1] < self.grid[c])
				{
					var n = self.grid[c+1];
					while (n < self.grid[c])
					{
						self.available_buffer.push([c+1, n]);

						n++;
					}
					self.grid[c] = r+1;
					self.grid[c+1] = r+1;

					return [c, r];
				} else {
					grid_copy[c] = grid_copy.max()+1;
				}

				i--;
			}
		}
	}

	self.find_two_by_two = function ()
	{
		var grid_copy = self.grid.slice(0);

		var i = self.grid.length;

		if (i == 1)
		{
			self.grid[0] += 2;
			return [0, self.grid[0]-2];
		}
		else if (i == 2)
		{
			if (self.grid[0] < self.grid[1])
			{
				var n = self.grid[0];
				while (n < self.grid[1])
				{
					self.available_buffer.push([0, n]);
					n++;
				}
				self.grid[0] = n+2;
				self.grid[1] = n+2;
			}
			else if (self.grid[0] > self.grid[1])
			{
				var n = self.grid[1];
				while (n < self.grid[0])
				{
					self.available_buffer.push([1, n]);
					n++;
				}
				self.grid[0] = n+2;
				self.grid[1] = n+2;
			}
			else
			{
				self.grid[0] += 2;
				self.grid[1] += 2;
			}

			return [0, self.grid[0]-2];
		}
		else
		{
			while (i > 0)
			{
				r = grid_copy.min();
				c = grid_copy.indexOf(r);

				if (self.grid[c+1] == self.grid[c]) {
					self.grid[c] = r+2;
					self.grid[c+1] = r+2;
					return [c, r];
				}
				else if (self.grid[c+1] < self.grid[c])
				{
					var n = self.grid[c+1];
					while (n < self.grid[c])
					{
						self.available_buffer.push([c+1, n]);

						n++;
					}
					self.grid[c] = r+2;
					self.grid[c+1] = r+2;

					return [c, r];
				} else {
					grid_copy[c] = grid_copy.max()+1;
				}

				i--;
			}
		}
	}

	self.grid_build = function()
	{	
		self.set_grid_size();
		if (resize_fonts)
			self.resize_fonts();
		self.resize_boxes();

		self.grid = [];
		for (i = 0; i < self.grid_wide; i++)
		{
			self.grid[i] = 0;
		}
		
		$(grid_dom).children('*[data-active="true"]').each(function()
		{
			var loc;
			switch ($(this).attr('data-size'))
			{
				case ('0') :
					loc = self.find_one_by_one();
					if (loc != undefined)
					{
						$(this).css('left', loc[0]*(self.box_width+gutter) + gutter);
						$(this).css('top', loc[1]*(self.box_height+gutter) + gutter);
						$(this).css('display', 'block');
					}
					break;
				case ('1') :
					loc = self.find_one_by_two();
					if (loc != undefined)
					{
						$(this).css('left', loc[0]*(self.box_width+gutter) + gutter);
						$(this).css('top', loc[1]*(self.box_height+gutter) + gutter);
						$(this).css('display', 'block');
					}
					break;
				case ('2') :
					loc = self.find_two_by_one();
					if (loc != undefined)
					{
						$(this).css('left', loc[0]*(self.box_width+gutter) + gutter);
						$(this).css('top', loc[1]*(self.box_height+gutter) + gutter);
						$(this).css('display', 'block');
					}
					break;
				case ('3') :
					loc = self.find_two_by_two();
					if (loc != undefined)
					{
						$(this).css('left', loc[0]*(self.box_width+gutter) + gutter);
						$(this).css('top', loc[1]*(self.box_height+gutter) + gutter);
						$(this).css('display', 'block');
					}
					break;
			}
		});

		$(grid_dom).height(parseInt( ( self.grid.max() * (self.box_height+gutter) ) + gutter, 10));
	}
}

/**
 * Helper function to find minimum in array
 **/
if (!Array.prototype.min)
{
	Array.prototype.min = function()
	{
		return Math.min.apply( Math, this );
	}
}

/**
 * Helper function to find maximum in array
 **/
if (!Array.prototype.max)
{
	Array.prototype.max = function()
	{
		return Math.max.apply( Math, this );
	}
}

/**
 * Adding backwards compatibility to array
 **/
if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function (searchElement /*, fromIndex */ )
	{
		"use strict";
		if (this == null)
		{
			throw new TypeError();
		}
		var t = Object(this);
		var len = t.length >>> 0;
		if (len === 0)
		{
			return -1;
		}
		var n = 0;
		if (arguments.length > 1)
		{
			n = Number(arguments[1]);
			if (n != n) { // shortcut for verifying if it's NaN
				n = 0;
			}
			else if (n != 0 && n != Infinity && n != -Infinity)
			{
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}
		if (n >= len)
		{
			return -1;
		}
		var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
		for (; k < len; k++)
		{
			if (k in t && t[k] === searchElement)
			{
				return k;
			}
		}
		return -1;
	}
}