const express = require('express')
const path = require('path')
const sio = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = sio.listen(server)
const pathPublic = path.join(process.cwd(), 'client')

const PORT = process.env.PORT || 3008

// const routerMap = require('./routes/map')

app.use(express.static(pathPublic))

let usersLocation = []

io.on('connection', function (socket) {
  console.log('Client connected...')
  socket.on('join', function (data) {
    console.log(data)
    io.emit('serverMsg', 'Hi from the server')
  })
  socket.on('userCoords', function (data) {
    // const { lat, lng, acr} = data
    // const {id} = socket
    // data.id = socketId
    data.id = socket.id
    console.log(data)
    io.emit('serverMsg', 'Data arrive to server')
    // io.sockets.emit('updateCoords', data)
    socket.broadcast.emit('updateCoords', data)

  })
})

server.listen(PORT, () => `Listening on Port ${PORT}`)
console.log(`Listening on Port ${PORT}`)
