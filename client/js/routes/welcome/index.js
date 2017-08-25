/* global angular */
(function () {
  'use strict'
  angular.module('Wabout')
  .config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'js/routes/welcome/template.html'
    })
  })

})()
