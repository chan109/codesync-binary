# API

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


## Events Emitted From The Binary