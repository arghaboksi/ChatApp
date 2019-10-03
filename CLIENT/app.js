var app = angular.module('ChatApp', ['ngRoute','userCtrl']);
let loginflag=0;
//var socket;
app.config(function ($routeProvider) {
    $routeProvider
        .when('/',{
            templateUrl:'templates/home.html'
        })
         .when('/login', {
             templateUrl: 'templates/login.html',
             controller: 'loginController',
             controllerAs: 'login'
        })
        .when('/login/dashboard',{  
            templateUrl:'templates/dashboard.html',
            controller: 'chatController',         
            controllerAs: 'chat',
            resolve: {
                result:function($location){
                    //socket=io.connect('http://localhost:8080/login/dashboard');
                    if(loginflag!=0){
                        // loginflag=0;
                        return true;
                    }           
                    else if(loginflag==0){                                                                                                                                                                                                                   
                        alert("Please Login first");
                        $location.path('/login');
                    }      
                }    
            }
        })
        .when('/register', {   
            templateUrl: 'templates/register.html',
            controller: 'registerController',
            controllerAs:'register'  
        })
        .when('/forgotPassword', {
            templateUrl: 'templates/forgotPassword.html',
            controller: 'forgotPasswordController',
            controllerAs:'forgotPass'
        })
        .when('/forgotPassword/:id',{
            templateUrl: 'templates/resetPassword.html',
            controller: 'resetPasswordController',
            controllerAs: 'resetPass',
            resolve: {
                result: function ($route,$location) {
                     token= $route.current.params.id;
                    if (($route.current.params.id != null)){
                        return true;
                    }
                    else 
                        $location.path('/login');
                }
            }
        })
        /*.when('/login/reset', {
            templateUrl: 'templates/resetPassword.html',
            controller: 'loginController',
            controllerAs: 'login'

        })*/
        .otherwise({
            redirectTo: '/'
        });
});
