const express = require('express');
const expressWs = require('express-ws');
const app = express();

expressWs(app);

const port = 8000;
const wsClients = [];
const espClient = [];


app.ws('/esp', (ws) => {
console.log('ESP32 connected');
espClient.push(ws);
               
ws.on('message', (message) => {
 console.log(`Received from ESP32: ${message}`);

 // Forward the message to all Flutter clients
   wsClients.forEach((flutterSocket) => {
   flutterSocket.send(message);
     });
   });


});

app.ws('/flutter', (ws) => {
  console.log('Flutter app connected');
  wsClients.push(ws);

  ws.on('message', (newMessage) => {

    console.log(`Received from Flutter app: ${newMessage}`);
    const message = newMessage.toString();

    wsClients.forEach((flutterSocket) => {
      flutterSocket.send(`Connected`)
        });

    espClient.forEach((espSocket) => {
      espSocket.send(message);
        });

  });


  ws.on('close', () => {
    console.log('Flutter app disconnected');
    wsClients.splice(wsClients.indexOf(ws), 1);
  });

});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
