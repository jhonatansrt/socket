
let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});
const cors = require('cors');
app.use(cors());

let resps = ['Olá, estamos conectados', 'Excelentíssimo Dev, você está demonstrando o funcionamento do socket.io', 'Disponha']
let currentResp = 0;

io.on('connection', (socket) => {
    //Token do usuário
    console.log(socket.handshake.headers.authorization);

    socket.on('disconnect', function(){
      io.emit('usersActivity', {
        event: 'chatLeft'
      });
    });
    
    socket.on('sendTheMessage', (message) => {
      io.emit('message', {
        msg: message.text,
        createdAt: new Date(),
        resp: resps[currentResp]
      });    

      currentResp++

      if (currentResp === 3) {
        currentResp = 0;
      }
    });

    setTimeout(()=>{
      console.log("HERE");
      io.emit('testeDeServidor', {
        msg: 'Test',
        createdAt: new Date(),
      });  
    }, 10000)
  });

let port = process.env.PORT || 8080;

server.listen(port, () => {
    console.log(port + ' Server Started');
});