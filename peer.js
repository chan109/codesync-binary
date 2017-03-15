function Peer (user_id, isInit) {
    const self = this
    this.active = false
    this.user_id = user_id
    const wrtc = require('wrtc')
    const Peer = require('simple-peer')
    if(isInit){
        peer = new Peer({ initiator: true, wrtc: wrtc, trickle: false})
    } else {
        peer = new Peer({ initiator: false, wrtc: wrtc, trickle: false})
    }

    peer.on('signal', function (data) {
        var sdp = {"event":"conn", "payload":{"to": user_id, "data": data}}
        console.log(JSON.stringify(sdp));
    })
    
    peer.on('data', function (data) {
        console.log("(",self.user_id,")"," DATA : ", data.toString('utf8'));
    })

    peer.on('connect', function () {
        console.log('success')
        self.active = true
        console.log(self.active);
        peer.send("Ping");
    })

    peer.on('disconnect', function () {
        console.log("P2P disconnet")
    })
}

Peer.prototype.signal = function(sdp) {
    peer.signal(sdp);
}

Peer.prototype.send = function (data) {
    peer.send(data)
}

Peer.prototype.on = function (event, cb) {
    var evArr = this.Events[event]
    if (evArr) {
        evArr.push(cb)
    } else {
        this.Events[event] = [cb]
    }
}




module.exports = Peer

