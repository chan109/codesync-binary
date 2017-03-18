

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
            config: {iceServers: [{url:'stun:stun.l.google.com:19302'},{url:'stun:stun1.l.google.com:19302'},{url:'stun:stun2.l.google.com:19302'},{url:'stun:stun3.l.google.com:19302'},{url:'stun:stun4.l.google.com:19302'},{url:'stun:stun01.sipphone.com'},{url:'stun:stun.ekiga.net'},{url:'stun:stun.fwdnet.net'},{url:'stun:stun.ideasip.com'},{url:'stun:stun.iptel.org'},{url:'stun:stun.rixtelecom.se'}]}
        })
    } else {
        this.peer = new Peer({
            initiator: false,
            wrtc: wrtc,
            trickle: true,
            config: {iceServers: [{url:'stun:stun.l.google.com:19302'},{url:'stun:stun1.l.google.com:19302'},{url:'stun:stun2.l.google.com:19302'},{url:'stun:stun3.l.google.com:19302'},{url:'stun:stun4.l.google.com:19302'},{url:'stun:stun01.sipphone.com'},{url:'stun:stun.ekiga.net'},{url:'stun:stun.fwdnet.net'},{url:'stun:stun.ideasip.com'},{url:'stun:stun.iptel.org'},{url:'stun:stun.rixtelecom.se'}]}
        })
    }

    //data here is the actual offer/answer/candiate
    //output format:
    this.peer.on('signal', function (data) {
      console.log(JSON.stringify({
        event: 'conn',
        to: self.user_id,
        data: data
      }))
    })

    //trigger by peer.send
    //send data to the remote peer in the custom format
    this.peer.on('data', function (data) {
      try {
        // Try parsing the json.
        var json = JSON.parse(data) 
        // If successful, tell the plugin.
        console.log(JSON.stringify({
          event: 'broadcast',
          peer: self.user_id,
          data: data
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



