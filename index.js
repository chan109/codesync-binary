const Readline = require('readline')
const Peer = require('./peer')

const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var peerList = {}

function parse(data, cb) {
    try {
        var json = JSON.parse(data);
    } catch (err) {
        console.log(`{"event" : "error", "data" : ${err}`)
        cb && cb()
        return
    }
    
    switch (json.event) {
        case 'list' :
            json.payload.forEach((user_id) => {
                if(peerList[user_id] == null) {
                    var peer = new Peer(user_id, true)
                    peerList[user_id] = peer
                    console.log(peerList[user_id].active)
                }
            })
            break
        
        case 'answer' :
            if(peerList[json.payload.from]) {
                peerList[json.payload.from].signal(json.payload.data)
            } else {
                console.log('The answer or the offer is unknown')
            }
            break
        
        case 'offer' :
            var peer = new Peer(json.payload.from, false)
            peerList[json.payload.from] = peer
            peer.signal(json.payload.data)
            break

        case 'broadcast':
            for(var peer in peerList) {
                if(peerList[peer].active) {
                    peerList[peer].send(json.payload)
                }
            }
            break
        
        case 'message':
            if(peerList[json.payload.to]) {
                peerList[json.payload.to].send(json.payload.data)
            }
            break
            
            
    }
    cb && cb()
}
/** Keep asking questions forever. */
(function ask () {
    rl.question('', (answer) => {
        parse(answer, () => {
            setTimeout(ask,0)
        })
    })
})()