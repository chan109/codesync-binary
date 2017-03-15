function Peer (user_id, isInit) {
    const self = this
    this.active = false     //when a p2p connection is done, active = true
    this.user_id = user_id
    const wrtc = require('wrtc')
    const Peer = require('simple-peer')
    if(isInit){
        peer = new Peer({ initiator: true, wrtc: wrtc, trickle: false})
    } else {
        peer = new Peer({ initiator: false, wrtc: wrtc, trickle: false})
    }

    //data here is the actual offer or the answer
    peer.on('signal', function (data) {
        var sdp = {"event":"conn", "payload":{"to": user_id, "data": data}}
        console.log(JSON.stringify(sdp));
    })

    //trigger by peer.send
    //send data to the remote peer in the custom format
    peer.on('data', function (data) {
        console.log("(",self.user_id,")"," DATA : ", data.toString('utf8'));
    })

    //p2p connection is established
    peer.on('connect', function () {
        console.log('success')
        self.active = true
        peer.send("Ping");
    })
}

//create answer or offer, it trigger peer.on('signal,......)
Peer.prototype.signal = function(sdp) {
    peer.signal(sdp);
}

//send message to the remote peer
Peer.prototype.send = function (data) {
    peer.send(data)
}

module.exports = Peer

