# API
This is the documentation for the binary to handle the input and output of the data

##Handling the usersList

###Input:
 receive a list of users_id in the repository
 an offer is created to each of the user in the list

 Format of the data --> {"list", data : [<users_id>]}

 Example: { "list", [asdfsdf, sadfsadfsd, sadfds]}

 ###Output:
  Description:
  send a list of users_id as well as the sdp message to the plugin

  Format for the output data --> {"event": "conn", "payload":{"to": <users_id>, data: <sdp message>}}

  Example: {"event": "conn", "payload": {"to", "salkdjfl", "data": "aslkdfjlasdf"}}

  Then, the receiver side uses something like JSON.parse() to parse and make use of the data.

  Remark: The data array is expected to be non-empty all the time. The case when the userlist is empty, it wil be handled by the plugin.


##Handling the sdp

###Input:
 Description:
 receive a object which contains the event type, a user_id and a sdp offer/answer

 Format of the data --> {"event": "conn", "payload": {"from", <user_id>, "data": <sdp answer/offer>}}

 Example: {"event": "conn", "data": {"from", "asdfsadfsa22", "data": "safasfsafsad33"}}

###Output:
 Description:
 send a object which contains a event type, a user_id and a sdp offer/answer

 Format of the data --> {"event": "conn", "payload": {"to", <user_id>, "data": <sdp answer/offer>}}

 Example: {"event" : "conn", "payload": {"to", "asfasdfsdfsdf", "data": "asdfasdfsdf"}}


##Handling the message transfer :
###Input:
 Description:
 receive the data that send to the other client

 Format of the data --> {"event": "message", "payload": <message>}

 Example: {"event": "message", "payload": "hello wolrd"}

###Output:
 Description:
 send the message to the other client through the dataChannel using the p2p connection. It signals the plugin when the
 message is sent.

 Example: {"message": "message is sent"}







