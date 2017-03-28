

function Peer (user_id, isInit) {
    const self = this
    this.active = false     //when a p2p connection is done, active = true
    this.user_id = user_id
    this.peer = null
    this.rmcb = null        //function to call when removing a user
    const wrtc = require('wrtc')
    const Peer = require('simple-peer')
    if (isInit) {
        this.peer = new Peer({
            initiator: true,
            wrtc: wrtc,
            trickle: true,
            config: {iceServers: [{url: 'turn:numb.viagenie.ca',username:'josepht404@gmail.com', credential:'joseph123'},{url:'stun:stun.l.google.com:19302'}]}
        })
    } else {
        this.peer = new Peer({
            initiator: false,
            wrtc: wrtc,
            trickle: true,
            config: {iceServers: [{url: 'turn:numb.viagenie.ca',username:'josepht404@gmail.com', credential:'joseph123'},{url:'stun:stun.l.google.com:19302'}]}
        })
    }

    //Handle Offer/Answer
    this.peer.on('signal', function (data) {
      console.log(JSON.stringify({
        event: 'conn',
        to: self.user_id,
        data: data
      }))
    })


    //Handle the data exchange using the datachannel
    this.peer.on('data', function (data) {
      try {
        // Try parsing the json.
        var json = JSON.parse(data) 
        // If successful, tell the plugin.
        console.log(JSON.stringify({
          event: json.event,
          peer: self.user_id,
          data: json.data
        }))
      } catch (e) {
        console.log(JSON.stringify({
          error: 'THERE WAS A HUGE ERROR SENT BY SOMEONE! IN THE RTC CONNECTION',
          sender: self.user_id,
          details: data
        }))
      }
    })

    //p2p connection is established
    this.peer.on('connect', function () {
        console.log('success')
        self.active = true
        self.peer.send(JSON.stringify({
            "event" : "ready"
        }));
    })

    //The p2p connection to one of the user is lost
    //also remove the peer object from the peerList
    this.peer.on('close', function () {
        console.log(self.rmcb)
        self.rmcb.call(self, self.user_id)
        console.log("disconneted to ", self.user_id)
    })
}

//create answer or offer
Peer.prototype.signal = function(sdp) {
    this.peer.signal(sdp);
}

//send message to the remote peer
Peer.prototype.send = function (data) {
    this.peer.send(data)
}

//set the remove user handler
Peer.prototype.removeHelper = function (cb) {
    this.rmcb = cb
    console.log(cb)
}

//this is not used unless user is allowed to intentionally disconnect from someone without shouting its binary down. Not sure if we support this feature or not.
Peer.prototype.rm = function () {
    this.peer.destroy()
}

module.exports = Peer
