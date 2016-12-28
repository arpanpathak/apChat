// Client Socket code....
/*** * apChat, @author Arpan Pathak
	 * A chat client written in node.js, socket.io, mongodb...
	 * Integrated with apache server.... 
	 * seperated chat server on different port
***/

//set chat server's ip address and port
var ip="172.16.177.204",port=8080;
$(function(){
			try{
				var socket=io.connect("http://"+ip+":"+8080);

			}catch(e){
				console.log(e);
			}

			// send message on pressing ctrl+enter
			$('.chat-text').keydown(function (e) {

  				if (e.ctrlKey && e.keyCode == 13) {
   				 // Ctrl-Enter pressed
   				 $('.send-btn').trigger('click');
  				}
			});

			// function for autoscrolling to bottom of new message...
			function autoScroll(){
				 $(".chat-messages").scrollTop(1E10);
			}

			if(socket!==undefined)
			{
				// set status to connected.....
				$('.chat-status').html('<span style="color: green;"> <i class="fa fa-circle"aria-hidden="true"></i> connected</span>');
				

				socket.on('status',function(s){
					var chatName=$('.chat-name').val();
					var chatTextArea=$('.chat-text').val();
					$('.chat-status').html(s);
					if(s.indexOf('fa-check')!=-1){
						$('.chat-messages').append('<div class="chat-message-right"><span class="from">'+chatName+" : </span>"+chatTextArea +"</div>");
						$('.chat-text').val("");
						autoScroll();

					}
				});


				//Listen for new message.... 
				socket.on('newmessage',function(data){

						// append new message to chat-messages div...
						if(data.name!=$('.chat-name').val())
						$('.chat-messages').append('<div class="chat-message-left"><span class="from">'+data.name+' : </span>'+data.message +'</div>');
						autoScroll();
				});

				// fetch and append all the previous messages.....
				socket.on('output',function(data){
					var chatName=$('.chat-name').val();
					for(var i=0;i<data.length;i++)
						$('.chat-messages').append('<div class="chat-message-left"><span class="from">'+data[i].name+" : </span>"+data[i].message +"</div>");
					autoScroll();
					});

				// add click event of send button
				$('.send-btn').on('click',function(){
					var chatName=$('.chat-name').val();
					var chatTextArea=$('.chat-text').val();
					socket.emit('input',{"name":chatName,"message":chatTextArea} );
				});

				window.onbeforeunload = function() {
    				socket.emit('disconnect',{"name":$('.chat-name').val() } );
				};
			}
});
