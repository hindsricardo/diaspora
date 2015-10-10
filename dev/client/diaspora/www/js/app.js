angular.module('diaspora', ['ionic', 'diaspora.controllers', 'diaspora.services','ngCordova', 'ngOpenFB'])
    .run(function ($ionicPlatform, ngFB) {
        ngFB.init({appId: '1472397729734860'});
        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('auth', {
                url: "/auth",
                abstract: true,
                templateUrl: "templates/auth.html"
            })
            .state('auth.signin', {
                url: '/signin',
                views: {
                    'auth-signin': {
                        templateUrl: 'templates/auth-signin.html',
                        controller: 'SignInCtrl'
                    }
                }
            })
            .state('auth.signup', {
                url: '/signup',
                views: {
                    'auth-signup': {
                        templateUrl: 'templates/auth-signup.html',
                        controller: 'SignUpCtrl'
                    }
                }
            })
            .state('diaspora', {
                url: "/diaspora",
                abstract: true,
                templateUrl: "templates/bucket.html"
            })

            .state('diaspora.list', {
                url: '/list',
                views: {
                    'diaspora-list': {
                        templateUrl: 'templates/bucket-list.html',
                        controller: 'allListCtrl'
                    }
                }
            })
            .state('diaspora.reserved', {
                url: '/reserved',
                views: {
                    'diaspora-reserved': {
                        templateUrl: 'templates/bucket-reserved.html',
                        controller: 'reservedCtrl'
                    }
                }
            })
            .state('diaspora.myprofile', {
                url: '/myprofile',
                views: {
                    'diaspora-profile': {
                        templateUrl: 'templates/bucket-myprofile.html',
                        controller: 'myProfileCtrl'
                    }
                }
            })
            .state('diaspora.edit', {
                url: '/edit',
                views: {
                    'diaspora-edit': {
                        templateUrl: 'templates/bucket-edit.html',
                        controller: 'editProfileCtrl'
                    }
                }
            })
        $urlRouterProvider.otherwise('/auth/signin');
    });