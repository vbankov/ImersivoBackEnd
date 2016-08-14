const express = require('express'),
      path = require('path'),
      mongoose = require('mongoose'),
      _ = require('lodash'),
      config = require('./server/config.json')
      populateDb = require('./server/populateDb.js');

var app = express();

// DB: connect and check consistency
// =============================================================================
console.info(new Date()+' checking db ')
mongoose.connect('mongodb://' + config.dbUser + ':' + config.dbPass + '@' + config.dbUri)

var Shape = require('./server/models/shape.js');
var Stats = require('./server/models/stats.js');

populateDb.populateShapes();
populateDb.populateStats();


var http = require('http').Server(app);
var io = require('socket.io')(http);

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'welcome to the api!' });   
});

router.get('/shapes', function(req, res) {

  Shape.find().exec(function(err, data){
    if(err) res.status(500).send(err)
    res.json(data);
  });

});

router.post('/shapes/:shapeId/see', function(req, res){
  var shapeId = req.params.shapeId;

  if(!mongoose.Types.ObjectId.isValid(shapeId))
    return res.status(400).send('invalid request');
  
  var condition = {_id: shapeId},
      update = { $inc: { views: 1 }};

  Shape.findOneAndUpdate(condition, update, {new: true}, function(err, doc){
    if(err)
        return res.status(500).send('something went wrong');
    console.log(new Date()+' incremented shape `'+doc._id+'` to '+doc.views);
    res.json(doc);
  });
  
  
});

router.get('/stats', function(req, res){

  Shape.find(function(err, docs){
    var shapes = {shapes: _.clone(docs)};
    Stats.findOne(function(err, doc){
      shapes.stats = doc.toObject();
      res.json(shapes);
    });

  });

});

app.use('/api', router);

// ROUTES FOR PUBLIC
// =============================================================================
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.get('/mobile', function(req, res){
  res.sendFile(path.join(__dirname + '/mobile/mobile.html'));
});

app.get('/stats', function(req, res){
  res.sendFile(path.join(__dirname + '/client/stats.html'));
});


app.use('/vendor', express.static(__dirname + '/node_modules'));
app.use('/css', express.static(__dirname + '/client/css'));
app.use('/js', express.static(__dirname + '/client/js'));
app.use('/img', express.static(__dirname + '/client/img'));

// WEBSOCKET
// =============================================================================
io.on('connection', function(socket){
  console.info(new Date()+' a client has connnected')
  socket.on('message', function(msg){
    console.log(new Date()+' emitted ['+msg+']');
    
    if(msg==='color' || msg==='shape') updateStats(msg);
    
    io.emit('message', msg);
  });
});

var port = 5000;

http.listen(port, function(){
  console.info(new Date()+' server listening on *:'+port);
});

function updateStats(s){
  if(s==='color'){
    Stats.findOneAndUpdate({},{$inc: {colorSorts: 1}}, {new: true}, function(err, doc){
      if(err) throw err;
      console.log(new Date()+' updated color sort count: '+doc.colorSorts);
    });
  }else if(s==='shape'){
    Stats.findOneAndUpdate({},{$inc: {shapeSorts: 1}}, {new: true}, function(err, doc){
      if(err) throw err;
      console.log(new Date()+' updated shape sort count: '+doc.shapeSorts);
    });
  }
  
}