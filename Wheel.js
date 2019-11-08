
/*
	Need:
	color gradients
	user data  (percentage, image, )


addClasses, degToRad, updateObject from utilities.js
*/

var Wheel = (function(){
	
	var colorGrads = [
		{start: "#ff92c4", end: "#feb0a3"},
		{start: "#ffcaa0", end: "#efe692"},
		{start: "#b2ee8e", end: "#9de5ff"},
		{start: "#91c0fd", end: "#eca0ff"},
		{start: "#ff92c4", end: "#feb0a3"},
		{start: "#ffcaa0", end: "#efe692"},
		{start: "#b2ee8e", end: "#9de5ff"},
		{start: "#91c0fd", end: "#eca0ff"},
	];
	// const ARC_DEF = {
	// 	"lineCap": ,
	// 	""
	// }
	const USER_DATA_PREFIX = "UW_USER_";
	const USER_DATA_KEYS = ['image', 'percent','price'];
	const ONE_PERCENT_ANGLE = 3.6;

	function wheel(config)
	{
		this.newCanvasFlag = config.newCanvasFlag || true;
		if(this.newCanvasFlag)
		{
			this.target = config.target;
			this.cssCanvasClasses = config.cssCanvasClasses || config.cssClasses || config.classes || {};

		}
		else if(config.context)
		{
			this.context = config.context || false;
			this.origin = config.origin;
		}
		else
		{
			throw('User Wheel is not properly initialised!');
		}
		this.height = config.height || 500;
		this.width = config.width || 500;
		this.concentricArcDef = config.concentricArcDef;
		this.radii = config.radii || {} ;
		this.colors = config.colorGradients || config.colors || colorGrads; // need eight sets
		this.maxUsers = config.maxUsers || 8; // 8 in this case
		_init.call(this);
	}

	function _init()
	{
		this.arcDataCount = this.concentricArcDef.length;
		this.radiiCount = this.radii.length;
		this.userData = {};
		this.userCount = -1;
		this.queue = [];
		if(this.newCanvasFlag)
		{
			this.canvas = document.createElement('canvas');
			this.canvas.height = this.height;
			this.canvas.width = this.width;
			addClasses(this.canvas, this.cssCanvasClasses);

			this.context = this.canvas.getContext('2d');
			this.target.appendChild(this.canvas);
			this.origin = {x:0,y:0};
		}
		this.center = new Vector2({});
		this.center.x = this.origin.x + (this.width/2);
		this.center.y = this.origin.y + (this.height/2);

	}

	function _addUser(userData)
	{
		if(this.userCount + 1 <= this.maxUsers)
		{
			this.userCount++;
			var userId = USER_DATA_PREFIX+this.userCount;
			this.userData[userId] = {};
			updateObject(userData, this.userData[userId], USER_DATA_KEYS);
			if(this.userCount > 0)
			{
				var prevUserId = USER_DATA_PREFIX+(this.userCount - 1);
				this.userData[userId].startAngle = this.userData[prevUserId].endAngle;
				this.userData[userId].endAngle = this.userData[userId].startAngle + (this.userData[userId].percent * ONE_PERCENT_ANGLE);
			}	
			else
			{
				this.userData[userId].startAngle = 0;
				this.userData[userId].endAngle = this.userData[userId].percent * ONE_PERCENT_ANGLE;
			}

			_drawConcentricArcs.call(this, this.userData[userId].startAngle, this.userData[userId].endAngle);

		}
	}

	function _drawConcentricArcs(startAngle, endAngle)
	{
		if(startAngle < endAngle)
		{
			var concentricCircleData = {
				startAngle: startAngle,
				endAngle: endAngle,
				stepEndAngle: startAngle,
				userCount: this.userCount,
				userId: USER_DATA_PREFIX+this.userCount
			}
			this.queue.push(concentricCircleData);
			_timedDrawArcCaller.call(this);
		}
	}

	function _timedDrawArcCaller()
	{
		var _this = this;
		if(this.queue.length)
		{
			var startAngle =  this.queue[0].startAngle, stepEndAngle = this.queue[0].stepEndAngle, endAngle = this.queue[0].endAngle, userCount = this.queue[0].userCount;
			// var startQuad = new Vector2(_angleQuadrant(startAngle));
			// var endQuad = new Vector2(_angleQuadrant(stepEndAngle));

			if(stepEndAngle <= endAngle)
			{
				for(var i=0; i<this.arcDataCount; i++)
					{
						if(this.concentricArcDef[i].image == true)
						{
							var start = startAngle, step = stepEndAngle, end = endAngle;
							var length = 35;
							var midAngle = (startAngle+endAngle)/2;
								// var start = midAngle - (length/2);
								// var end = midAngle + (length/2);
							start = midAngle - (length/2);
							end = midAngle + (length/2);
							step = ((stepEndAngle - startAngle) * (length / (endAngle - startAngle)));
							var midPoint = new Vector2({});
							var radius = this.concentricArcDef[i].radius;
							midAngle = degToRad(midAngle);
							midPoint.x = (Math.abs((radius * Math.sin(midAngle) ) + (this.center.x))) - (step/2);
							midPoint.y = Math.abs((radius * Math.cos(midAngle) * -1) + (this.center.y)) - (step/2);

							var image = document.createElement("img");
							image.src = this.userData[this.queue[0].userId].image;
							this.context.drawImage(image, midPoint.x, midPoint.y, step, step);
						}
						else
						{
							var start = startAngle, step = stepEndAngle, end = endAngle;
							if(this.concentricArcDef[i].length == "SMALL")
							{
								var length = 5;
								var midAngle = (startAngle+endAngle)/2;
								// var start = midAngle - (length/2);
								// var end = midAngle + (length/2);
								start = midAngle - (length/2);
								end = midAngle + (length/2);
								step = start + ((stepEndAngle - startAngle) * (length / (endAngle - startAngle)));

							}

							start = degToRad(start);
							step = degToRad(step);
							end = degToRad(end);
						
							var radius = this.concentricArcDef[i].radius; 
							var startPoint = new Vector2({});
							var endPoint = new Vector2({});

							startPoint.x = Math.abs((radius * Math.sin(start) ) + (this.center.x));
							startPoint.y = Math.abs((radius * Math.cos(start) * -1) + (this.center.y));

							endPoint.x = Math.abs((radius * Math.sin(step) ) + (this.center.x));
							endPoint.y = Math.abs((radius * Math.cos(step) * -1) + (this.center.y));
							
							var gradient = this.context.createLinearGradient(startPoint.x,startPoint.y, endPoint.x, endPoint.y);
							gradient.addColorStop(0, this.colors[userCount].start);
							gradient.addColorStop(1, this.colors[userCount].end);
							
							var arcData = {
								radius: radius,
								startAngle: start -(Math.PI/2),
								endAngle: step -(Math.PI/2),
								gradient: gradient,
								startPoint: startPoint,
								endPoint: endPoint,
								lineWidth: this.concentricArcDef[i].thickness,
								lineCap: this.concentricArcDef[i].lineCap,
								imageFlag: this.concentricArcDef[i].imageFlag,
								length: this.concentricArcDef[i].length,
								opacity: this.concentricArcDef[i].opacity
							};
							_drawArc.call(this, arcData);
							if(step == end)
							{
								console.log(arcData);
								_drawArc.call(this, arcData);
							}
						}

				}
				this.queue[0].stepEndAngle++;
				setTimeout(_timedDrawArcCaller.bind(_this), 50);
			}
			else
			{
				// _timedDrawArcCaller.call(_this);
				this.queue.splice(0, 1); // remove the first element, FIFO queue
			}
		}
	}

	function _drawArc(arcData)
	{
		this.context.beginPath();
		this.context.lineWidth = arcData.lineWidth;
		this.context.strokeStyle = arcData.gradient;
		this.context.lineCap = arcData.lineCap;
		this.context.globalAlpha = arcData.opacity;
		this.context.arc(this.center.x, this.center.y, arcData.radius, arcData.startAngle, arcData.endAngle, false);		
		this.context.stroke();
	}

	function _removeUser(userId)
	{

	}

	function _updateUser(userData)
	{

	}


	wheel.prototype.addUser = function(userData)
	{
		_addUser.call(this, userData);
	}


	return wheel;
})();