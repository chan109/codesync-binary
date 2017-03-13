function Peer (user_id) {
    this.Events = {}
    const wrtc = require('wrtc')
    const Peer = require('simple-peer')
    peer = new Peer({ initiator: true, wrtc: wrtc, trickle: true})
    
    peer.on('signal', function (data) {
        this.Events['offer'].forEach(function (cb) {
            cb(data);
        })
    })
    
    peer.on('data', function (data) {
        console.log("DATA : ", data);
    })
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
};



module.exports = Peer

