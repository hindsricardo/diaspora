/**
 * Created by rhinds on 9/1/15.
 */

//Dummy TEST CASES FOR ANGUALR
describe("SignUpCtrl", function() {

    var controller,
        API;
    beforeEach(module('bucketList'));

    beforeEach(module(function ($provide) {
        $provide.value('API', {});
    }));

    beforeEach(inject(function (
        $rootScope,
        $controller,
        $ionicModal,
        $ionicPopup,
        $stateParams,
        $timeout,
        $state,
        $window) {

        scope = $rootScope.$new();

        controller = $controller('SignUpCtrl',{
            $ionicModal: $ionicModal,
            $ionicPopup: $ionicPopup,
            $state: $state,
            $window :$window,
            $scope: $rootScope


        });

    }));

    describe("UserSignUp",function(){
        //call createUser on controller

        it("check is user exists in scope", function(){
        });
    });



});
