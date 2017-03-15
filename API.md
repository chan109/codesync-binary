# API
This is the documentation for the binary to handle the input and output of the data

##Handling the usersList

###Input:
 Description:
 Receive a list of users_id in the repository


 Format of the data --> {"event": "list", payload : [<users_id>]}

 Example: { "event": "list", "payload": [asdfsdf, sadfsadfsd, sadfds]}

###Output:
  Send a list of users_id as well as the sdp message to the plugin

  Format for the output data --> {"event": "conn", "payload":{"to": <users_id>, data: <sdp message>}}

  Example: {"event": "conn", "payload": {"to", "salkdjfl", "data": "aslkdfjlasdf"}}

  Then, the receiver side uses something like JSON.parse() to parse and make use of the data.

  Remark: The data array is expected to be non-empty all the time. The case when the userlist is empty, it wil be handled by the plugin.


##Handling the offer

###Input:
 Description:
 Receive a object which contains the event type, a user_id and a sdp offer/answer

 Format of the data --> {"event": "offer", "payload": {"from", <user_id>, "data": <sdp answer/offer>}}

 Example: {"event": "offer", "data": {"from", "asdfsadfsa22", "data": "safasfsafsad33"}}

###Output:
 Description:
 send a object which contains a event type, a user_id and a sdp offer/answer

 Format of the data --> {"event": "conn", "payload": {"to", <user_id>, "data": <sdp offer>}}

 Example: {"event" : "conn", "payload": {"to", "asfasdfsdfsdf", "data": "asdfasdfsdf"}}

 ##Handling the answer

 ###Input:
  Description:
  Receive a object which contains the event type, a user_id and a sdp offer/answer

  Format of the data --> {"event": "answer", "payload": {"from", <user_id>, "data": <sdp answer/offer>}}

  Example: {"event": "answer", "data": {"from", "asdfsadfsa22", "data": "safasfsafsad33"}}

 ###Output:
  Description:
  send a object which contains a event type, a user_id and a sdp offer/answer

  Format of the data --> {"event": "conn", "payload": {"to", <user_id>, "data": <sdp answer>}}

  Example: {"event" : "conn", "payload": {"to", "asfasdfsdfsdf", "data": "asdfasdfsdf"}}


##Handling the broadcast transfer :
###Input:
 Description:
 Receive the data that send to the other client

 Format of the data --> {"event": "broadcast", "payload": <message>}

 Example: {"event": "broadcast", "payload": "hello wolrd"}

###Output:
 The following format is shown in console:
 DATA : <text>
 Description:
 Send the message to the other client through the dataChannel using the p2p connection. It signals the plugin when the
 message is sent.

 Example: DATA : Hello Everyone

 ##Handling the message transfer :
 ###Input:
  Description:
  Receive the data that send to the other client

  Format of the data --> {"event": "message", "payload": {"to": <user_id>, "data": <message> }>}

  Example: {"event": "message", "payload": {"to": 123, "data": "hello baby"}

 ###Output:
  The following format is shown in console:
  DATA : <text>
  Description:
  Send the message to the other client through the dataChannel using the p2p connection. It signals the plugin when the
  message is sent.

  Example: DATA : Hello Everyone









