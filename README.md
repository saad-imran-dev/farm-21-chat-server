<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Pre-requisites
You will require `socket.io` library in the client-side to connect with the server. And also use the `JWT token` generated using api server in the `Authorization` header.  

## Environment Variables
Without below environment variables the chat server will not start. Use `ENV` vars like this:
```
JWT_SECRET_KEY = mysecretkey

REDIS_HOST = localhost
REDIS_PORT = 6379

DATABASE_TYPE = postgres
DATABASE_HOST = localhost
DATABASE_PORT = 5432
DATABASE_USER = postgres
DATABASE_PASSWORD = postgres
DATABASE_DB = postgres
```

## Schema
The server uses following schemas in client emit and server response: 

- Chat
```
{
  id: string;

  # user uuid of sender
  sender: string;

  # user uuid of receiver
  receiver: string;

  message: string;

  createdAt: number;

  received: boolean;
}
```

- MessageEventData
```
{
  # user uuid of receiver
  receiver: string;

  message: string;
}
```

- ReceiveEventData
```
{
  # uuid of chat message
  chatId: string;
}
```

- ErrorResponse
```
{
  # client user uuid
  id: string;

  message: string;
}
```

## Events
After connecting with the server through `socket.io`, the server and clients will interact by emiting and listening to events. <br>
**Please check the schema if you don't understand the data field.**

- **ping**: Emitting this event will result in server emitting `pong` in return.
```
# client emit 
{
  event: "ping",
  data: undefined
}

# server response 
{
  event: "pong",
  data: "Hello World!"
}
```

- **all messages**: After connecting with server, use this event to get all message sent to user.
```
# client emit 
{
  event: "all messages",
  data: undefined
}

# server response 
{
  event: "all messages",
  data: Record<uuid of user, Chat[]>
}
```

- **unreceived messages**: After connecting with server, use this event to get all message sent when client was disconnected. Server will again send array of unreceived chat messages in `unreceived messages` event.
```
# client emit 
{
  event: "unreceived messages",
  data: undefined
}

# server response 
{
  event: "unreceived messages",
  data: Chat[]
}
```

- **send message**: Send chat message to a user
```
# client emit 
{
  event: "send message",
  data: MessageEventData
}

# server response to receiver client if client is connected to server
{
  event: "message",
  data: Chat
}
```

- **message**: Event emit to receiver to of chat message from `send message` event. Client should the **listening** to this event. 
```
# client listening to server 
{
  event: "message",
  data: Chat
}
```

- **receive message**: Client sends an `ACK` to server that client has received message.
```
# client listening to server 
{
  event: "receive message",
  data: ReceiveEventData
}
```

- **error**: Server emits this event when any exception occurs.
```
# client listening to server 
{
  event: "error",
  data: ErrorResponse
}
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
