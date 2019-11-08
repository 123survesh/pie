var concentricArcDef = [
	{
		radius: 250,
		thickness: 10,
		length: "FULL", // FULL or SMALL
		opacity: 1, // 0.1 to 1
		lineCap: "round", // round or NONE
		image: false, // true or false
	},
	{
		radius: 230,
		thickness: 5,
		length: "SMALL", // FULL or SMALL
		opacity: 1, // 0.1 to 1
		lineCap: "round", // round or NONE
		image: false, // true or false
	},
	{
		radius: 200,
		// thickness: 10,
		// length: "SMALL", // FULL or SMALL
		opacity: 1, // 0.1 to 1
		// lineCap: "round", // round or NONE
		image: true, // true or false
	},
	{
		radius: 100,
		thickness: 5,
		length: "FULL", // FULL or SMALL
		opacity: 0.2, // 0.1 to 1
		lineCap: "square", // round or NONE
		image: false, // true or false
	},
	{
		radius: 80,
		thickness: 20,
		length: "FULL", // FULL or SMALL
		opacity: 1, // 0.1 to 1
		lineCap: "square", // round or NONE
		image: false, // true or false
	}
];

var target = document.getElementById('target');
var wheelConfig = {
	height: 550,
	width: 550,
	target: target,
	radii: [250, 230, 100, 80],
	newCanvasFlag: true,
	concentricArcDef: concentricArcDef
}

var userWheel = new Wheel(wheelConfig);

var userData = [
	{
		"percent": 10,
		"image": "./boy.png"
	},
	{
		"percent": 20,
		"image": "./girl.png"
	},
	{
		"percent": 35,
		"image": "./boy.png"
	},
	{
		"percent": 5,
		"image": "./girl.png"
	}
]

userWheel.addUser(userData[0]);
userWheel.addUser(userData[1]);
userWheel.addUser(userData[2]);
userWheel.addUser(userData[3]);



// var gradient = userWheel.context.createLinearGradient(10, 250, 440, 250);
// gradient.addColorStop(0, 'red');
// gradient.addColorStop(1, 'blue');

// userWheel.context.beginPath();
// userWheel.context.arc(275, 275, 250, -1.5707963267948966, -0.9424777960769379, false);		
// userWheel.context.lineWidth = 10;
// userWheel.context.strokeStyle = gradient;
// userWheel.context.lineCap = 'round';
// userWheel.context.stroke();