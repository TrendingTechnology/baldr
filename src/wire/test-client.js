
const exampleSocket = new WebSocket('ws://localhost:62453', 'protocolOne')

console.log(exampleSocket)

exampleSocket.onopen = function (event) {
  exampleSocket.send("Here's some text that the server is urgently awaiting!")
}
