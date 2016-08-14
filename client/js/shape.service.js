var shapeFactory = ['$http',
  function($http) { // a service for consuming the api of objects 
    var fac = {shapes: []};
    
    fac.fetchShapes = function(callback){
      $http.get('/api/shapes')
        .success(function(shapes){
          fac.shapes = shapes;
          callback(shapes)
        });
    };

    fac.shapeSeen = function(shapeId, callback){
      $http.post('/api/shapes/'+shapeId+'/see')
        .success(function(res){
          callback(res);
        })
        .error(function(err){
          console.error(err)
        })
      //return this.shapes;
    }

    fac.getShapes = function(){
      return this.shapes;
    }

    fac.setShapes = function(shapes){
      this.shapes = shapes
    }

    fac.getStats = function(){
      return $http.get('api/stats');
    }

    return fac;
  }
];

app.factory('shapeFactory', shapeFactory);