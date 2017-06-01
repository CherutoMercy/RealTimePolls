var express        = require('express');
var router         = express.Router();
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var pollsRoutes     = require('./polls');

// Main App Page
router.get('/', pollsRoutes.index);

// MongoDB API Routes
router.get('/polls/polls', pollsRoutes.list);
router.get('/polls/:id', pollsRoutes.poll);
router.post('/polls', pollsRoutes.create);
router.post('/vote', pollsRoutes.vote);
io.sockets.on('connection', pollsRoutes.vote);


module.exports=router;