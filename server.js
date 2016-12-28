/*** * apChat, @author Arpan Pathak
	 * A chat client written in node.js, socket.io, mongodb...
	 * Integrated with apache server.... 
	 * seperated chat server on different port
	 ***/

var mongo=require('mongodb').MongoClient;

// This part of code will get port from command line argument..
function grab(key){
	var index=process.argv.indexOf(key);
	return (index===-1?null: process.argv[index+1]);
}
var port=grab("--port");
port=(port===null)?8080: port;

var	client=require('socket.io').listen(port).sockets;

console.log("Server Running on port : "+port);

//Connecting to mongodb database....

mongo.connect('mongodb://0.0.0.0/chat',function(err,db){
	if(err) throw err;

	//Now waiting for client to connect....
	client.on('connection',function(socket)
	{
		console.log('someone has connected..');

		var data_base=db.collection('messages');

		// emit status to client....
		var sendStatus=function(s){
			socket.emit('status',s);
		};
	
		//emit all messages... maximum 1000 previous messages will be displayed...
		data_base.find().limit(1000).sort({_id:1}).toArray(function(err,res){
			if(err) throw err;
			socket.emit('output',res);
		});

		// send new message to all connected user....
		socket.on('input',function(data){
			console.log(data);
			var name=data.name,message=data.message,pattern=/^\s*$/;

			// check if the message is not empty or the chat name is not empty...

			if(pattern.test(name) || pattern.test(message))
			{
				sendStatus("Name or message field can't be empty");
				console.log("Invalid Entery by client..");
			}
			else{
				data_base.insert({name: name,message: message},function(){
					console.log("Data Inserted....");
					sendStatus('<span style="color: green;"><i class="fa fa-check" aria-hidden="true"></i> sent</span>');
					
					// inform all the clients to poll new message by emiting newmessage event...
					client.emit('newmessage',data);
				});
			}
		});
	});
	client.on('disconnect',function(data){
		console.log("User "+data.name+" Disconencted...");
	});
});
