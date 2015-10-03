angular.module('bucketList.controllers', ['bucketList.services'])

.controller('SignInCtrl',['$rootScope', '$scope', 'API', '$window', function ($rootScope, $scope, API, $window) {
    // if the user is already logged in, take him to his bucketlist
    if ($rootScope.isSessionActive()) {
        $window.location.href = ('#/bucket/list');
    }

    $scope.user = {
        email: "",
        password: ""
    };

    $scope.validateUser = function () {
        var email = this.user.email;
        var password = this.user.password;
        if(!email || !password) {
        	$rootScope.notify("Please enter valid credentials");
        	return false;
        }
        $rootScope.show('Please wait.. Authenticating');
        API.signin({
            email: email,
            password: password
        }).success(function (data) {
            $rootScope.hide();
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $window.location.href = ('#/bucket/list');
        }).error(function (error) {
            $rootScope.hide();
            $rootScope.notify("Invalid Username or password");
        });
    }

    $scope.validateStaff = function () {
        var accountUsername = this.user.accountUsername.toLocaleLowerCase().trim();
        var email = this.user.email;
        var password = this.user.password;
        if(!email || !password || !accountUsername) {
            $rootScope.notify("Please enter valid credentials");
            return false;
        }
        $rootScope.show('Please wait.. Authenticating');
        API.signinStaff({
            accountUsername:accountUsername,
            email: email,
            password: password
        }).success(function (data) {
            $rootScope.hide();
            $rootScope.setToken(accountUsername);
            $rootScope.setSession(email);
            $window.location.href = ('#/org/list');
        }).error(function (error) {
            $rootScope.hide();
            $rootScope.notify("Invalid Username or password");
        });
    }

}])

.controller('SignUpCtrl',['$rootScope','$scope','API','$window', function ($rootScope, $scope, API, $window){
    $scope.user = {
        email: "",
        password: "",
        name: ""
    };

    $scope.createUser = function () {
    	var email = this.user.email.toLowerCase();
        var password = this.user.password;
        var uName = this.user.name;
        if(!email || !password || !uName) {
        	$rootScope.notify("Please enter valid data");
        	return false;
        }
        $rootScope.show('Please wait.. Registering');
        API.signup({
            email: email,
            password: password,
            name: uName
        }).success(function (data) {
            $rootScope.hide();
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $window.location.href = ('#/bucket/list');
        }).error(function (error) {
            $rootScope.hide();
        	if(error.error && error.error.code == 11000)
        	{
        		$rootScope.notify("A user with this email already exists");
        	}
        	else
        	{
        		$rootScope.notify("Oops something went wrong, Please try again!");
        	}
            
        });
    }
        $scope.createOrg = function () {
            var staff = {
                email : this.user.email,
                password : this.user.password,
                uName : this.user.name,
                level : "1"
            }
            var orgName = this.user.orgName.toLowerCase();
            var orgType = this.user.orgType;
            var accountUsername = this.user.accountUsername.toLowerCase().trim();
            var street = this.user.street;
            var city = this.user.city;
            var state = this.user.state;
            var zip = this.user.zip;

            if(!staff.email || !staff.password || !staff.uName || !orgName || !orgType || !accountUsername) {
                $rootScope.notify("Please enter valid data");
                return false;
            }
            if(zip.length > 5){
                $rootScope.notify("Please enter only 5 digits for your zipcode");
                return false;
            }
            if(!street || !city || !state || !zip){
                $rootScope.notify("Please enter a valid address");
                return false;
            }
            $rootScope.show('Please wait.. Registering');
            API.signupOrg({
                orgName: orgName,
                orgType: orgType,
                street: street,
                city : city,
                state: state,
                zip : zip,
                accountUsername :accountUsername,
                staff: [staff],
                verified: false
            }).success(function (data) {
                $rootScope.hide();
                $rootScope.setToken(staff.email); // create a session kind of thing on the client side
                $window.location.href = ('#/bucket/list');
            }).error(function (error) {
                $rootScope.hide();
                if(error.error && error.error.code == 11000)
                {
                    $rootScope.notify("A user with this email already exists");
                }
                else
                {
                    $rootScope.notify("Oops something went wrong, Please try again!");
                }

            });
        }
}])

.controller('myListCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window) {

        $scope.session = $rootScope.getToken(); //Define session to be used to filter view.
    $rootScope.$on('fetchMy', function(){
            API.getYourList($rootScope.getToken()).success(function (data, status, headers, config) {
            $rootScope.show("Please wait... Processing");
            $scope.list = data;
            /*for (var i = 0; i < data.length; i++) {
                if (data[i].isCompleted == false) {
                    $scope.list.push(data[i]);
                }
            };*/
            if($scope.list.length == 0)
            {
                $scope.noData = true;
            }
            else
            {
                $scope.noData = false;
            }

            $ionicModal.fromTemplateUrl('templates/newItem.html', function (modal) {
                $scope.newTemplate = modal;
            });

            $scope.newTask = function () {
                 $scope.newTemplate.show();
            };
            $ionicModal.fromTemplateUrl('templates/editItem.html',{
                //scope: $scope
            }).then( function (modal)
            {
                $scope.editTemplate = modal;
            });

            $scope.editTask = function (id) {
                $rootScope.setVar(id);
                $scope.editTemplate.show();
            };
            $rootScope.hide();

                $scope.reveal = [];

                $scope.descriptLen = function(desc, reveal){

                    var text;
                    var length = 200;
                    var symbol = '';
                    if(!desc){
                        text = '';
                    }
                    else if(reveal == false || !reveal){
                        if(desc.length > length){
                            symbol = '...'
                        }
                        text = desc.substring(0, length) + symbol;
                    }
                    else{
                        text = desc;
                    }

                    return text;

                }

                $scope.moreDesc = function(reveal, index){
                    if(reveal == false){
                        $scope.reveal[index] = true;
                    }
                    else{
                        $scope.reveal[index] = false;
                    }
                }
        }).error(function (data, status, headers, config) {
            $rootScope.hide();
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });
    });

    $rootScope.$broadcast('fetchMy');

    $scope.markCompleted = function (id) {
        $rootScope.show("Please wait... Updating List");
        API.putItem(id, {
            isCompleted: true
        }, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(2);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };


        $ionicModal.fromTemplateUrl('templates/newItem.html', function (modal) {
            $scope.newTemplate = modal;
        });

        $scope.newTask = function () {
            $scope.newTemplate.show();
        };

        $ionicModal.fromTemplateUrl('templates/editItem.html',{
            //scope: $scope
        }).then( function (modal)
        {
            $scope.editTemplate = modal;
        });
        $scope.editTask = function (id) {
           $rootScope.setVar(id);
            $scope.editTemplate.show();
        };

    $scope.deleteItem = function (id) {
        $rootScope.show("Please wait... Deleting from List");
        API.deleteItem(id, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(2);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };

})

.controller('allListCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window) {

    $scope.session = $rootScope.getToken(); //Define session to be used to filter view.
    $rootScope.$on('fetchAll', function(){
        API.getAll($rootScope.getToken()).success(function (data, status, headers, config) {
            $rootScope.show("Please wait... Processing");
            $scope.list = data;
            /*for (var i = 0; i < data.length; i++) {
                if (data[i].isCompleted == false) {
                    $scope.list.push(data[i]);
                }
            }*/
            if($scope.list.length == 0)
            {
                $scope.noData = true;
            }
            else
            {
                $scope.noData = false;
            }

           $scope.reveal = [];

            $scope.descriptLen = function(desc, reveal){

                var text;
                var length = 200;
                var symbol = '';
                if(!desc){
                   text = '';
                }
                else if(reveal == false || !reveal){
                    if(desc.length > length){
                        symbol = '...'
                    }
                    text = desc.substring(0, length) + symbol;
                }
                else{
                    text = desc;
                }

                return text;

            }

            $scope.moreDesc = function(reveal, index){
                if(reveal == false){
                    $scope.reveal[index] = true;
                }
                else{
                    $scope.reveal[index] = false;
                }
            }


            $rootScope.hide();
        }).error(function (data, status, headers, config) {
            $rootScope.hide();
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });
    });

    $rootScope.$broadcast('fetchAll');

    $scope.markBooked = function (id) {
        $rootScope.show("Please wait... Reaching Out");
        API.bookItem(id, {$push: {booked:{
            email: $rootScope.getToken(),
            when: new Date()
        }}}, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };

    $scope.unBooked = function (id) {
        $rootScope.show("Please wait... Processing Your Request");
        API.bookItem(id, {$pull: {booked:{
            email: $rootScope.getToken()
        }}}, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };

    $scope.checkBooked = function(item) {
        var isBooked;

        if(item.booked.length == 0) {
            isBooked = false;
        }

       item.booked.forEach(function(user){

            if(user.email == $rootScope.getToken()) {
                isBooked = true;
            }
            else {
                isBooked = false;
            }
        })
        return isBooked;
    };



})


.controller('reservedCtrl', function ($rootScope, $scope, API, $window) {
        $rootScope.$on('fetchAll', function () {
            API.getAll($rootScope.getToken()).success(function (data, status, headers, config) {
                $scope.list = data;

                if($scope.list.length == 0)
                {
                    $scope.noData = true;
                }
                else
                {
                    $scope.noData = false;
                }

                $scope.reveal = [];

                $scope.descriptLen = function(desc, reveal){

                    var text;
                    var length = 200;
                    var symbol = '';
                    if(!desc){
                        text = '';
                    }
                    else if(reveal == false || !reveal){
                        if(desc.length > length){
                            symbol = '...'
                        }
                        text = desc.substring(0, length) + symbol;
                    }
                    else{
                        text = desc;
                    }

                    return text;

                }

                $scope.moreDesc = function(reveal, index){
                    if(reveal == false){
                        $scope.reveal[index] = true;
                    }
                    else{
                        $scope.reveal[index] = false;
                    }
                }





            }).error(function (data, status, headers, config) {
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });

        });
        
        $rootScope.$broadcast('fetchAll');



        $scope.markBooked = function (id) {
            $rootScope.show("Please wait... Reaching Out");
            API.bookItem(id, {$push: {booked:{
                email: $rootScope.getToken(),
                when: new Date()
            }}}, $rootScope.getToken())
                .success(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.doRefresh(1);
                }).error(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                });
        };

        $scope.unBooked = function (id) {
            $rootScope.show("Please wait... Processing Your Request");
            API.bookItem(id, {$pull: {booked:{
                email: $rootScope.getToken()
            }}}, $rootScope.getToken())
                .success(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.doRefresh(1);
                }).error(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                });
        };

        $scope.checkBooked = function(item) {
            var isBooked;

            if(item.booked.length == 0) {
                isBooked = false;
            }

            item.booked.forEach(function(user){

                if(user.email == $rootScope.getToken()) {
                    isBooked = true;
                }
                else {
                    isBooked = false;
                }
            })
            return isBooked;
        };

    })

.controller('newCtrl', function ($rootScope, $scope, API, $window) {
        $scope.data = {
	        item: "",
            customFields: []
	    };

        $scope.addField = function() {
            $scope.data.customFields.push({
                label: this.custom.label,
                value: this.custom.value
            })

            $scope.addSection = false;
        }

        $scope.close = function () {
            $scope.modal.hide();
        };

        $scope.createNew = function () {
			var data = this.data;
        	if (!data) return;
            $scope.modal.hide();
            $rootScope.show();
            
            //$rootScope.show("Please wait... Creating new");

            var form = {
                type: data.type,
                capacity: data.capacity,
                booked: [],
                availableOverride: null,
                title: data.title,
                isActive: true,
                created: Date.now(),
                updated: Date.now(),
                accountUsername: $rootScope.getToken(),
                location: data.location,
                description: data.description,
                customFields: $scope.data.customFields
            }

            API.saveItem(form, form.accountUsername)
                .success(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.doRefresh(1);
                })
                .error(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                });
        };
    })

.controller('editCtrl', function ($rootScope, $scope, API, $window) {

    API.getOneOrg($rootScope.getVar(), $rootScope.getToken())
        .success(function(data, status, headers, config){
        $scope.item = data;
            $rootScope.setVar("");
    });

    $scope.close = function () {
        $scope.modal.hide();
    };

    $scope.createEdit = function (id) {
        var data = this.data;
        if (!data) return;
        $scope.modal.hide();
        $rootScope.show();

        $rootScope.show("Please wait... Updating");

        var form = {
            capacity: data.capacity,
            availableOverride: null,
            title: data.title,
            updated: Date.now(),
            //accountUsername: $rootScope.getToken(),
            location: data.location,
            description: data.description
        }

        API.putItem(id, form, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            })
            .error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };
})

    .controller('myProfileCtrl', function ($rootScope, $scope, API, $window) {

        API.getappUser($rootScope.getToken())
            .success(function (data, status, headers, config){
                $scope.user = data;
            })
            .error(function(data, status, headers, config){
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            })

        $rootScope.$on('fetchActivity', function(){
            API.getActivity($rootScope.getToken()).success(function (data, status, headers, config) {
                $rootScope.show("Please wait... Processing");
                $scope.activity = data;
                /*for (var i = 0; i < data.length; i++) {
                 if (data[i].isCompleted == false) {
                 $scope.list.push(data[i]);
                 }
                 }*/

                $rootScope.hide();
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
        });

        $rootScope.$broadcast('fetchActivity');

        $scope.edit = function(){
            $window.location.href = ('#/bucket/edit');
        }
    })

    .controller('myProfileCtrl', function ($rootScope, $scope, API, $window) {

        API.getappUser($rootScope.getToken())
            .success(function (data, status, headers, config){
                $scope.user = data;
            })
            .error(function(data, status, headers, config){
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            })

        $rootScope.$on('fetchActivity', function(){
            API.getActivity($rootScope.getToken()).success(function (data, status, headers, config) {
                $rootScope.show("Please wait... Processing");
                $scope.activity = data;
                /*for (var i = 0; i < data.length; i++) {
                 if (data[i].isCompleted == false) {
                 $scope.list.push(data[i]);
                 }
                 }*/

                $rootScope.hide();
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
        });

        $rootScope.$broadcast('fetchActivity');

        $scope.edit = function(){
            $window.location.href = ('#/bucket/edit');
        }
    })
    .controller('editProfileCtrl', function ($rootScope, $scope, API, $window) {

    })
//ORG PROFILE FUNCTION
    .controller('orgProfileCtrl', function ($scope ,$rootScope, API, $window) {
        $scope.model = [];
        $scope.addSection = false;
        var getOrg = API.getappOrg($rootScope.getToken())
            .success(function (data, status, headers, config){
                $scope.org = data;

                for(var i = 0; i < data.staff.length;i++) {
                    if(data.staff[i].email == $rootScope.getSession()) {
                        $scope.staffMember = data.staff[i];
                    }
                }
            })
            .error(function(data, status, headers, config){
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
        getOrg;




        //fetchActivity
        $rootScope.$on('fetchActivity', function(){
            API.getActivity($rootScope.getToken()).success(function (data, status, headers, config) {
                $rootScope.show("Please wait... Processing");
                $scope.activity = data;
                /*for (var i = 0; i < data.length; i++) {
                 if (data[i].isCompleted == false) {
                 $scope.list.push(data[i]);
                 }
                 }*/

                $rootScope.hide();
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
        });

        $rootScope.$broadcast('fetchActivity');

        $scope.edit = function(){
            $window.location.href = ('#/bucket/edit');
        }

        $scope.updatePassword = function (id, index){
            var password = this.model[index].password;
            $scope.org.staff[index].password = password;
            API.updateStaff($scope.org.staff, $rootScope.getToken())
                .success(function(data, status, headers, config) {
                    $rootScope.notify("This members password has been updated.");
                })
                .error(function(data, status, headers, config){
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                });
        };

        $scope.createStaff = function (id) {
            if(this.data) {
                var staff = {
                    email: this.data.email,
                    password: this.data.password,
                    level: this.data.level
                };
                $scope.org.staff.push(staff);
                $scope.addSection = false;
            }
            else {
                return;
                $rootScope.notify("Please add more information");
            }
            API.updateStaff($scope.org.staff, $rootScope.getToken())
                .success(function(data, status, headers, config) {
                    $rootScope.notify("Please wait.. adding new member");
                    getOrg;
                })
                .error(function(data, status, headers, config){
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                });
        };
    })