
Run `npm install` then `npm start` to run the server 

POST to `https://rtr-web.herokuapp.com/api/gather-managed-spaces` to create new spaces on the fly with the follwing JSON Body

```
{
    "reference_space_id": "kuOpQ63ckdxpfANU\\kevinwebsockets",		// space to copy from
    "api_key": "Cu4tlS6CIU6iWjcG",									// api key for space
    "space_name": "mastermind-demo-2",								// name of space
    "limit": 4														// max people per space
}
```

A successful response will look like


```
{
    "success": true,
    "data": {
        "managed_space_id": 20,
        "gather_space_id": "7hQQ4WsEayi7aDCL/mastermind-demo-2",
        "gather_space_link": "https://app.gather.town/app/7hQQ4WsEayi7aDCL/mastermind-demo-2"
    }
}
```
