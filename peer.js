function Peer (user_id, isInit) {
    const self = this
    this.active = false     //when a p2p connection is done, active = true
    this.user_id = user_id
    this.peer = null
    this.rmcb = null        //functio to call when removing a user
    const wrtc = require('wrtc')
    const Peer = require('simple-peer')
    if (isInit) {
        this.peer = new Peer({
            initiator: true,
            wrtc: wrtc,
            trickle: true,
            config: {iceServers: [{url: 'stun:stun.l.google.com:19302'}]}
        })
    } else {
        this.peer = new Peer({
            initiator: false,
            wrtc: wrtc,
            trickle: true,
            config: {iceServers: [{url: 'stun:stun.l.google.com:19302'}]}
        })
    }

    //data here is the actual offer/answer/candiate
    //output format:
    this.peer.on('signal', function (data) {
        var sdp = {"event": "conn", "data": {"to": self.user_id, "data": data}}
        if(data.type == 'offer') {
            console.log("offer[",self.user_id,"]\n",JSON.stringify(sdp),"\n");
        } else if(data.type == 'answer') {
            console.log("answer[",self.user_id,"]\n",JSON.stringify(sdp),"\n");

        } else {
            console.log("candiate[",self.user_id,"]\n",JSON.stringify(sdp),"\n");
        }
    })

    //trigger by peer.send
    //send data to the remote peer in the custom format
    this.peer.on('data', function (data) {
        console.log("(", self.user_id, ")", " DATA : ", data.toString('utf8'));
    })

    //p2p connection is established
    this.peer.on('connect', function () {
        console.log('success')
        self.active = true
        self.peer.send("Ping");
    })

    this.peer.on('close', function () {
        //console.log(this.rmcb)
        //this.rmcb.call(this, this.user_id)
        console.log("disconneted to ", user_id)
    })
}

//create answer or offer, it trigger peer.on('signal,......)
Peer.prototype.signal = function(sdp) {
    this.peer.signal(sdp);
}

//send message to the remote peer
Peer.prototype.send = function (data) {
    this.peer.send(data)
}

//remove user from the peerlist once the connection to the client is lost
Peer.prototype.removeHelper = function (cb) {
    this.rmcb = cb
}

Peer.prototype.rm = function () {
    this.peer.destroy()
}

module.exports = Peer

