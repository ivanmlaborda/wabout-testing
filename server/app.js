const express = require('express')
const path = require('path')
const sio = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = sio(server)
const pathPublic = path.join(process.cwd(), 'client')

const PORT = process.env.PORT || 3008

// const routerMap = require('./routes/map')

app.use(express.static(pathPublic))

let usersLocation = []

io.on('connection', function (client) {
  console.log('Client connected...')
  client.on('join', function (data) {
    console.log(data)
    io.emit('serverMsg', 'Hi from the server')
  })
  client.on('userCoords', function (data) {
    data.id = client.id
    console.log(data)
    io.emit('serverMsg', 'Data arrive to server')
    io.sockets.emit('updateCoords', data)

  })
})

server.listen(PORT, () => `Listening on Port ${PORT}`)
console.log(`Listening on Port ${PORT}`)
