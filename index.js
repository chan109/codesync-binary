const Readline = require('readline')
const Peer = require('./peer')

const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var peerList = {}



function parse(data) {
  // Try to parse the JSON, emit an error otherwise.
  try {
      var json = JSON.parse(data);
  } catch (err) {
      console.log(`{"event" : "error", "data" : "${err}"}`)
      return
  }

  // Switch different types of events from the server.
  switch(json.event) {
    case 'conn':

      // See the type of data sent from the other user.
      switch(json.data.type) {
        case 'offer':
          // If the peer doesn't exist, create it as an initiator.
          if(peerList[json.from] == null) {
              //create a peer connection object with initator set to false
              var peer = new Peer(json.from, false)

              //save the peer by key
              peerList[json.from] = peer
          }
          //signal the offer to create the answer
          peerList[json.from].signal(json.data)
          break

        case 'answer':
          if(peerList[json.from]) {
            //signal the answer as the last step for the p2p connection
            peerList[json.from].signal(json.data)
          } else {
            console.log(JSON.stringify({
              error: 'The answer or the offer is unknown'
            }))
          }
          break

        //default is candiate
        default:
          // If the peer doesn't exist, create it as an initiator.
          if(peerList[json.from] == null) {
            //create a peer connection object with initator set to false
            var peer = new Peer(json.from, false)

            //save the peer by key
            peerList[json.from] = peer
          }
          //signal the offer to create the answer
          peerList[json.from].signal(json.data)
          break
      }

      break
    case 'list':
      // Go through the users and add peer objects for them.
      json.users.forEach(user_id => {
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

      break
    case 'echo':
      console.log(JSON.stringify(json))
      break
    case 'broadcast':
      // Go through the peerlist.
      for(var peer in peerList) {
        var p = peerList[peer]
        
        // If it's connected, go for it!
        if (p.active) {
          // Send the broadcast!
          p.send(JSON.stringify(json))
        }
      }
      break
  }

}

function rmUserFromList(user_id) {
  peerList[user_id] = null
  console.log(`list after the deletion: ${Object.keys(peerList).join()}`)
}



//TODO need write function for removing users

/** Keep asking questions forever. */
(function ask () {

    // Ask a question.
    rl.question('', (answer) => {
        // Parse the answer, wait for the stack to clear and repeat.
        answer.split('\n').forEach(answer => parse(answer))
        setTimeout(ask,0)
    })
})()





/*


    if(json.event == "conn") {
        //do the switch
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

 */


