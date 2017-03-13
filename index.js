const Readline = require('readline')


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
  } catch(e) {
    console.log(`{"event":"error","data":${e}}`)
    cb && cb()
    return
  }

  // If the JSON is good, handle it properly.
  switch (json.event) {
    case 'list':
      list.forEach((user_id) => {
        Users[user_id] = {
          id: user_id
        }
      })
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