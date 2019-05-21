const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/vue-chat')
    .then(() => console.log('MongoDB has started ...'))
    .catch(e => console.log(e));
const Message = require('./messageModel');

app.patch('/clear', (req, res) => {
  Message.remove({}).then(resp => console.log('DB cleared!'))
  res.sendStatus(201)
});

io.on('connection', function(socket) {
  console.log('User connected');

  socket.join('all')

  socket.on('send_message', function(data) {
    const now=new Date();
    const later=new Date();
    later.setHours(now.getHours()+3);
    const message = new Message({
      _id: new mongoose.Types.ObjectId(),
      name: data.name,
      text: data.text,
      textColor: data.textColor,
      time: later
    })

    message.save()
      .then(result => {
        const messageRes = {
          name: result.name,
          text: result.text,
          textColor: result.textColor,
          time: result.time
        }
        socket.emit('add_message', messageRes)
        socket.to('all').emit('add_message', messageRes)
      })
      .catch(err => console.log(err))
  })

  socket.on('recive_history', () => {
    Message.find({})
      .sort({ time: 1})
      .lean()
      .exec( (err, messages) => {
        if (!err) {
          socket.emit('recive_message', messages)
        }
      })
  })
});

http.listen(8081, function() {
  console.log('Listening on port 8081');
});
