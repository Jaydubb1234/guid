<h2 align="center"> Guild test</h2>

<p align="center">
  🖥️ <em>Node | Jest | Typescript | ESLint</em>
  <br />
  🛠️ <em>TypeDI | AWS Lambda | Serverless</em>
  <br />
</p>

## ℹ️ What is it?

A repository for an AWS Lambda function which will host several API endpoints on which the messages will be based.

## GET
`/user/<userId>/messenger` - userId = recipientId

  ```
  curl -X GET \
  https://wy9k363reg.execute-api.us-west-2.amazonaws.com/dev/user/1234/messenger?senderIds=345,456,567&limit=100&offset=10 \
  -H 'Content-Type: application/json'
  ```

if `senderIds` is not passed, api will return all senders for given userId
### path parameters
senderIds - list of messages from specific senderIds
limit - number of results to return, max 100
offset - number for pagination

### Responses
`200`
```
{
  messages: {
    '118': [
      {
        message: 'Hey how are you!',
        sentTime: "2021-03-19 16:36:10"
      },
      {
        message: 'Hey how are you!',
        sentTime: "2021-03-19 16:36:10"
      },
      {
        message: 'Hey how are you!',
        sentTime: "2021-03-19 16:36:10"
      },
    ]
  },
  size: 3
}
  ```
`400`
`500`

## POST
`/user/<userId>/messenger` - userId = recipientId

```
curl -X POST \
https://wy9k363reg.execute-api.us-west-2.amazonaws.com/dev/user/1234/messenger \
-H 'Content-Type: application/json' \
-d '{
  senderId: "963",
  message: "Hope your ok",
  sentTime: "2021-03-19 16:36:10",
}'
```
### body object
senderId - id of sender
message - message being sent
sentTime - time message was sent

### Responses
`201`
  {}
`400`
`500`

## mysql message table data model
- id
- sender_id
- recipient_id
- message
- sent_time
- read_time
- received_time
- created
- last_updated

## 🧪 Requirements

nodeJs 12 or better

#### ⚠️ Make sure you are on Node 12.x and have Docker installed.
### Commands

Please note that before running any of the below commands, you must install all needed NodeJS modules in the project directory by running this command:
```
$ npm install
```

**`BUILD`**: To build the application, including compiling the project and running the linter and all tests, use the following command:
```
$ gulp build
```

**`TEST`**: To just run the suite of unit and functional tests:
```
$ gulp test
```

**`LINT`**: To just run the linter (TSLint):
```
$ gulp lint
```

**`COMPILE`**: To just run the compiler which transpiles Typescript to ECMAScript 2015:
```
$ gulp compile
```

**`RUN SERVERLESS`**: To just run the compiler which transpiles Typescript to ECMAScript 2015:
#### ⚠️ Make sure you have a database instance running
```
$ ./run_serverless_offline.sh
```
