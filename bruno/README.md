# Description
This directory contains examples of how to use our APIs via Bruno (https://www.usebruno.com/), a Postman/Insomnia equivalent.

The API Reference directory contains all basic endpoints you should be interested in.

The scenarios directory give you a general (but not exhaustive) idea of the order in which you can play your calls, and allow you to experiment with them before integrating them into your application code.

The variables used in the calls are automatically filled in thanks to previous calls to adapt to your sandbox environment.

## Getting Started
### Import the collection
Clone and import this repository directly in Bruno

### Configure
Copy/paste the .env.dist file and adapt its content with your own variables

```
DISABLE_AUTO_AUTHENTICATION=false // If you want to enable/disable the automatic authentication

LOCAL_HOST=gateway.prod.gravitee.stadline.tech // The base URL of the API
LOCAL_ENVIRONMENT=resa2-staging // The environment you're working on
LOCAL_CLIENT_TOKEN=demoapi
LOCAL_API_KEY=XXX // Your Gravitee api key : Found it on the developer portal
LOCAL_CLIENT_ID=YYY // The clientId the API team gave you
LOCAL_CLIENT_SECRET=ZZZ // The clientSecret the API team gave you
LOCAL_USER_NETWORK_NODE_ID=/demoapi/network_nodes/1455 // optional, depending on the request, see dedicated documentation
LOCAL_USER_CLUB_ID=/demoapi/clubs/1365 // optional, depending on the request, see dedicated documentation
```