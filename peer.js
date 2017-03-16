function Peer (user_id, isInit) {
    const self = this
    this.active = false     //when a p2p connection is done, active = true
    this.user_id = user_id
    this.peer = null
    const wrtc = require('wrtc')
    const Peer = require('simple-peer')
    if(isInit){
        this.peer = new Peer({ initiator: true, wrtc: wrtc, trickle: false})
    } else {
        this.peer = new Peer({ initiator: false, wrtc: wrtc, trickle: false})
    }

    //data here is the actual offer or the answer
    this.peer.on('signal', function (data) {
        var sdp = {"event":"conn", "payload":{"to": user_id, "data": data}}
        console.log(JSON.stringify(sdp));
    })

    //trigger by peer.send
    //send data to the remote peer in the custom format
    this.peer.on('data', function (data) {
        console.log("(",self.user_id,")"," DATA : ", data.toString('utf8'));
    })

    //p2p connection is established
    this.peer.on('connect', function () {
        console.log('success')
        self.active = true
        self.peer.send("Ping");
    })

    this.peer.on('close', function () {
        console.log("disconneted to ",user_id )
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

module.exports = Peer

