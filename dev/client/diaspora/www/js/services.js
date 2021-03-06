angular.module('diaspora.services', [])
    .factory('API', function ($rootScope, $http, $ionicLoading, $window) {
       var base = "http://diaspora1.herokuapp.com";
        $rootScope.show = function (text) {
            $rootScope.loading = $ionicLoading.show({
                content: text ? text : 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        };


        $rootScope.hide = function () {
            $ionicLoading.hide();
        };

        $rootScope.logout = function () {
            $rootScope.setToken("");
            $rootScope.setSession("");
            $window.location.href = '#/auth/signin';
        };

        $rootScope.notify =function(text){
            $rootScope.show(text);
            $window.setTimeout(function () {
              $rootScope.hide();
            }, 1999);
        };

        $rootScope.doRefresh = function (tab) {
            if(tab == 1)
                $rootScope.$broadcast('fetchAll');
            else if(tab == 2)
                $rootScope.$broadcast('fetchMy');
            
            $rootScope.$broadcast('scroll.refreshComplete');
        };

        //for passing variable across controllers
        //var variable = '55f77547c9d14703003499e3';

        $rootScope.setToken = function (token) {
            return $window.localStorage.token = token;
        }
        $rootScope.getToken = function () {
            return $window.localStorage.token;
        }

        $rootScope.setSession = function (session) {
            return $window.localStorage.staff = session;
        }

        $rootScope.setVar = function(value) {
            return window.localStorage.variable = value;
        }

        $rootScope.getVar = function() {
            return window.localStorage.variable;
        }

        $rootScope.isSessionActive = function () {
            return $window.localStorage.token ? true : false;
        }


        return {
            signup: function (form) {
                return $http.post(base+'/api/v1/diaspora/auth/register', form);

            },
            getAll: function (session) {
                return $http.get(base+'/api/v1/diaspora/data/list', {
                    method: 'GET',
                    params: {
                        token: session
                    }
                });
            },

            getOne: function (id, email) {
                return $http.get(base+'/api/v1/diaspora/data/item/' + id, {
                    method: 'GET',
                    params: {
                        token: email
                    }
                });
            },

            saveItem: function (form, email) {
                return $http.post(base+'/api/v1/diaspora/data/item', form, {
                    method: 'POST',
                    params: {
                        token: email
                    }
                });
            },
            putItem: function (id, form, email) {
                return $http.put(base+'/api/v1/diaspora/data/item/update/' + id, form, {
                    method: 'PUT',
                    params: {
                        token: email
                    }
                });
            },
            bookItem: function (id, form, email) {
                return $http.put(base+'/api/v1/diaspora/data/item/book/' + id, form, {
                    method: 'PUT',
                    params: {
                        token: email,
                        query: form
                    }
                });
            },
            deleteItem: function (id, email) {
                return $http.delete(base+'/api/v1/diaspora/data/item/' + id, {
                    method: 'DELETE',
                    params: {
                        token: email
                    }
                });
            },
            getappUser: function (session) {
                return $http.get(base+'/api/v1/diaspora/data/user', {
                    method: 'GET',
                    params: {
                        token: session
                    }
                })
            },
            getActivity: function (session) {
                return $http.get(base+'/api/v1/diaspora/data/activity', {
                    method: 'GET',
                    params: {
                        token: session
                    }
                })
            }

        }
    });
