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

    if(json.event == "conn") {
        //do the switch
        switch(json.data.data.type) {
            case 'offer':
                if(peerList[json.data.from] == null) {
                    //create a peer connection object with initator set to false
                    var peer = new Peer(json.data.from, false)

                    //save the peer by key
                    peerList[json.data.from] = peer

                    //init the remove users handle to the peer ovject
                    //peerList[json.data.from].removeHelper(rmUserFromList)
                }
                //signal the offer to create the answer
                peerList[json.data.from].signal(json.data.data)
                break

            case 'answer':
                if(peerList[json.data.from]) {
                    //signal the answer as the last step for the p2p connection
                    peerList[json.data.from].signal(json.data.data)
                } else {
                    console.log('The answer or the offer is unknown')
                }
                break

            //default is candiate
            default:
                if(peerList[json.data.from]) {
                    //signal the answer as the last step for the p2p connection
                    peerList[json.data.from].signal(json.data.data)
                } else {
                    console.log('The answer or the offer is unknown')
                }
        }
    } else if(json.event == "list"){
        json.data.forEach((user_id) => {
            //making sure connection for user_id does not exist in peerList{}
            if(peerList[user_id] == null) {
                //create offer for each users_id
                var peer = new Peer(user_id, true)

                //store the p2p connection for user
                peerList[user_id] = peer

                //init the remove users handle to the peer ovject
                //peerList[user_id].removeHelper(rmUserFromList)
            }
        })
    } else{
        //broadcasting the data through the channel
        for(var peer in peerList) {
            // console.log("the peers are ",peer," and detail is ", peerList[peer])
            if(peerList[peer].active) {
                peerList[peer].send(json)
            } else {
                console.log("P2P connection has not been set yet");
            }
        }

        //sedning data to a particular user in the list
        // if(peerList[json.payload.to]) {
        //     peerList[json.payload.to].send(json.payload.data)
        // }
    }

    cb && cb()
}

function rmUserFromList(user_id) {

    peerList[user_id] = null
    console.log(`list after the deletion: ${Object.keys(peerList).join()}`)

}

//TODO need write function for removing users

/** Keep asking questions forever. */
(function ask () {
    rl.question('', (answer) => {
        parse(answer, () => {
            setTimeout(ask,0)
        })
    })
})()