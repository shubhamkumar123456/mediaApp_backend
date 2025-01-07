
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 8080;
const cors = require('cors')
require('dotenv').config()
const connection = require('./db')  //connectToDB -- function
connection()


let userRouter = require('./routes/userRoutes')
let postRouter = require('./routes/postRoutes')
let messageRouter = require('./routes/messageRoutes')

app.use(cors({
    origin:'https://media-frontend-eta.vercel.app/',
    credentials: true,
}))
app.use(express.json({ limit: '100mb' }))

app.set('view engine', 'ejs')


    let users = new Map();
console.log(users)
const addUserData = (id, socketId) => {
    users.set(id,socketId)
       console.log(users)    
}

io.on('connection', (socket) => {
    // console.log('user connected', socket.id);

    socket.on('addUser', (userId) => {
        // console.log("userId = ", userId, socket.id)
        addUserData(userId, socket.id)

    })

    socket.on('sendMessage',({userId,friendId,message})=>{
        console.log({userId,friendId,message})

        let findFriend = users.has(friendId)
        // console.log(findFriend)
        let userSocketId = users.get(friendId);
        console.log(userSocketId)
      io.to(userSocketId).emit('getMessage',{userId,friendId,message})
    })


});


app.get('/', (req, res) => {
    res.send('welcome page')
})

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/message', messageRouter)

server.listen(port, () => {
    console.log(`server is running on port ${port}`)
})