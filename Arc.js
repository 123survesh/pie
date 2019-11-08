/*
	Dependency:
	{degToRad, addAttributes} from utilities.js
*/

var Arc = (function(){
	
	function arc(config)
	{
		/*
			a path object will have
			{
				dom, start point, end point, attributes, pathAttributes, percentToFill, percentFilled   
			}
		*/
		this.arcs = [];
		this.attributes = config.attributes;
		this.radius = config.radius;
		this.target = config.target;
	}

	function _create(config)
	{
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		var lastArc = this.arcs[this.arcs.length-1];

		var data = {
			startPoint: lastArc.endPoint,
			endPoint: null,
			attributes: config.attributes,
			pathAttributes: null,
			percentToFill: config.percentToFill,
			percentFilled: lastArc.percentToFill + lastArc.percentFilled,
		}
		_calculatePathAttributes(data);

		if(data.pathAttributes)
		{
			addAttributes(path, this.attributes);
			addAttributes(path, data.attributes);
			addAttributes(path, {'d': data.pathAttributes});
		}

		data.dom = path;

		this.arcs.push(data);
	}

	
	function _calculatePathAttributes(config)
	{
		if(config.percentToFill < 100)
		{
			if(config.percentToFill + config.percentFilled <= 100)
			{
				var angle = config.percentToFill * 3.6;
				var lineTo = new Vector2();
				lineTo.set(
					config.radius * Math.sin(degToRad(angle)), 
					config.radius * Math.cos(degToRad(angle))
					);

				var attributes = 'M '+config.startPoint.x+' '+config.startPoint.y+ ', '
								 + 'A '+config.radius+' '+config.radius+ ', '
								 + '0, 0 1, '
								 + lineTo.x+' '+lineTo.y;

				config.pathAttributes = attributes;
				config.endPoint = lineTo;
				config.percentFilled += config.percentToFill;
				// return config;
			}
		}
	}

	return arc;
})();