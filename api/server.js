const express = require('express');
const postsRouter = require('./posts/posts-router');
const server = express();

server.use(express.json());
server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
    res.send('lit')
});

module.exports = server;
