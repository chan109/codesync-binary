const Readline = require('readline')
const Peer = require('./peer')

const rl = Readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var Users = {}


/** Accepts a JSON block, attempts to parse and properly handle it. */
function parse (data, cb) {
  // Catch bad JSON and non formatted inputs.
  try {
    var json = JSON.parse(data)
      console.log(json);
  } catch(e) {
    console.log(`{"event":"error","data":${e}}`)
    cb && cb()
    return
  }

  // If the JSON is good, handle it properly.
  switch (json.event) {
    case 'broadcast' :
        for(var user in Users) {
            Users[user].send(json.data)
        }
        break
      
    case 'list':
      json.data.forEach((user_id) => {
        // Don't worry about users we already have.
        if (Users[user_id])
          return

        // Go through the users and add their objects to the User DB.
        var peer = new Peer(user_id)
        Users[user_id] = {
          id: user_id,  
          rtc: peer
        }

        peer.on('data', function (data) {
            peer.send(data);
        })
        //{user_id:..., sdp: ....}
        peer.on('offer', function (data) {
            var sdp = {"user_id": user_id, "sdp": data}
            console.log(JSON.stringify(sdp));
            })

        })
    
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