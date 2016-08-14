const mongoose = require('mongoose');
var Shape = require('./models/shape.js');
var Stats = require('./models/stats.js');

var populateShapes = function(){

  Shape.find().exec(function(err, data){  // check db consistency
    if(err) console.error(err);
    if(data.length===0){ // db is empty, let's populate it
      console.info(new Date()+' db has '+data.length+' shapes, populating...');
      var shapeCombinations = [],
      shapes = ['circle', 'square', 'triangle'],
      colors = ['red', 'green', 'blue'];
  
      for(var i=0; i<3; i++){
        for(var j=0; j<3; j++){
          shape = new Shape();
          shape.shapeType = shapes[i];
          shape.color = colors[j];
          shape.imageLink = colors[j]+'_'+shapes[i]+'.png';

          shapeCombinations.push(shape);
        }
      }

      Shape.create(shapeCombinations, function(err){
        if(err) throw err;
        console.info(new Date()+' shapes collection populated successfully');
      });

    }else{
      console.info(new Date()+' shapes collection seems consistent');
    }
  });

  
 
}

var populateStats = function(){
  Stats.find()
    .exec(function(err, docs){
      if(docs.length===0){  // let's populate the stats document in mongo
        console.log(new Date()+' no stats in db, populating...');
        var stats = new Stats();
        stats.save(function(err, stats){
          if(err)
            throw err;
          console.log(new Date()+' stats object populated');
        })

      }else{
        console.log(new Date()+' stats object seems consistent');
      }
    });
}

var populateDb = {
  populateShapes: populateShapes,
  populateStats: populateStats
}

module.exports = populateDb;