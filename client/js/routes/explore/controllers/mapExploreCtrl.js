/* global angular */
(function () {
  'use strict'

  function mapExploreCtrl ($scope, $rootScope, GeolocateService) {
    // OJO SOLO PARA DESARROLLO FRONT
    $rootScope.logged = true

    $scope.sync = true
    $scope.share = false

    console.log('mapExploreCtrl Loaded')

    angular.extend($scope, {
      userView: {
        lat: 0,
        lng: 0,
        zoom: 16
      },
      defaults: {
        tileLayer: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png',
        zoomControlPosition: 'topright',
        tileLayerOptions: {
          opacity: 0.9,
          detectRetina: true,
          reuseTiles: true
        }
      }
    })

    $scope.addMeMarker = function (lat, lng) {
      angular.extend($scope, {
        markers: {
          meMarker: {
            lat: lat,
            lng: lng,
            focus: true,
            message: "You're here!",
            icon: {
              iconUrl: '/img/red-marker.png',
              iconSize: [34, 48],
              iconAnchor: [17, 48],
              popupAnchor: [0, -48]
            }
          }
        }
      })
    }

    $scope.addUsersMarkers = function (lat, lng) {
      angular.extend($scope, {
        markers: {
          meMarker: {
            lat: lat,
            lng: lng,
            focus: true,
            message: `user is here!`,
            icon: {
              iconUrl: '/img/blue-marker.png',
              iconSize: [34, 48],
              iconAnchor: [17, 48],
              popupAnchor: [0, -48]
            }
          }
        }
      })
    }

    setInterval(() => {
      if ($scope.sync) {
        GeolocateService.getGeolocation()
          .then(userCoords => {
            $scope.userCoords = userCoords
            if ($scope.share) {
              client.emit('userCoords', $scope.userCoords)
            }

            $scope.$apply(() => {
              $scope.userView = GeolocateService.setUserView(userCoords, $scope.userView.zoom)
              // console.log($scope.userView)
            })
            angular.extend($scope, {
              userView: $scope.userView
            })
            $scope.addMeMarker($scope.userCoords.lat, $scope.userCoords.lng)
          })
      }
    }, 2000)

    const client = io.connect()
    client.on('connect', function (data) {
      client.emit('join', 'Hello World from client')
    })

    client.on('serverMsg', function (data) {
      console.log(data)
    })

    client.on('updateCoords', function (data) {
      console.log('Geolocation received from user!')
      $scope.addUsersMarkers(data.lat, data.lng)
    })

    $scope.shareLocation = () => {
      $scope.sync = true
      $scope.share = true
      console.log('Some users can track you')
    }
    $scope.hideLocation = () => {
      $scope.share = false
      console.log('Any user can track you')
    }
    $scope.syncLocation = () => {
      $scope.sync = true
      console.log('Your position is sync')
    }
    $scope.unSyncLocation = () => {
      $scope.sync = false
      $scope.share = false
      console.log('Your position is not sync. You can not view your position in the map or be tracked by any user')
    }




    // GeolocateService.getGeolocation()
    //   .then(userCoords => {
    //     $scope.userCoords = userCoords
    //     $scope.$apply(() => {
    //       $scope.userView = GeolocateService.setUserView(userCoords, 15)
    //       console.log($scope.userView)
    //     })
    //     angular.extend($scope, {
    //       userView: $scope.userView
    //     })
    //     $scope.addMarkers($scope.userCoords.lat, $scope.userCoords.lng)
    //   })

    // // TESTING REFRESH SCOPE USER MARKER
    // setInterval(() => {
    //   $scope.$apply(() => {
    //     $scope.markers.meMarker.lat = $scope.markers.meMarker.lat + 0.0005
    //     console.log($scope.markers.meMarker.lat)
    //   })
    // }, 3000)
  }

  angular
    .module('Wabout')
    .controller('mapExploreCtrl', mapExploreCtrl)
})()
