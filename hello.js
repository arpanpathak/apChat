var http=require("http");
function grab(key){
	var index=process.argv.indexOf(key);
	return (index===-1?null: process.argv[index+1]);
}
var count=0;
var port=grab("--port");
port=(port===null)?8080: port;
// Creating node.js server.... waiting for request
http.createServer(function(request,response){
	console.log(`Request No # ${++count}`);
	response.writeHead(200,{"Content-Type":"text/html"});
	response.write("<h1>Hello Visitor... welcome to nodejs</h1>");
	response.end();
}).listen(port);
// server is running on the port supplied by admin.....

// Printing Server information.....
console.log("\t\tSERVER INFORMATION");
console.log("\t\t------ -----------");
console.log(`Server Name\t\t==> ${grab('--server_name')}` ); // displaying the port no
console.log(`Server Running on port\t==> ${port}` ); // displaying the port no
console.log("----------------------------------------------------");
console.log("Waiting for requests..........");
process.stdout.write("\n>");
process.stdin.on('data',function(data){
	process.stdout.write("\n>");
	if(data.toString().trim()=="exit")
		process.exit();
	else process.stdout.write("\n Error!!!! Command Not Found!..\n>");
});