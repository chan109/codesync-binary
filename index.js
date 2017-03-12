const wrtc = require('wrtc');
const Peer = require('simple-peer');

var peer = null;

//TODO: user stdin to get the message from the plugin:
var data = null; //store the recieved data from the plugin
var msgArr = data.split(WEBSOCKET_DELIMETER);
var event = msgArr[0];
var data = msgArr[1];

switch(event) {
    //case of receiving users list
    case 'list':
        //check empty list
        if ( data.length == 0 ) break;
        var users = data;
        broadcastOffer(socket, users);
        break;

    //case of receiving sdp object
    case 'data':
        try{
            var from = JSON.parse(data).from;
            var data = JSON.parse(data).data;
            sdpHandler(socket, from, data);


        } catch(e) {
            logError(socket, 'bad JSON');
        }
        break;

    //case of sending the text after connections is established
    case 'message':
        connectionHandler(text);

    default:
        console.error(`Event ${event} is unknown`);
}

var broadcastOffer = (socket, users) => {
    //For each user on the list
    for(var i = 0; i<users.length;i++) {
        //create the offer
        peer = new Peer({ initiator: true, wrtc: wrtc, trickle: true});

        //Received the offer
        peer.on('signal', function (data) {
            //Construct the response object
            var responseTemplate = {'to': users[i], 'data': JSON.stringify(data)};
            //Send offer back to the server
            socket.emit('message', responseTemplate);
        });
    }
};

//handle redirecting offer or signaling answer
var sdpHandler = (socket, user, sdp) => {
    //create answer or activate the answer on the initiator side
    peer.signal(sdp);
    peer.on('signal', function (data) {
        //Construct the response object
        var responseTemplate = {'to': users[i], 'data': JSON.stringify(data)};

        //Send offer back to the server
        socket.emit('message', responseTemplate);
    });
    connectionHandler();
};

//listener for collecting data in the dataChannel
var connectionHandler = (text) => {
    //check
    peer.on('connect', function () {
        peer.send('Ping');
    });

    peer.send(text);

    peer.on('data', function (data) {
        console.log( data);
    });
};