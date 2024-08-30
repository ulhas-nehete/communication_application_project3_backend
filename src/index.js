const express = require('express');
const users = require('./routes/users');
const chats = require('./routes/chats');
const uploads = require('./routes/uploads');
const cors = require('cors'); // Import middleware
require('dotenv').config();

const app = express();

app.use(cors()); // Use middleware
app.use(express.json());

app.get('/', function (req, res) {
    res.send('Hello World!!!!');
})

// users API
app.get('/users', users.getUsers);
app.get('/users/:id', users.getUserById);
app.delete('/users/:id', users.deleteUserById);
app.post('/users', users.addUser);
app.put('/users/:id', users.updateUser);

// login API
app.post('/login', users.loginUser);

// chats API
app.get('/chats', chats.getChat);
app.post('/chats', chats.addChat);

// uploads API
app.get('/uploads', uploads.getFiles);
app.post('/uploads', uploads.allFile);
app.put('/uploads/:id', uploads.updateFile);
app.delete('/uploads/:id', uploads.deleteFileById);

// start server
app.listen(3001);