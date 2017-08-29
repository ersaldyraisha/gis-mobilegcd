// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

const app = angular.module('mobilegcd', ['ionic', 'ngMap'])
app.run( $ionicPlatform => {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  })
})
app.controller('mainController', ['$scope', 'NgMap', ($scope, NgMap) => {
  const vm = this;
  NgMap.getMap().then(function(map) {
    vm.map = map;
  })

  $scope.result = {
    distance: 0,
    startBearing: 0,
    finalBearing: 0
  }

  $scope.isInputActive = {
    start: false,
    end: false
  }

  $scope.pos = {
    start: null,
    end: null
  }

  $scope.inputPos = (id) => {
    $scope.isInputActive[id] = true
  }

  $scope.setPos = (id, posInput) => {
    $scope.isInputActive[id] = false
    $scope.pos[id] = posInput

    if ( $scope.pos.start && $scope.pos.end ) {
      $scope.calculate()
    }
  }

  $scope.calculate = () => {
    const point = {
      lat1: $scope.pos.start[0],
      lon1: $scope.pos.start[1],
      lat2: $scope.pos.end[0],
      lon2: $scope.pos.end[1]
    }

    $scope.result.distance = Math.round(GreatCircle.distance(point.lat1, point.lon1, point.lat2, point.lon2))
    $scope.result.startBearing = bearingTo('start', point)
    $scope.result.finalBearing = bearingTo('end', point)
  }

  $scope.getPos = e => {
    if ($scope.isInputActive.start || $scope.isInputActive.end ) {
      const marker = new google.maps.Marker({position: e.latLng, map: vm.map})
      const lat = marker.getPosition().lat()
      const lon = marker.getPosition().lng()
      marker.setMap(null)

      if( $scope.isInputActive.start ) {
        $scope.setPos ('start', [lat, lon])
      } else if ( $scope.isInputActive.end ) {
        $scope.setPos ('end', [lat, lon])
      }
    }
  }
  
  $scope.reset = () => {
    $scope.result = {}
    $scope.isInputActive = {}
    $scope.pos = {}
  }

}])




const deg2rad = deg => {
  return deg * (Math.PI/180)
}

const rad2deg = rad => {
  return rad / (Math.PI/180)
}

const bearingTo = (id, point) => {
  let φ1 = deg2rad(point.lat1)
  let φ2 = deg2rad(point.lat2)
  let Δλ = deg2rad(point.lon2 - point.lon1);
  
  if ( id == 'end' ) {
    φ1 = deg2rad(point.lat2)
    φ2 = deg2rad(point.lat1)
    Δλ = deg2rad(point.lon1 - point.lon2);
  }

  var y = Math.sin(Δλ) * Math.cos(φ2);
  var x = Math.cos(φ1)*Math.sin(φ2) -
          Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
  var θ = Math.atan2(y, x);

  if ( id !== 'end' ) 
    return (rad2deg(θ)+360) % 360;
  return (rad2deg(θ)+180) % 360;
  
}
