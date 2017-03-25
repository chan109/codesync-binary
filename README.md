# API

For events that are purely binary-binary go [here](./BINARY.md)
### Protocol
All events sent to the binary must be in JSON format. The events must also be accompanied by a event parameter.
e.g.
```js
{"event":"blah","attr":"value"}
```

## Events To The Binary
#### conn
> **Description**
> This event must send data that was sent from the server.
>
> **JSON Params**
>
> _from_ - the id of the person that sent the data.
>
> _data_ - some data, in string form.
>

#### list
> **Description**
> This event merely sends  a list of users in the space.
>
> **JSON Params**
>
> _users_ - the list of users, as a array.
>

#### broadcast
> **Description**
> This event sends a message to all the peers in the peerList.
>
> **JSON Params**
>
> _data_ - the data to send to all the peers.
>


## Events Emitted From The Binary

#### broadcast
> **Description**
> This event sends a message to all the peers in the peerList.
>
> **JSON Params**
>
> _data_ - the data to send to all the peers.
> _peer_ - the userid of the peer that sent the data.
>

#### error
> **Description**
> This event sends a message to all the peers in the peerList.
> NOTE: unlike other events this does not use the event param.
> Instead error, is its own param.
>
> **JSON Params**
> _error_ - the error

#### conn
> **Description**
> This event is for you to take data and send it to someone.
>
> **JSON Params**
>
> _to_ - the id of the person that you wanna send this to.
>
> _data_ - some data, in string form.
>

#### ready
> **Description**
> This event is for you to notify that the datachannel is ready.
>
