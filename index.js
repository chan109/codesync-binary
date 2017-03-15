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
                //making sure connection for user_id does not exist in peerList{}
                if(peerList[user_id] == null) {
                    //create offer for each users_id
                    var peer = new Peer(user_id, true)
                    //store the p2p connection for user
                    peerList[user_id] = peer
                }
            })
            break
        
        case 'answer' :
            if(peerList[json.payload.from]) {
                //signal the answer as the last step for the p2p connection
                peerList[json.payload.from].signal(json.payload.data)
            } else {
                console.log('The answer or the offer is unknown')
            }
            break
        
        case 'offer' :
            //create a peer connection object with initator set to false
            var peer = new Peer(json.payload.from, false)
            //save the peer by key
            peerList[json.payload.from] = peer
            //signal the offer to create the answer
            peer.signal(json.payload.data)
            break

        case 'broadcast':
            //send message to users who are already connected
            for(var peer in peerList) {
                if(peerList[peer].active) {
                    peerList[peer].send(json.payload)
                }
            }
            break
        
        case 'message':
            //send message to a particular user
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