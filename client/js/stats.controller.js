var StatsCtrl = ['shapeFactory', '$scope',
  function(shapeFactory, $scope){
    
    shapeFactory.getStats()
      .then(function(res){
        $scope.shapes = res.data.shapes;
        $scope.stats = res.data.stats;
      });

  }
];

app.controller('StatsCtrl', StatsCtrl);