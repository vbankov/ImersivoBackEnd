var AppCtrl = ['shapeFactory', '$rootScope', '$scope',
  function(shapeFactory, $rootScope, $scope){

    $scope.sortedBy = ''; 
    $scope.showDescription = false;

    // initialize the socket
    var socket = io();

    // add a listener
    socket.on('message', function(msg){
      
      if(msg==='shape' || msg==='color'){ 
        angular.element('#shapes-container').mixItUp('sort', msg+':asc');
        $scope.$apply(function(){
          $scope.sortedBy = msg;
        }); 
      }

    });

    shapeFactory.fetchShapes(function(shapes){
      // got all shapes from db
      $scope.shapes = shapes;
      // activate mixItUp plugin
      angular.element('#shapes-container').mixItUp();
      angular.element('#shapes-container').mixItUp('sort','random');
    });

    $scope.makeClassName = function(shape, index){
      return 'mix shape-box '+shape.shapeType+' '+shape.color;
    }
    

    $scope.shapeMouseOver = function(s){
      $scope.description = s;
      $scope.showDescription = true;
    }

    $scope.shapeMouseLeave = function(s){
      $scope.showDescription = false;

      shapeFactory.shapeSeen(s._id,function(newShapeData){
        // shape updated in db, increment in frontend. updating all the shapes at once breaks the order
        $scope.shapes.forEach(function(s){
          if(s._id===newShapeData._id){
            s = s.views++;
          }
        });
      });

    };
    
    
    

  }
];
app.controller('AppCtrl', AppCtrl);