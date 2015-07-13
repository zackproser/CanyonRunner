var 
	express = require('express'), 
	app = express(), 
	port = 8080
; 

//Set the 'static' directory to the project root - where index.html resides
app.use(express.static('./'));

//When root is requested, send index.html as a response
app.get('/', function(req, res){
	res.send('index.html'); 
}); 

//Create the server by listening on the desired port
var server = app.listen(port, function() {
	console.log('Visit localhost:' + port + ' to see your Phaser game'); 
}); 